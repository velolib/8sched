// new stuff
export type Schedule = {
  id: number;
  day: number;
  time_slot: string;
  class_name: string;
  teacher_code: string;
};

export type Teacher = {
  id: number;
  code: string;
  name: string;
  subject: string;
};

export type StudentScheduleBlock = {
  teacher_code: string | null;
  teacher: Teacher;
  start_time: string;
  end_time: string;
  start_index: number;
  end_index: number;
};

export type TeacherScheduleBlock = {
  teacher: Teacher;
  class_name: string;
  day: number;
  start_time: string;
  end_time: string;
};
