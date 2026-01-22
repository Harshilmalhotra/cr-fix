'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { StudentList } from '@/components/StudentList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { students, sessions, updateAttendance } = useAppStore();

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return <div className="p-6 text-center text-zinc-500">Session not found</div>;
  }

  const handleToggle = (regNo: string, currentStatus: boolean) => {
    updateAttendance(session.id, regNo, !currentStatus);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-white">
         <div className="flex items-center gap-3">
           <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
             <ArrowLeft className="w-5 h-5 text-zinc-600" />
           </Button>
           <div>
             <h1 className="font-semibold text-zinc-900 text-sm leading-tight">{session.subject}</h1>
             <p className="text-[10px] text-zinc-500">{format(new Date(session.date), "dd MMM, hh:mm a")}</p>
           </div>
         </div>
         {/* Placeholder for optional export later */}
         <Button variant="ghost" size="icon" onClick={() => import('@/lib/export').then(mod => mod.exportAsImage('attendance-list', `Attendance-${session.subject}-${format(new Date(), 'yyyyMMdd')}`))}>
            <Share2 className="w-4 h-4 text-zinc-400" />
         </Button>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-hidden" id="attendance-list">
        <StudentList 
          students={students}
          records={session.records}
          onToggle={handleToggle}
          type="attendance"
        />
      </div>
    </div>
  );
}
