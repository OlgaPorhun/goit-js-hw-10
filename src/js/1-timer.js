import flatpickr from "flatpickr";
import iziToast from "izitoast";
import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById("datetime-picker");
const startBtn = document.getElementById("start-btn");

let timerInterval;

flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'bottomRight'
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  }
});

startBtn.addEventListener("click", () => {
  const selectedDate = new Date(datetimePicker.value).getTime();
  const currentDate = new Date().getTime();
  const difference = selectedDate - currentDate;

  if (difference <= 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'bottomRight'
    });
    return;
  }

  startBtn.disabled = true;
  datetimePicker.disabled = true;

  timerInterval = setInterval(() => {
    const timeLeft = convertMs(selectedDate - new Date().getTime());
    updateTimer(timeLeft);

    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      clearInterval(timerInterval);
      startBtn.disabled = false;
      datetimePicker.disabled = false;
    }
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer(timeLeft) {
  const daysElement = document.querySelector("[data-days]");
  const hoursElement = document.querySelector("[data-hours]");
  const minutesElement = document.querySelector("[data-minutes]");
  const secondsElement = document.querySelector("[data-seconds]");

  daysElement.textContent = addLeadingZero(timeLeft.days);
  hoursElement.textContent = addLeadingZero(timeLeft.hours);
  minutesElement.textContent = addLeadingZero(timeLeft.minutes);
  secondsElement.textContent = addLeadingZero(timeLeft.seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}