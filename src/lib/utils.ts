import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTeacherName(str: string): string {
  const parts = str.split(",");

  const name = parts[0].split(" ").map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });
  const title = parts.slice(1, parts.length).join(",").trim();

  if (title) {
    return `${name.join(" ")}, ${title}`;
  } else {
    return name.join(" ");
  }
}

export function getDuration(start: string, end: string): string {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const minutes = endH * 60 + endM - (startH * 60 + startM);
  if (minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  let result = "(";
  if (h > 0) result += `${h} hour${h > 1 ? "s" : ""}`;
  if (h > 0 && m > 0) result += ", ";
  if (m > 0) result += `${m} min`;
  result += ")";
  return result;
}

export const formatSubject = (subject: string): string => {
  const UPPERCASE_SUBJECTS = new Set(["PPKN", "PJOK", "PKWU"]);
  if (UPPERCASE_SUBJECTS.has(subject.toUpperCase())) {
    return subject.toUpperCase();
  }
  return subject.toLowerCase();
};
