'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronRight, FileText } from 'lucide-react';

export default function SubmissionsPage() {
  const router = useRouter();
  const { trackers, addTracker } = useAppStore();
  const [docName, setDocName] = useState('');

  const handleCreateTracker = () => {
    if (!docName.trim()) return;

    const newTracker = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: docName.trim(),
      submissions: {}
    };
    addTracker(newTracker);
    router.push(`/submissions/${newTracker.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">Submissions</h1>
        <p className="text-sm text-zinc-500">Track document collections</p>
      </header>

      {/* New Tracker Card */}
      <Card className="border-dashed border-2 bg-zinc-50/50 shadow-none">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-zinc-500 tracking-wider">New Tracker</label>
            <Input 
              placeholder="Document Name (e.g. Internship Offer)" 
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="bg-white"
            />
          </div>
          <Button onClick={handleCreateTracker} disabled={!docName.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Start Tracking
          </Button>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Active Trackers</h2>
        {trackers.length === 0 ? (
          <p className="text-sm text-zinc-400">No trackers active.</p>
        ) : (
          <div className="grid gap-3">
            {trackers.map((tracker) => (
              <Card 
                key={tracker.id} 
                className="cursor-pointer hover:border-blue-200 transition-colors active:scale-[0.99]"
                onClick={() => router.push(`/submissions/${tracker.id}`)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-zinc-900">{tracker.title}</h3>
                    <div className="flex items-center text-xs text-zinc-500 gap-2">
                       <FileText className="w-3 h-3" />
                       Created {format(new Date(tracker.createdAt), "dd MMM")}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                       <span className="block text-sm font-bold text-blue-600">
                         {Object.values(tracker.submissions).filter(Boolean).length}
                       </span>
                       <span className="text-[10px] text-zinc-400">Collected</span>
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
