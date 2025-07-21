export interface ScheduleRow {
  time: string;
  period: string;
  "X-A": string;
  "X-B": string;
  "X-C": string;
  "X-D": string;
  "X-E": string;
  "X-F": string;
  "X-G": string;
  "X-H": string;
  "X-I": string;
  "X-J": string;
  "XI-A": string;
  "XI-B": string;
  "XI-C": string;
  "XI-D": string;
  "XI-E": string;
  "XI-F": string;
  "XI-G": string;
  "XI-H": string;
  "XI-I": string;
  "XI-J": string;
  "XII-A": string;
  "XII-B": string;
  "XII-C": string;
  "XII-D": string;
  "XII-E": string;
  "XII-F": string;
  "XII-G": string;
  "XII-H": string;
  "XII-I": string;
  "XII-J": string;
}

export interface TeacherRow {
  code: string;
  name: string;
  subject: string;
}

export type StudentScheduleRow = {
  code: string;
  time: string;
  period: string;
  endTime: string;
  endPeriod: string;
};

export interface TeacherScheduleRow {
  className: string;
  code: string;
  time: string;
  period: string;
  endTime: string;
  endPeriod: string;
}
