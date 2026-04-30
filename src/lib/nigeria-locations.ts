import nigeriaLocationsRaw from "@/data/nigeria-states-lgas-wards.json";

type NigeriaLocationWard = {
  lga: string;
  wards: string[];
};

type NigeriaLocationState = {
  state: string;
  lgas: NigeriaLocationWard[];
};

export type LocationOption = {
  value: string;
  label: string;
};

const nigeriaLocations = nigeriaLocationsRaw as NigeriaLocationState[];

const specialStateLabels: Record<string, string> = {
  abuja: "FCT (Abuja)",
};

const stateBySlug = new Map(nigeriaLocations.map((item) => [item.state, item]));

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\((.*?)\)/g, " $1 ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toLabelFromSlug(slug: string) {
  if (specialStateLabels[slug]) {
    return specialStateLabels[slug];
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveStateSlug(stateValue: string) {
  const normalized = normalizeKey(stateValue);
  if (
    normalized === "fct" ||
    normalized === "fct-abuja" ||
    normalized === "federal-capital-territory" ||
    normalized === "abuja"
  ) {
    return "abuja";
  }

  if (stateBySlug.has(normalized)) {
    return normalized;
  }

  return null;
}

function resolveLgaSlug(stateSlug: string, lgaValue: string) {
  const normalizedLga = normalizeKey(lgaValue);
  const stateRecord = stateBySlug.get(stateSlug);
  if (!stateRecord) {
    return null;
  }

  const match = stateRecord.lgas.find((entry) => normalizeKey(entry.lga) === normalizedLga);
  return match?.lga ?? null;
}

export const nigeriaStateOptions: LocationOption[] = nigeriaLocations.map((item) => ({
  value: item.state,
  label: toLabelFromSlug(item.state),
}));

export function getLgaOptionsByState(stateValue: string): LocationOption[] {
  const stateSlug = resolveStateSlug(stateValue);
  if (!stateSlug) {
    return [];
  }

  const stateRecord = stateBySlug.get(stateSlug);
  if (!stateRecord) {
    return [];
  }

  return stateRecord.lgas.map((entry) => ({
    value: entry.lga,
    label: toLabelFromSlug(entry.lga),
  }));
}

export function getWardOptionsByStateAndLga(stateValue: string, lgaValue: string): LocationOption[] {
  const stateSlug = resolveStateSlug(stateValue);
  if (!stateSlug) {
    return [];
  }

  const lgaSlug = resolveLgaSlug(stateSlug, lgaValue);
  if (!lgaSlug) {
    return [];
  }

  const stateRecord = stateBySlug.get(stateSlug);
  if (!stateRecord) {
    return [];
  }

  const lgaRecord = stateRecord.lgas.find((entry) => entry.lga === lgaSlug);
  if (!lgaRecord) {
    return [];
  }

  return lgaRecord.wards.map((ward) => ({
    value: ward,
    label: toLabelFromSlug(ward),
  }));
}
