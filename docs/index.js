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

  const allowedDates = [
    new Date('2024-02-01'),
    new Date('2024-02-02'),
    new Date('2024-02-03'),
    new Date('2024-02-04'),
    new Date('2024-02-05'),
    new Date('2024-02-08'),
    new Date('2024-02-10'),
    new Date('2024-02-11'),
    new Date('2024-02-12'),
    new Date('2024-02-14'),
  ];

  const allowedTimeRanges = [
    [0, 0, 12, 0],
    [14, 0, 20, 0],
    [22, 0, 24, 0]
  ];

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


  function timeSlotValidator2(slotTime, allowedDates) {
    for (const allowedDate of allowedDates) {
      const morningTime = new Date(
        allowedDate.getFullYear(),
        allowedDate.getMonth(),
        allowedDate.getDate(),
        0,
        0,
        0
      );

      const eveningTime = new Date(
        allowedDate.getFullYear(),
        allowedDate.getMonth(),
        allowedDate.getDate(),
        13,
        0,
        0
      );

      if (slotTime.getTime() >= morningTime.getTime() && slotTime.getTime() <= eveningTime.getTime()) {
        return true; // Return true if the slot is valid for any allowed date
      }
    }

    return false; // Return false if the slot is not valid for any allowed date
  }



  return (
    <>
      <div style={{ margin: "0 auto", marginTop: "2rem", boxShadow: "0px 0px 4px -1px black", width: "fit-content", }}>
        {console.log("allowedDates", allowedDates)}
        <DayTimeScheduler
          onConfirm={handleScheduled}
          allowedDates={allowedDates}
          timeSlotSizeMinutes={15}
          isLoading={isScheduling}
          isDone={isScheduled}
          // timeSlotValidator={timeSlotValidator}
          timeSlotValidator={(slotTime) => timeSlotValidator2(slotTime, allowedDates)}
        />
      </div>
    </>
  );
}

const target = document.getElementById('root');
render(<App />, target);
