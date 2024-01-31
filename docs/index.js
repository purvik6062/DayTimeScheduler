import React, { useState } from 'react';
import { render } from 'react-dom';
import { fakeRequest } from './request';
import { timeSlotValidator } from './validators';
import DayTimeScheduler from '../src';
// import theme from './theme';
import styled from 'styled-components';

function App() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleErr, setScheduleErr] = useState('');
  const allowedDates = ['2024-02-01', '2024-02-02', '2024-02-03', '2024-02-05', '2024-02-06', '2024-02-08', '2024-02-14'];
  const allowedTimeRanges = [
    [10, 0, 12, 0],
    [14, 0, 20, 0]
  ];

  const selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleScheduled = date => {
    setIsScheduling(true);
    setScheduleErr('');

    fakeRequest(date)
      .then(json => {
        setScheduleErr('');
        setIsScheduled(true);
        console.log('fake response: ', json);
      })
      .catch(err => {
        setScheduleErr(err);
      })
      .finally(() => {
        setIsScheduling(false);
      });
  };

  function getDayName(dateString) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return dayNames[dayIndex];
  }

  function timeSlotValidator2(slotTime, allowedDates, allowedTimeRanges) {
    const formattedDate = slotTime.toISOString().split('T')[0];
    const isDateValid = allowedDates.includes(formattedDate);

    if (!isDateValid) {
      return false;  // Return false for slots on non-allowed dates
    }

    const dayName = getDayName(formattedDate);
    const isDayValid = selectedDays.includes(dayName);

    const isTimeValid = allowedTimeRanges.some(([startHour, startMinute, endHour, endMinute]) => {
      const startTime = new Date(
        slotTime.getFullYear(),
        slotTime.getMonth(),
        slotTime.getDate(),
        startHour,
        startMinute,
        0
      );
      const endTime = new Date(
        slotTime.getFullYear(),
        slotTime.getMonth(),
        slotTime.getDate(),
        endHour,
        endMinute,
        0
      );
      return slotTime.getTime() >= startTime.getTime() && slotTime.getTime() <= endTime.getTime();
    });

    return isDayValid && isTimeValid;
  }

  return (
    <>
      <div style={{ margin: "0 auto", marginTop: "2rem", boxShadow: "0px 0px 4px -1px black", width: "fit-content", }}>
        <DayTimeScheduler
          onConfirm={handleScheduled}
          selectedDays={selectedDays}
          timeSlotSizeMinutes={15}
          isLoading={isScheduling}
          isDone={isScheduled}
          // timeSlotValidator={timeSlotValidator}
          timeSlotValidator={(slotTime) => timeSlotValidator2(slotTime, allowedDates, allowedTimeRanges)}
        />
      </div>
    </>
  );
}

const target = document.getElementById('root');
render(<App />, target);
