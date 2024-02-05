/**
 * A validator function to determine if a time slot can be selected by the user
 * or not.
 *
 * @param {Date} slotTime - a time slot
 *
 * @return {Boolan} If the time slot is valid or not.
 */

export function timeSlotValidator(slotTime) {
  const eveningTime = new Date(
    slotTime.getFullYear(),
    slotTime.getMonth(),
    slotTime.getDate(),
    13,
    0,
    0
  );

  const isValid = slotTime.getTime() > eveningTime.getTime();
  return isValid;
}


// export function timeSlotValidator(slotTime) {
//   const allowedDate = new Date('2024-02-18');

//   const morningTime = new Date(
//     allowedDate.getFullYear(),
//     allowedDate.getMonth(),
//     allowedDate.getDate(),
//     0,
//     0,
//     0
//   );

//   const eveningTime = new Date(
//     allowedDate.getFullYear(),
//     allowedDate.getMonth(),
//     allowedDate.getDate(),
//     13,
//     0,
//     0
//   );

//   const isValid = slotTime.getTime() >= morningTime.getTime() && slotTime.getTime() <= eveningTime.getTime();
//   return isValid;
// }


// function getDayName(dateString) {
//   const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//   const date = new Date(dateString);
//   const dayIndex = date.getDay();
//   return dayNames[dayIndex];
// }

// export function timeSlotValidator(slotTime, allowedDates, allowedTimeRanges) {
//   const formattedDate = slotTime.toISOString().split('T')[0];
//   const isDateValid = allowedDates.includes(formattedDate);

//   if (!isDateValid) {
//     return false;  // Return false for slots on non-allowed dates
//   }

//   const dayName = getDayName(formattedDate);
//   const isDayValid = selectedDays.includes(dayName);

//   const isTimeValid = allowedTimeRanges.some(([startHour, startMinute, endHour, endMinute]) => {
//     const startTime = new Date(
//       slotTime.getFullYear(),
//       slotTime.getMonth(),
//       slotTime.getDate(),
//       startHour,
//       startMinute,
//       0
//     );
//     const endTime = new Date(
//       slotTime.getFullYear(),
//       slotTime.getMonth(),
//       slotTime.getDate(),
//       endHour,
//       endMinute,
//       0
//     );
//     return slotTime.getTime() >= startTime.getTime() && slotTime.getTime() <= endTime.getTime();
//   });

//   return isDayValid && isTimeValid;
// }

