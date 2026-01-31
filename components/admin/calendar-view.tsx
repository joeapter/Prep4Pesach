"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Card } from '@/components/ui/card';

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        height="auto"
        eventColor="#1d4ed8"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
      />
    </Card>
  );
}
