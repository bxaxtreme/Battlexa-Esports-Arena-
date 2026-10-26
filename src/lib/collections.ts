export const COLLECTIONS = ["tournaments", "scrims", "results", "news"] as const;
export type ContentCollection = (typeof COLLECTIONS)[number];

export function isContentCollection(value: string): value is ContentCollection {
  return (COLLECTIONS as readonly string[]).includes(value);
}
