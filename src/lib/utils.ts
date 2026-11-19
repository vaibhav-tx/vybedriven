import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatExternalUrl(url?: string | null): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (!trimmed) return "#";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function isInvalidPptLink(url?: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  return (
    lower.includes("vybedriven.in") ||
    lower.includes("joincode=") ||
    lower.includes("jointeam=") ||
    lower.includes("localhost") ||
    lower === "#"
  );
}
