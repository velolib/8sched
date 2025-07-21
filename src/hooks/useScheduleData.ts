import { useSuspenseQueries } from "@tanstack/react-query";
import Papa from "papaparse";

export function useScheduleData() {
  return useSuspenseQueries({
    queries: [
      {
        queryKey: ["scheduleData"],
        queryFn: async () => {
          const response = await fetch("/data.csv");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const text = await response.text();
          const rows = Papa.parse(text, { delimiter: "," }).data as string[][];
          return rows.map((row) => ({
            time: row[0] || "",
            period: row[1] || "",
            "X-A": row[2] || "",
            "X-B": row[3] || "",
            "X-C": row[4] || "",
            "X-D": row[5] || "",
            "X-E": row[6] || "",
            "X-F": row[7] || "",
            "X-G": row[8] || "",
            "X-H": row[9] || "",
            "X-I": row[10] || "",
            "X-J": row[11] || "",
            "XI-A": row[12] || "",
            "XI-B": row[13] || "",
            "XI-C": row[14] || "",
            "XI-D": row[15] || "",
            "XI-E": row[16] || "",
            "XI-F": row[17] || "",
            "XI-G": row[18] || "",
            "XI-H": row[19] || "",
            "XI-I": row[20] || "",
            "XI-J": row[21] || "",
            "XII-A": row[22] || "",
            "XII-B": row[23] || "",
            "XII-C": row[24] || "",
            "XII-D": row[25] || "",
            "XII-E": row[26] || "",
            "XII-F": row[27] || "",
            "XII-G": row[28] || "",
            "XII-H": row[29] || "",
            "XII-I": row[30] || "",
            "XII-J": row[31] || "",
          }));
        },
      },
      {
        queryKey: ["teacherData"],
        queryFn: async () => {
          const response = await fetch("/data_guru.csv");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const text = await response.text();
          const rows = Papa.parse(text, { delimiter: "," }).data as string[][];
          return rows.map((row) => ({
            code: row[0] || "",
            name: row[1] || "",
            subject: row[2] || "",
          }));
        },
      },
    ],
  });
}
