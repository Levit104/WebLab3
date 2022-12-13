'use strict';

const DELAY = 7000;
let currentDate = document.querySelector('#current_date');
let currentTime = document.querySelector('#current_time');

function setCurrentDateTime() {
    let dateObject = new Date();

    currentDate.innerHTML = dateObject.toLocaleDateString();
    currentTime.innerHTML = dateObject.toLocaleTimeString();
}

setCurrentDateTime();
setInterval(setCurrentDateTime, DELAY);
