import {
  AlertTriangle,
  Banknote,
  BellRing,
  Camera,
  CircleHelp,
  Clock3,
  FileArchive,
  FileText,
  Gauge,
  Heart,
  Home,
  LifeBuoy,
  MonitorUp,
  PackageSearch,
  Search,
  Settings,
  ShieldCheck,
  UploadCloud,
  Wrench,
} from "lucide-react";

export const navigationItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Upload Document", href: "/upload", icon: UploadCloud },
  { label: "My Favorites", href: "#", icon: Heart },
  { label: "Recent", href: "#", icon: Clock3 },
  { label: "Field Fixes", href: "#", icon: Wrench },
  { label: "Equipment", href: "#", icon: PackageSearch },
  { label: "Settings", href: "#", icon: Settings },
  { label: "Help & Support", href: "#", icon: LifeBuoy },
];

export const popularSearches = [
  "NCR 6622 Jam",
  "TCR Cash Recycler Error",
  "Camera Offline",
  "Alarm Trouble",
  "Drive-Up Not Responding",
];

export const equipmentCategories = [
  {
    title: "ATMs",
    description: "NCR, Diebold, Hyosung dispensers and deposit modules",
    icon: Banknote,
    count: "184 docs",
  },
  {
    title: "TCRs",
    description: "Recycler cassettes, note validators, reject handling",
    icon: Gauge,
    count: "96 docs",
  },
  {
    title: "Alarms",
    description: "Panel faults, zones, contacts, service resets",
    icon: BellRing,
    count: "72 docs",
  },
  {
    title: "Cameras",
    description: "NVR status, lens issues, offline cameras",
    icon: Camera,
    count: "141 docs",
  },
  {
    title: "Drive-Up Equipment",
    description: "Pneumatic lanes, audio, drawers, signage",
    icon: MonitorUp,
    count: "63 docs",
  },
  {
    title: "View All Equipment",
    description: "Browse full equipment library and field bulletins",
    icon: FileArchive,
    count: "556 assets",
  },
];

export const announcements = [
  {
    title: "NCR dispenser firmware bulletin updated",
    detail: "Revision 24.3 adds guidance for repeated purge errors after cassette swap.",
  },
  {
    title: "Weekend maintenance window",
    detail: "Knowledge base indexing will run Saturday 02:00-04:00 UTC.",
  },
];

export const recentSearches = [
  "Opteva card reader not initializing",
  "Verint camera offline after power cycle",
  "Diebold safe door sensor open",
  "Hamilton audio lane no response",
];

export const trustCards = [
  {
    title: "Trusted Information",
    description: "Manuals, bulletins, and approved field fixes organized by equipment.",
    icon: ShieldCheck,
  },
  {
    title: "Secure & Reliable",
    description: "Designed for internal service workflows and branch troubleshooting.",
    icon: AlertTriangle,
  },
  {
    title: "Built for Field Techs",
    description: "Fast lookup by model, symptom, error code, part number, and fix notes.",
    icon: CircleHelp,
  },
];

export const documentResults = [
  {
    title: "NCR 6622 Service Manual",
    type: "Service Manual",
    page: "Page 43",
    snippet:
      "Dispense path jam conditions are typically caused by note skew, transport sensor contamination, or cassette pick failure.",
    match: 96,
  },
  {
    title: "NCR S2 Dispenser Field Bulletin FB-2217",
    type: "Field Bulletin",
    page: "Page 3",
    snippet:
      "For recurring jams at the presenter, inspect throat rollers and verify purge bin seating before replacing the pick module.",
    match: 91,
  },
  {
    title: "ATM Cash Module Quick Reference",
    type: "Quick Guide",
    page: "Page 12",
    snippet:
      "Run presenter clear, remove residual media, clean dispense sensors, then execute single-note test dispense.",
    match: 87,
  },
];

export const aiSteps = [
  "Power down the dispenser module and remove cassette 2 before clearing any trapped media.",
  "Inspect the pick area for curled notes, torn currency, or foreign material near the throat sensor.",
  "Clean transport and presenter sensors with approved swabs, then reseat the purge bin.",
  "Run diagnostic dispense tests from cassette 2 and confirm no repeat 6622-231 jam code appears.",
  "If the fault repeats, compare roller wear against the service manual replacement threshold.",
];

export const documentOutline = [
  "5.1 Dispenser Overview",
  "5.2 Jam Recovery",
  "5.2.1 Dispense Path Jam",
  "5.2.2 Presenter Jam",
  "5.3 Cassette Diagnostics",
  "5.4 Sensor Cleaning",
  "Appendix B Error Codes",
];

export const uploadOptions = {
  documentTypes: [
    "Service Manual",
    "Field Bulletin",
    "Quick Guide",
    "Install Guide",
    "Troubleshooting Note",
  ],
  equipmentTypes: ["ATM", "TCR", "Alarm", "Camera", "Drive-Up Equipment"],
  manufacturers: ["NCR", "Diebold Nixdorf", "Hyosung", "Verint", "Bosch", "Hamilton"],
};

export const quickMetrics = [
  { label: "Documents", value: "556", icon: FileText },
  { label: "Field Fixes", value: "128", icon: Wrench },
  { label: "Open Bulletins", value: "14", icon: AlertTriangle },
];
