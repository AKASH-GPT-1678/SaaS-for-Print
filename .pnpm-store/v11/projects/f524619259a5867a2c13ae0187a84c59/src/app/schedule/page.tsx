'use client'
import React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { da } from 'date-fns/locale'
const SchedulePage = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <div>
        <p>Namaste</p>
        <Calendar
        mode='single'
        selected={date}
        onSelect={setDate}
          className="rounded-lg border"
        />
      
    </div>
  )
}

export default SchedulePage;
