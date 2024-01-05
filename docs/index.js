import React, { useState } from 'react';
import { render } from 'react-dom';
import { fakeRequest } from './request';
import { timeSlotValidator } from './validators';
import DayTimeScheduler from '../src';

const selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

function App() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleErr, setScheduleErr] = useState('');

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

  return (
    <DayTimeScheduler
      selectedDays={selectedDays}
      timeSlotSizeMinutes={15}
      timeSlotValidator={timeSlotValidator}
      onConfirm={handleScheduled}
    />

  );
}

const target = document.getElementById('root');
render(<App />, target);
