import { Teacher } from "@/types/schedule";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDuration(start: string, end: string): string {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const minutes = endH * 60 + endM - (startH * 60 + startM);
  if (minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  let result = "(";
  if (h > 0) result += `${h}h`;
  if (h > 0 && m > 0) result += " ";
  if (m > 0) result += `${m}m`;
  result += ")";
  if (result === "()") return "";
  return result;
}

export function checkIfTeacherCode(str: string): boolean {
  // Check if string doesn't start with X or Z
  if (str === "Z0") return true;
  if (/^[XZ]/.test(str)) return false;
  else return /^[A-Z]+[0-9]*$/.test(str);
}

export function getCodeCounts(teachers: Teacher[]) {
  const counts: Record<string, number> = {};
  for (const t of teachers) {
    const code = (t.code || "").trim();
    if (!code) continue;
    counts[code] = (counts[code] || 0) + 1;
  }
  return counts;
}

export function validateCode(code: string, teachers: Teacher[]) {
  const trimmed = (code || "").trim();
  if (!trimmed) return "Code is required";
  // Allow 1+ uppercase letters followed by 1-2 digits (A1, PK2, MATH10, etc.)
  const pattern = /^[A-Z]+[0-9]{1,2}$/;
  if (!pattern.test(trimmed)) return "Use format like A1, PK2, or MATH10";
  const counts = getCodeCounts(teachers);
  if (counts[trimmed] > 1) return "Code must be unique";
  return null;
}

export function checkIfReservedCode(code: string | null): boolean {
  // If code starts with X or Z, it's reserved
  if (!code) return false;
  return /^[XZ]/.test(code);
}
