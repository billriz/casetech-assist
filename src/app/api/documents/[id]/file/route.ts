import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join, normalize } from "node:path";
import { Readable } from "node:stream";
import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";
import { getBucketPathFromDocumentId, getDocumentById } from "@/lib/documents";

export const runtime = "nodejs";

type FileRouteContext = {
  params: Promise<{ id: string }>;
};

function canUseCloudStorage() {
  return Boolean(
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
      process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
  );
}

function getContentType(fileType: string) {
  if (fileType === "pdf") return "application/pdf";
  if (fileType === "txt") return "text/plain; charset=utf-8";
  if (fileType === "docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return "application/octet-stream";
}

function getLocalPublicPath(publicUrl: string) {
  if (!publicUrl.startsWith("/")) return undefined;

  const normalizedPath = normalize(publicUrl)
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .replace(/^[/\\]+/, "");
  return join(process.cwd(), "public", normalizedPath);
}

export async function GET(request: Request, { params }: FileRouteContext) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const isGcsDocument = Boolean(getBucketPathFromDocumentId(id));

  if (canUseCloudStorage() && (isGcsDocument || !document.publicUrl)) {
    try {
      const file = new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT_ID })
        .bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET as string)
        .file(document.bucketPath);
      const nodeStream = file.createReadStream();

      return new Response(Readable.toWeb(nodeStream) as ReadableStream, {
        headers: {
          "Cache-Control": "private, max-age=300",
          "Content-Disposition": `inline; filename="${document.title.replace(/"/g, "")}"`,
          "Content-Type": getContentType(document.fileType),
        },
      });
    } catch (error) {
      console.error("Cloud Storage file streaming failed", error);
    }
  }

  if (document.publicUrl) {
    const localPath = getLocalPublicPath(document.publicUrl);

    if (localPath) {
      try {
        const fileStat = await stat(localPath);
        const nodeStream = createReadStream(localPath);

        return new Response(Readable.toWeb(nodeStream) as ReadableStream, {
          headers: {
            "Cache-Control": "private, max-age=300",
            "Content-Length": String(fileStat.size),
            "Content-Type": getContentType(document.fileType),
          },
        });
      } catch (error) {
        console.error("Local fallback file streaming failed", error);
      }
    }

    return NextResponse.redirect(new URL(document.publicUrl, request.url));
  }

  return NextResponse.json({ error: "Document file unavailable" }, { status: 503 });
}
