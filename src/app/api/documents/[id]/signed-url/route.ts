import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";
import { getBucketPathFromDocumentId, getDocumentById } from "@/lib/documents";

export const runtime = "nodejs";

const SIGNED_URL_TTL_MS = 15 * 60 * 1000;

type SignedUrlRouteContext = {
  params: Promise<{ id: string }>;
};

function getPublicUrl(requestUrl: string, publicUrl?: string) {
  if (!publicUrl) return undefined;

  return publicUrl.startsWith("http") ? publicUrl : new URL(publicUrl, requestUrl).toString();
}

function canUseCloudStorage() {
  return Boolean(
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
      process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
  );
}

function responseForUrl(request: Request, url: string, expiresAt: string) {
  const { searchParams } = new URL(request.url);

  if (searchParams.has("redirect") || searchParams.has("download")) {
    return NextResponse.redirect(url);
  }

  return NextResponse.json({ url, expiresAt });
}

export async function GET(request: Request, { params }: SignedUrlRouteContext) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const expiresAtDate = new Date(Date.now() + SIGNED_URL_TTL_MS);
  const expiresAt = expiresAtDate.toISOString();
  const fallbackUrl = getPublicUrl(request.url, document.publicUrl);

  const isGcsDocument = Boolean(getBucketPathFromDocumentId(id));

  if (canUseCloudStorage() && (isGcsDocument || !document.publicUrl)) {
    try {
      const storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      });
      const file = storage
        .bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET as string)
        .file(document.bucketPath);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: expiresAtDate,
        version: "v4",
      });

      return responseForUrl(request, url, expiresAt);
    } catch (error) {
      console.error("Cloud Storage signed URL generation failed", error);
    }
  }

  if (fallbackUrl) {
    return responseForUrl(request, fallbackUrl, expiresAt);
  }

  return NextResponse.json(
    { error: "Signed URL unavailable and no public fallback exists" },
    { status: 503 },
  );
}
