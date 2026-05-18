export type DocumentFileType = "pdf" | "docx" | "txt" | "unknown";

export type CaseTechDocument = {
  id: string;
  title: string;
  documentType: string;
  equipmentType: string;
  manufacturer: string;
  model: string;
  fileType: DocumentFileType;
  bucketPath: string;
  publicUrl?: string;
  uploadDate: string;
  tags: string[];
  description: string;
  sampleSnippet: string;
  aiSummary?: string;
  mockText?: string;
};

export const mockDocuments: CaseTechDocument[] = [
  {
    id: "ncr-6622-service-manual",
    title: "NCR 6622 Service Manual",
    documentType: "Service Manual",
    equipmentType: "ATM",
    manufacturer: "NCR",
    model: "6622",
    fileType: "pdf",
    bucketPath: "manuals/atm/ncr/ncr-6622-service-manual.pdf",
    publicUrl: "/mock-documents/casetech-mock-document.pdf",
    uploadDate: "2026-04-18",
    tags: ["dispense path", "jam", "cassette", "presenter", "6622"],
    description:
      "Primary field service manual for NCR 6622 dispenser diagnostics, media path recovery, and module replacement.",
    sampleSnippet:
      "Dispense path jam conditions are typically caused by note skew, transport sensor contamination, or cassette pick failure.",
    aiSummary:
      "The matching section focuses on safe jam recovery, sensor cleaning, purge bin inspection, and diagnostic dispense tests before replacing dispenser parts.",
  },
  {
    id: "hyosung-atm-dispenser-troubleshooting",
    title: "Hyosung ATM Dispenser Troubleshooting Guide",
    documentType: "Troubleshooting Guide",
    equipmentType: "ATM",
    manufacturer: "Hyosung",
    model: "MX Series",
    fileType: "pdf",
    bucketPath: "manuals/atm/hyosung/dispenser-troubleshooting-guide.pdf",
    publicUrl: "/mock-documents/casetech-mock-document.pdf",
    uploadDate: "2026-03-27",
    tags: ["hyosung", "cash dispenser", "rejects", "feed errors"],
    description:
      "Step-by-step diagnostic guide for Hyosung cash dispenser feed, reject, and presenter faults.",
    sampleSnippet:
      "Verify cassette pressure, inspect the reject path, and confirm the presenter sensor changes state during dispense tests.",
    aiSummary:
      "Use this guide when repeated feed errors continue after media removal and cassette reseating.",
  },
  {
    id: "glory-tcr-error-code-guide",
    title: "Glory TCR Error Code Guide",
    documentType: "Error Code Guide",
    equipmentType: "TCR",
    manufacturer: "Glory",
    model: "RBG / Vertera",
    fileType: "docx",
    bucketPath: "guides/tcr/glory/glory-tcr-error-code-guide.docx",
    uploadDate: "2026-02-11",
    tags: ["tcr", "error codes", "cash recycler", "glory"],
    description:
      "Field reference for common Glory recycler error codes, corrective actions, and escalation criteria.",
    sampleSnippet:
      "For note validator faults, clear the transport, reseat the cassette bay, and run a denomination recognition test.",
  },
  {
    id: "axis-camera-offline-bulletin",
    title: "Axis Camera Offline Troubleshooting Bulletin",
    documentType: "Field Bulletin",
    equipmentType: "Camera",
    manufacturer: "Axis",
    model: "P32 / M30 Series",
    fileType: "txt",
    bucketPath: "bulletins/cameras/axis-camera-offline-troubleshooting.txt",
    uploadDate: "2026-01-29",
    tags: ["camera offline", "poe", "nvr", "network"],
    description:
      "Quick field bulletin for offline Axis cameras after branch network or PoE switch events.",
    sampleSnippet:
      "Confirm PoE budget, link light, DHCP lease, and NVR camera credentials before replacing the endpoint.",
    mockText:
      "Axis Camera Offline Troubleshooting Bulletin\n\n1. Confirm the camera has link and PoE power at the switch.\n2. Check whether the device received a DHCP lease or still responds on its reserved address.\n3. Verify NVR credentials and camera time sync.\n4. Reboot the PoE port and confirm live video returns before replacing hardware.",
  },
  {
    id: "drive-up-equipment-service-guide",
    title: "Drive-Up Equipment Service Guide",
    documentType: "Service Guide",
    equipmentType: "Drive-Up Equipment",
    manufacturer: "Hamilton",
    model: "Audio / Pneumatic Lane",
    fileType: "unknown",
    bucketPath: "guides/drive-up/drive-up-equipment-service-guide.bin",
    uploadDate: "2025-12-08",
    tags: ["drive-up", "audio", "pneumatic", "lane"],
    description:
      "Consolidated service guide for teller audio, pneumatic carrier, drawer, and lane status issues.",
    sampleSnippet:
      "Isolate lane issues by checking teller audio, lane controller status, carrier sensor state, and compressor operation.",
  },
];

export function getMockDocuments() {
  return mockDocuments;
}

export function getMockDocumentById(id: string) {
  return mockDocuments.find((document) => document.id === id);
}

export function getRelatedMockDocuments(document: CaseTechDocument) {
  return mockDocuments
    .filter((candidate) => candidate.id !== document.id)
    .filter(
      (candidate) =>
        candidate.equipmentType === document.equipmentType ||
        candidate.tags.some((tag) => document.tags.includes(tag)),
    )
    .slice(0, 3);
}

export function getDocumentIdFromPath(sourcePath: string) {
  const match = sourcePath.match(/\/documents\/([^/?#]+)/);
  return match?.[1];
}

export function findMockDocumentForSearchResult({
  id,
  title,
  sourceUrl,
}: {
  id?: string;
  title: string;
  sourceUrl: string;
}) {
  const sourceId = getDocumentIdFromPath(sourceUrl);
  return (
    (id ? getMockDocumentById(id) : undefined) ??
    (sourceId ? getMockDocumentById(sourceId) : undefined) ??
    mockDocuments.find((document) => document.title === title)
  );
}
