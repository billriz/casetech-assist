"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SignedUrlResponse = {
  url: string;
  expiresAt: string;
};

export function DocumentActions({
  documentId,
  fallbackUrl,
  backHref = "/search",
}: {
  documentId: string;
  fallbackUrl?: string;
  backHref?: string;
}) {
  const [downloadUrl, setDownloadUrl] = useState(fallbackUrl ?? "");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/documents/${encodeURIComponent(documentId)}/signed-url`, {
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Signed URL request failed");
        }

        return response.json() as Promise<SignedUrlResponse>;
      })
      .then((payload) => {
        if (isMounted) {
          setDownloadUrl(payload.url);
        }
      })
      .catch(() => {
        if (isMounted && fallbackUrl) {
          setDownloadUrl(fallbackUrl);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [documentId, fallbackUrl]);

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={backHref}
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-[#0E2A4C]"
      >
        <ArrowLeft className="size-4" />
        Back to results
      </Link>
      <Button variant="secondary" onClick={() => setIsFavorite((current) => !current)}>
        <Heart
          className={cn("size-4", isFavorite && "fill-accent text-accent")}
        />
        Favorite
      </Button>
      <a
        href={downloadUrl || undefined}
        download
        target="_blank"
        rel="noreferrer"
        aria-disabled={!downloadUrl}
        className={cn(
          "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(30,136,255,0.24)] transition hover:bg-[#3BA7FF]",
          !downloadUrl && "pointer-events-none opacity-50",
        )}
      >
        <Download className="size-4" />
        Download
      </a>
    </div>
  );
}
