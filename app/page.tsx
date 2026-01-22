'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { parseStudentsCSV } from '@/lib/csv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, CalendarCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { students, setStudents, sessions, trackers } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial Load Logic
    if (students.length === 0) {
      setLoading(true);
      fetch('/students.csv')
        .then((res) => res.text())
        .then(async (data) => {
          const parsed = await parseStudentsCSV(data);
          setStudents(parsed);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load CSV", err);
          setLoading(false);
        });
    }
  }, [students.length, setStudents]);

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 bg-zinc-50/50">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">CR Dashboard</h1>
        <p className="text-sm text-zinc-500">Manage your class efficiently.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white border-zinc-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-200 text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {loading ? '...' : students.length}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Loaded from local CSV</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" /> Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-zinc-400 mt-1">Sessions logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trackers.length}</div>
            <p className="text-xs text-zinc-400 mt-1">Active trackers</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">Quick Actions</h2>
        <div className="grid gap-3">
          <Link href="/attendance">
            <Button className="w-full justify-between h-auto py-4 bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm group">
              <span className="flex flex-col items-start text-left">
                <span className="font-semibold text-base">Mark Attendance</span>
                <span className="text-xs text-zinc-500 font-normal">Start a new session for today</span>
              </span>
              <CheckCircle2 className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
            </Button>
          </Link>
          
          <Link href="/submissions">
            <Button className="w-full justify-between h-auto py-4 bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm group">
              <span className="flex flex-col items-start text-left">
                <span className="font-semibold text-base">Track Submission</span>
                <span className="text-xs text-zinc-500 font-normal">Create a new document tracker</span>
              </span>
              <FileText className="w-5 h-5 text-zinc-300 group-hover:text-blue-500 transition-colors" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
