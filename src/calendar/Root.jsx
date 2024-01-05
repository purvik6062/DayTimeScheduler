import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dateFns from 'date-fns';

import { PrevIcon, NextIcon } from '../Icons';

import { Grid, Wrapper, MonthYear, DaysOfWeek, DaysOfMonth } from './Layout';
import { WeekDays, WeekDay, WEEK_DAYS } from './WeekDays';
import { MonthDays, MonthDay } from './MonthDays';

import {
  MonthPicker,
  PrevMonth,
  NextMonth,
  CurrentMonth,
  FakeCurrentMonth
} from './MonthPicker';

import { Calendar, FakeCalendar } from './Calendar';

import generateDays from './generate-days';

function Root({ validator, pickDay, selectedDays }) {
  const [month, setMonth] = useState(new Date());
  const [fakeMonth, setFakeMonth] = useState(month);
  const [animation, setAnimation] = useState('');

  const [startDay, days] = generateDays(month);
  const [fakeStartDay, fakeDays] = generateDays(fakeMonth);

  const isAnimating = !!animation;

  // Handlers
  const handleNextMonth = () => {
    if (isAnimating) {
      return;
    }

    const next = dateFns.addMonths(month, 1);
    setMonth(next);
    setAnimation('next');
  };

  const handlePrevMonth = () => {
    if (isAnimating) {
      return;
    }

    const prev = dateFns.subMonths(month, 1);
    setMonth(prev);
    setAnimation('prev');
  };

  const handleAnimationEnd = () => {
    const newFakeMonth =
      animation === 'prev'
        ? dateFns.subMonths(fakeMonth, 1)
        : dateFns.addMonths(fakeMonth, 1);

    setFakeMonth(newFakeMonth);
    setAnimation('');
  };

  const handlePickDay = day => {
    if (isAnimating) {
      return;
    }

    pickDay(day);
  };

  return (
    <Grid>
      <MonthYear>
        <MonthPicker>
          <PrevMonth disabled={isAnimating} onClick={handlePrevMonth}>
            <PrevIcon />
          </PrevMonth>

          <Wrapper>
            <CurrentMonth animation={animation}>
              {dateFns.format(month, 'MMMM YYYY')}
            </CurrentMonth>

            <FakeCurrentMonth animation={animation}>
              {dateFns.format(fakeMonth, 'MMMM YYYY')}
            </FakeCurrentMonth>
          </Wrapper>

          <NextMonth disabled={isAnimating} onClick={handleNextMonth}>
            <NextIcon />
          </NextMonth>
        </MonthPicker>
      </MonthYear>

      <Wrapper>
        <Calendar
          animation={animation}
          onAnimationEnd={handleAnimationEnd}
          validator={day =>
            validator(day) &&
            selectedDays.includes(dateFns.format(day, 'dddd').toLowerCase())
          }
          pickDay={handlePickDay}
        >
          <DaysOfWeek>
            <WeekDays>
              {WEEK_DAYS.map(weekDay => {
                return <WeekDay key={weekDay}>{weekDay}</WeekDay>;
              })}
            </WeekDays>
          </DaysOfWeek>

          <MonthDays>
            {days.map(day => {
              const isSameMonth = dateFns.isSameMonth(day, startDay);
              if (!isSameMonth) {
                return <MonthDay key={day} />;
              }

              const formatted = dateFns.format(day, 'D');
              const isToday = dateFns.isToday(day);
              const isValid = validator ? validator(day) : true;
              return (
                <MonthDay
                  key={day}
                  isValid={isValid}
                  isToday={isToday}
                  onClick={() => isValid && handlePickDay(day)}
                >
                  {formatted}
                </MonthDay>
              );
            })}
          </MonthDays>
        </Calendar>

        <FakeCalendar animation={animation}>
          <DaysOfWeek>
            <WeekDays>
              {WEEK_DAYS.map(weekDay => {
                return <WeekDay key={weekDay}>{weekDay}</WeekDay>;
              })}
            </WeekDays>
          </DaysOfWeek>

          <DaysOfMonth>
            <MonthDays>
              {fakeDays.map(fakeDay => {
                const isSameMonth = dateFns.isSameMonth(fakeDay, fakeStartDay);
                if (!isSameMonth) {
                  return <MonthDay key={fakeDay} />;
                }

                const formatted = dateFns.format(fakeDay, 'D');
                const isToday = dateFns.isToday(fakeDay);
                // const isValid = validator ? validator(fakeDay) : true;
                const isValid =
                  validator &&
                  selectedDays.includes(
                    dateFns.format(fakeDay, 'dddd').toLowerCase()
                  );
                return (
                  <MonthDay
                    key={fakeDay}
                    disabled={!isSameMonth}
                    isValid={isValid}
                    isToday={isToday}
                  >
                    {formatted}
                  </MonthDay>
                );
              })}
            </MonthDays>
          </DaysOfMonth>
        </FakeCalendar>
      </Wrapper>
    </Grid>
  );
}

Root.propTypes = {
  validator: PropTypes.func,
  pickDay: PropTypes.func.isRequired,
  selectedDays: PropTypes.arrayOf(PropTypes.string)
};

Root.defaultProps = {
  selectedDays: []
};

export default Root;
