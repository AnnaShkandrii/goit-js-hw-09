import flatpickr from 'flatpickr';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import 'flatpickr/dist/flatpickr.min.css';

let startId = null;
const refs = {
  dataTime: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

const setting = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    if (new Date().getTime() < selectedDates[0].getTime()) {
      refs.startBtn.removeAttribute('disabled');
      refs.startBtn.style.color = 'green';

      return;
    }
    Notify.failure('Please choose a date in the future', {
      position: 'center-top',
      timeout: 2000,
      fontSize: '18px',
      distance: '150px',
      borderRadius: '50px',
      failure: {
        textColor: '#000',
      },
    });
  },
};

refs.startBtn.addEventListener('click', getTimeChoisen);
refs.startBtn.setAttribute('disabled', 'disabled');

const choiseDateTime = flatpickr('#datetime-picker', setting);

function getTimeChoisen() {
  const selectTime = choiseDateTime.latestSelectedDateObj.getTime();
  refs.startBtn.setAttribute('disabled', 'disabled');
  refs.startBtn.style.color = 'red';
  startId = setInterval(startTime, 1000, selectTime);
}

function startTime(selectTime) {
  const { days, hours, minutes, seconds } = convertMs(
    selectTime - new Date().getTime()
  );
  getTimeDate(days, hours, minutes, seconds);
}

function getTimeDate(days, hours, minutes, seconds) {
  if (days === -1) {
    clearTimeout(startId);
    return;
  }

  addLeadingZero(days, hours, minutes, seconds);
}

function addLeadingZero(days, hours, minutes, seconds) {
  refs.dataDays.textContent = String(days).padStart(2, '0');
  refs.dataHours.textContent = String(hours).padStart(2, '0');
  refs.dataMinutes.textContent = String(minutes).padStart(2, '0');
  refs.dataSeconds.textContent = String(seconds).padStart(2, '0');
}

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
