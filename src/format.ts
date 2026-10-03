/** Display formatting for raw fixture values. */

/** Callers guard on a truthy value before rendering a rating. */
export const rating = (value: number) => value.toFixed(1);

export const ratingCount = (count?: number) => {
  if (!count) return "";
  if (count >= 1000)
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${count}`;
};

export const eta = (minutes?: number) => (minutes ? `${minutes} mins` : "");

export const distance = (km?: number) =>
  km || km === 0 ? `${km.toFixed(1)} km` : "";

export const price = (value?: number) => (value ? `₹${value}` : "");

export const priceForOne = (value?: number) =>
  value ? `₹${value} for one` : "";

export const titleCase = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** `["american","burger"]` -> `American, Burger`, de-duplicated (the fixtures repeat tags). */
export const knownFor = (tags?: string[]) => {
  if (!tags?.length) return "";
  const unique = Array.from(
    new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean)),
  );
  return unique.map(titleCase).join(", ");
};
