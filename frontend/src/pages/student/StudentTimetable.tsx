import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const schedule = [
    {
      day: 'Monday',
      slots: [
        { time: '09:00 - 10:00', code: 'CS301', name: 'Design & Analysis of Algorithms', room: 'Lecture Hall 401', type: 'LECTURE', faculty: 'Prof. Rajesh Sharma' },
        { time: '11:15 - 12:15', code: 'CS302', name: 'Distributed Systems & Cloud Computing', room: 'Tech Block 202', type: 'LECTURE', faculty: 'Dr. Ananya Mukherjee' },
      ],
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '10:00 - 12:00', code: 'CS301', name: 'Algorithms Lab (Dynamic Programming & Graphs)', room: 'Computing Lab 3', type: 'LAB', faculty: 'Prof. Rajesh Sharma' },
      ],
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '09:00 - 10:00', code: 'CS303', name: 'Machine Learning & AI Ethics', room: 'Lecture Hall 401', type: 'LECTURE', faculty: 'Prof. Rajesh Sharma' },
        { time: '14:00 - 16:00', code: 'CS302', name: 'Distributed Systems Lab (Raft Simulation)', room: 'Cloud Systems Lab', type: 'LAB', faculty: 'Dr. Ananya Mukherjee' },
      ],
    },
    {
      day: 'Thursday',
      slots: [
        { time: '11:15 - 12:15', code: 'CS301', name: 'Design & Analysis of Algorithms', room: 'Lecture Hall 401', type: 'LECTURE', faculty: 'Prof. Rajesh Sharma' },
      ],
    },
    {
      day: 'Friday',
      slots: [
        { time: '10:00 - 11:00', code: 'CS303', name: 'Machine Learning Tutorial & Case Study', room: 'Seminar Hall 1', type: 'TUTORIAL', faculty: 'Prof. Rajesh Sharma' },
      ],
    },
  ];

  return (
    <DashboardLayout title="Academic Timetable" subtitle="Weekly lecture and lab schedule for Semester 6 (Section A)">
      <div className="space-y-6">
        {schedule.map((dayGroup) => (
          <Card key={dayGroup.day} variant="white" padding="md" className="space-y-3">
            <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
              <h3 className="text-sm font-bold text-brand-text flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                {dayGroup.day}
              </h3>
              <Badge variant="lavender">{dayGroup.slots.length} Sessions</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dayGroup.slots.map((slot, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-brand-border bg-[#FBFBFE] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-brand-primary block">{slot.code}</span>
                    <h4 className="text-xs font-bold text-brand-text">{slot.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-brand-muted pt-1">
                      <span className="flex items-center gap-1 font-semibold text-brand-text">
                        <Clock className="w-3.5 h-3.5 text-brand-primary" />
                        {slot.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {slot.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {slot.faculty}
                      </span>
                    </div>
                  </div>

                  <Badge variant={slot.type === 'LAB' ? 'amber' : slot.type === 'TUTORIAL' ? 'indigo' : 'emerald'} size="sm">
                    {slot.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};
