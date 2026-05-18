import "server-only";

import { Storage, type File } from "@google-cloud/storage";
import {
  getMockDocumentById,
  getMockDocuments,
  type CaseTechDocument,
  type DocumentFileType,
} from "@/lib/mock-documents";

const GCS_ID_PREFIX = "gcs-";

function hasStorageConfig() {
  return Boolean(
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
      process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
  );
}

function getStorage() {
  return new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT_ID });
}

export function getGcsDocumentId(bucketPath: string) {
  return `${GCS_ID_PREFIX}${Buffer.from(bucketPath).toString("base64url")}`;
}

export function getBucketPathFromDocumentId(id: string) {
  if (!id.startsWith(GCS_ID_PREFIX)) return undefined;

  try {
    return Buffer.from(id.slice(GCS_ID_PREFIX.length), "base64url").toString("utf8");
  } catch {
    return undefined;
  }
}

function getFileType(name: string, contentType?: string): DocumentFileType {
  const lowerName = name.toLowerCase();

  if (contentType === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
  if (
    contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    return "docx";
  }
  if (contentType?.startsWith("text/") || lowerName.endsWith(".txt")) return "txt";

  return "unknown";
}

function humanize(value: string) {
  return value
    .replace(/\.[^/.]+$/, "")
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getDocumentType(title: string) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("service manual")) return "Service Manual";
  if (lowerTitle.includes("troubleshooting")) return "Troubleshooting Guide";
  if (lowerTitle.includes("error code")) return "Error Code Guide";
  if (lowerTitle.includes("bulletin")) return "Field Bulletin";
  if (lowerTitle.includes("guide")) return "Service Guide";

  return "Uploaded Document";
}

function getEquipmentType(folder?: string) {
  const normalized = folder?.toLowerCase();

  if (!normalized) return "Unspecified";
  if (normalized.includes("drive")) return "Drive-Up Equipment";
  if (normalized.includes("camera") || normalized.includes("nvr")) return "Camera";
  if (normalized.includes("alarm")) return "Alarm";
  if (normalized.includes("tcr")) return "TCR";
  if (normalized.includes("atm")) return "ATM";

  return humanize(folder ?? "Unspecified");
}

function fileToDocument(file: File): CaseTechDocument {
  const parts = file.name.split("/").filter(Boolean);
  const fileName = parts.at(-1) ?? file.name;
  const title = humanize(fileName);
  const manufacturer = parts.length > 1 ? humanize(parts[1]) : "Unspecified";

  return {
    id: getGcsDocumentId(file.name),
    title,
    documentType: getDocumentType(title),
    equipmentType: getEquipmentType(parts[0]),
    manufacturer,
    model: "Unspecified",
    fileType: getFileType(file.name, file.metadata.contentType),
    bucketPath: file.name,
    uploadDate: file.metadata.updated ?? file.metadata.timeCreated ?? new Date().toISOString(),
    tags: parts.slice(0, -1).map(humanize).filter(Boolean),
    description: `Uploaded document from Google Cloud Storage path ${file.name}.`,
    sampleSnippet:
      "This document was loaded from the configured Google Cloud Storage bucket. Search snippets will appear after metadata is available from indexing.",
  };
}

export async function getStorageDocuments(): Promise<CaseTechDocument[]> {
  if (!hasStorageConfig()) {
    return [];
  }

  try {
    const [files] = await getStorage()
      .bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET as string)
      .getFiles({ autoPaginate: true });

    return files
      .filter((file) => !file.name.endsWith("/"))
      .map(fileToDocument)
      .sort((a, b) => Date.parse(b.uploadDate) - Date.parse(a.uploadDate));
  } catch (error) {
    console.error("Cloud Storage document listing failed", error);
    return [];
  }
}

export async function getDocuments(): Promise<CaseTechDocument[]> {
  const storageDocuments = await getStorageDocuments();
  return storageDocuments.length > 0 ? storageDocuments : getMockDocuments();
}

export async function getDocumentById(id: string): Promise<CaseTechDocument | undefined> {
  const mockDocument = getMockDocumentById(id);
  if (mockDocument) return mockDocument;

  const bucketPath = getBucketPathFromDocumentId(id);
  if (!bucketPath || !hasStorageConfig()) return undefined;

  try {
    const file = getStorage()
      .bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET as string)
      .file(bucketPath);
    const [exists] = await file.exists();

    if (!exists) return undefined;

    const [metadata] = await file.getMetadata();
    file.metadata = metadata;
    return fileToDocument(file);
  } catch (error) {
    console.error("Cloud Storage document lookup failed", error);
    return undefined;
  }
}

export async function getRelatedDocuments(document: CaseTechDocument) {
  const documents = await getDocuments();

  return documents
    .filter((candidate) => candidate.id !== document.id)
    .filter(
      (candidate) =>
        candidate.equipmentType === document.equipmentType ||
        candidate.manufacturer === document.manufacturer ||
        candidate.tags.some((tag) => document.tags.includes(tag)),
    )
    .slice(0, 3);
}
