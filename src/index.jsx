import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dateFns from 'date-fns';
import { ThemeProvider } from 'styled-components';

import { PopupWrapper, Popup, PopupHeader, PopupClose } from './Popup';
import { ConfirmButton } from './Confirm';
import { DayIcon, ClockIcon, SuccessIcon, FailedIcon } from './Icons';
import { Success, Failed } from './Feedback';

import Calendar from './calendar';
import TimeSlots from './time-slots';

import { preventPastDays } from './validators';

function DayTimeScheduler({
  timeSlotValidator,
  timeSlotSizeMinutes,
  isLoading,
  isDone,
  err,
  onConfirm,
  confirmText,
  loadingText,
  doneText,
  theme,
  selectedDays,
  allowedDates
}) {
  const [pickedDay, setPickedDay] = useState(null);
  const [pickedTime, setPickedTime] = useState(null);
  const [showPickTime, setShowPickTime] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // //if the dates is in string
  // const handlePickDay = day => {
  //   if (allowedDates.includes(dateFns.format(day, 'YYYY-MM-DD'))) {
  //     setPickedDay(day);
  //     setShowPickTime(true);
  //   }
  // };

  const handlePickDay = day => {
    const isAllowedDay = allowedDates.some(date =>
      dateFns.isSameDay(day, date)
    );

    if (preventPastDays(day) && isAllowedDay) {
      setPickedDay(day);
      setShowPickTime(true);
    }
  };

  const handlePickTime = time => {
    setPickedTime(time);
    setShowPickTime(false);
    setShowConfirm(true);
  };

  const handleClosePickTime = () => {
    setShowPickTime(false);
  };

  const handleConfirm = () => {
    onConfirm(pickedTime);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setShowPickTime(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <PopupWrapper>
        <Calendar
          validator={
            day =>
              preventPastDays(day) &&
              allowedDates.some(date => dateFns.isSameDay(day, date))
            // allowedDates.includes(dateFns.format(day, 'YYYY-MM-DD'))    //if the dates is in string
            // && selectedDays.includes(dateFns.format(day, 'dddd').toLowerCase())
          }
          pickDay={handlePickDay}
        />

        {showPickTime && (
          <Popup>
            <PopupHeader>
              <p>
                <DayIcon /> {dateFns.format(pickedDay, 'dddd, MMMM Do, YYYY')}
              </p>
              <p>
                <PopupClose onClick={handleClosePickTime}>← Back</PopupClose>
              </p>
            </PopupHeader>

            <TimeSlots
              pickedDay={pickedDay}
              slotSizeMinutes={timeSlotSizeMinutes}
              validator={timeSlotValidator}
              pickTime={handlePickTime}
            />
          </Popup>
        )}

        {showConfirm && (
          <Popup>
            <PopupHeader>
              <p>
                <DayIcon /> {dateFns.format(pickedTime, 'dddd, MMMM Do, YYYY')}
              </p>

              <p>
                <ClockIcon /> {dateFns.format(pickedTime, 'HH:mm')}
              </p>

              {!isDone && (
                <p>
                  <PopupClose disabled={isLoading} onClick={handleCloseConfirm}>
                    ← Back
                  </PopupClose>
                </p>
              )}
            </PopupHeader>

            {!isDone ? (
              <ConfirmButton disabled={isLoading} onClick={handleConfirm}>
                {isLoading ? loadingText : confirmText}
              </ConfirmButton>
            ) : doneText ? (
              <Success>
                <p>
                  <SuccessIcon /> {doneText}
                </p>
              </Success>
            ) : null}

            {err && (
              <Failed>
                <p>
                  <FailedIcon /> {err}
                </p>
              </Failed>
            )}
          </Popup>
        )}
      </PopupWrapper>
    </ThemeProvider>
  );
}

DayTimeScheduler.propTypes = {
  timeSlotValidator: PropTypes.func,
  timeSlotSizeMinutes: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDone: PropTypes.bool.isRequired,
  err: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  loadingText: PropTypes.string,
  doneText: PropTypes.string,
  theme: PropTypes.shape({
    primary: PropTypes.string,
    secondary: PropTypes.string,
    background: PropTypes.string,
    buttons: PropTypes.shape({
      disabled: PropTypes.shape({
        color: PropTypes.string,
        background: PropTypes.string
      }),
      confirm: PropTypes.shape({
        color: PropTypes.string,
        background: PropTypes.string,
        hover: PropTypes.shape({
          color: PropTypes.string,
          background: PropTypes.string
        })
      })
    })
  }),
  // selectedDays: PropTypes.arrayOf(PropTypes.string),
  // allowedDates: PropTypes.arrayOf(PropTypes.string)
  allowedDates: PropTypes.arrayOf(PropTypes.instanceOf(Date))
};

DayTimeScheduler.defaultProps = {
  confirmText: 'Schedule',
  loadingText: 'Scheduling..',
  doneText: 'Your event has been scheduled!',
  theme: {
    primary: '#3a9ad9',
    secondary: '#f0f0f0',
    background: '#fff',
    buttons: {
      disabled: {
        color: '#333',
        background: '#dfdfdf'
      },
      confirm: {
        color: '#fff',
        background: '#3a9ad9',
        hover: {
          color: '',
          background: '#3a9ad9d6'
        }
      }
    },
    feedback: {
      success: {
        color: '#29aba4'
      },
      failed: {
        color: '#eb7260'
      }
    }
  },
  // selectedDays: [],
  allowedDates: []
};

export default DayTimeScheduler;
