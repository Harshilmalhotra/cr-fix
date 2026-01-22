import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Student } from '@/lib/csv';

export interface AttendanceRecord {
  sessionId: string;
  studentRegNo: string;
  present: boolean;
}

export interface AttendanceSession {
  id: string;
  date: string;
  subject: string;
  records: Record<string, boolean>; // regNo -> true (present) / false (absent)
}

export interface SubmissionTracker {
  id: string;
  title: string;
  createdAt: string;
  submissions: Record<string, boolean>; // regNo -> true (submitted)
}

interface AppState {
  students: Student[];
  sessions: AttendanceSession[];
  trackers: SubmissionTracker[];
  
  setStudents: (students: Student[]) => void;
  
  addSession: (session: AttendanceSession) => void;
  updateAttendance: (sessionId: string, regNo: string, present: boolean) => void;
  deleteSession: (sessionId: string) => void;

  addTracker: (tracker: SubmissionTracker) => void;
  updateSubmission: (trackerId: string, regNo: string, submitted: boolean) => void;
  deleteTracker: (trackerId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      students: [],
      sessions: [],
      trackers: [],

      setStudents: (students) => set({ students }),

      addSession: (session) => set((state) => ({ 
        sessions: [session, ...state.sessions] 
      })),
      
      updateAttendance: (sessionId, regNo, present) => set((state) => ({
        sessions: state.sessions.map((s) => 
          s.id === sessionId 
            ? { ...s, records: { ...s.records, [regNo]: present } }
            : s
        )
      })),

      deleteSession: (sessionId) => set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== sessionId)
      })),

      addTracker: (tracker) => set((state) => ({
        trackers: [tracker, ...state.trackers]
      })),

      updateSubmission: (trackerId, regNo, submitted) => set((state) => ({
        trackers: state.trackers.map((t) => 
          t.id === trackerId
            ? { ...t, submissions: { ...t.submissions, [regNo]: submitted } }
            : t
        )
      })),

      deleteTracker: (trackerId) => set((state) => ({
        trackers: state.trackers.filter((t) => t.id !== trackerId)
      })),
    }),
    {
      name: 'cr-tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
