export interface ScheduleRow {
  Time: string
  Period: string
  Class_A: string
  Class_B: string
  Class_C: string
  Class_D: string
  Class_E: string
  Class_F: string
  Class_G: string
  Class_H: string
  Class_I: string
  Class_J: string
}

export interface TeacherRow {
  Code: string
  Name: string
  Subject: string
}

export interface CombinedScheduleRow extends ScheduleRow {
  EndTime: string
  EndPeriod: string
}