'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
  const router = useRouter();
  const { sessions, addSession } = useAppStore();
  const [subject, setSubject] = useState('');

  const handleCreateSession = () => {
    const newSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      subject: subject || 'General',
      records: {}
    };
    addSession(newSession);
    router.push(`/attendance/${newSession.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">Attendance</h1>
        <p className="text-sm text-zinc-500">Track class attendance sessions</p>
      </header>

      {/* New Session Card */}
      <Card className="border-dashed border-2 bg-zinc-50/50 shadow-none">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-zinc-500 tracking-wider">New Session</label>
            <Input 
              placeholder="Subject / Class Name (Optional)" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white"
            />
          </div>
          <Button onClick={handleCreateSession} className="w-full bg-zinc-900 hover:bg-zinc-800">
            <Plus className="w-4 h-4 mr-2" /> Start Marking
          </Button>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">History</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-zinc-400">No sessions recorded yet.</p>
        ) : (
          <div className="grid gap-3">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className="cursor-pointer hover:border-zinc-300 transition-colors active:scale-[0.99]"
                onClick={() => router.push(`/attendance/${session.id}`)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-zinc-900">{session.subject}</h3>
                    <div className="flex items-center text-xs text-zinc-500 gap-2">
                       <Calendar className="w-3 h-3" />
                       {format(new Date(session.date), "dd MMM yyyy, hh:mm a")}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                       <span className="block text-sm font-bold text-emerald-600">
                         {Object.values(session.records).filter(Boolean).length}
                       </span>
                       <span className="text-[10px] text-zinc-400">Present</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
