export const SERVICE_ICONS = [
  "wrench",
  "car",
  "truck",
  "settings",
  "home",
  "sparkles",
  "shield",
  "package",
] as const;

export type ServiceIcon = (typeof SERVICE_ICONS)[number];
