'use client';

import { useMemo, useState } from 'react';
import { Student } from '@/lib/csv';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  records: Record<string, boolean>; // regNo -> boolean
  onToggle: (regNo: string, currentStatus: boolean) => void;
  type: 'attendance' | 'submission';
}

export function StudentList({ students, records, onToggle, type }: StudentListProps) {
  const [search, setSearch] = useState('');

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.shortReg.includes(q) || 
      s.regNo.includes(q)
    );
  }, [students, search]);

  const stats = useMemo(() => {
    const total = students.length;
    const active = Object.values(records).filter(Boolean).length;
    return { total, active };
  }, [students, records]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-4 py-3 space-y-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            className="pl-9 bg-zinc-50 border-zinc-200 focus:bg-white transition-all"
            placeholder="Search by name or last 4 digits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-medium text-zinc-500 px-1">
            <span>Total: {stats.total}</span>
            <span className={cn(
              type === 'attendance' ? "text-emerald-600" : "text-blue-600"
            )}>
              {type === 'attendance' ? 'Present' : 'Submitted'}: {stats.active}
            </span>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-sm">
            No students found.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredStudents.map((student) => {
              const isActive = !!records[student.regNo];
              
              return (
                <div 
                  key={student.regNo}
                  onClick={() => onToggle(student.regNo, isActive)}
                  className={cn(
                    "flex items-center justify-between p-4 active:bg-zinc-50 transition-colors cursor-pointer select-none",
                    isActive ? "bg-zinc-50/50" : ""
                  )}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-500 font-medium text-sm w-10">
                        {student.shortReg}
                      </span>
                      <span className={cn(
                        "font-medium text-zinc-900",
                        isActive && "text-zinc-900"
                      )}>
                        {student.name}
                      </span>
                    </div>
                  </div>

                  {/* Toggle UI */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    isActive 
                      ? (type === 'attendance' 
                          ? "bg-emerald-500 border-emerald-500 scale-110 shadow-sm" 
                          : "bg-blue-500 border-blue-500 scale-110 shadow-sm")
                      : "border-zinc-300 bg-white"
                  )}>
                    {isActive && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
