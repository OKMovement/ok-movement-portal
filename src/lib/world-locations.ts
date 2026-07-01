import countriesStates from "./countries-states.json";

type CountryEntry = { name: string; states: string[] };

const data = countriesStates as CountryEntry[];

export const countryOptions = data.map((c) => c.name);

export function getStatesByCountry(countryName: string): string[] {
  const entry = data.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase(),
  );
  return entry?.states ?? [];
}
