$(document).ready(function(){ // Water Effect
    $(".full-landing-image").ripples({
        resolution: 200,
        perturbance: .004,
    });
});

const mainCounter = document.querySelector('.main-counter');
const customColor = document.querySelector('#colorPicker');
const customBackground = document.querySelector('#backgroundPicker');
const mainBackground = document.querySelector('#main-background');

const userInputText = document.querySelector('#userInputText');
const userInputDate = document.querySelector('#userInputDate');
const userForm = document.querySelector('#user-form');

const chosenYear = document.querySelector('#year');
const daysInput = document.querySelector('#counter-days');
const hoursInput = document.querySelector('#counter-hours');
const minutesInput = document.querySelector('#counter-minutes');
const secondsInput = document.querySelector('#counter-seconds');

let newYear = '1 Jan 2024';


customColor.addEventListener('change', function() {
    const colorPicker = document.querySelector('#colorPicker');
    mainCounter.style.color = colorPicker.value;
});

customBackground.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            mainBackground.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
})

userForm.addEventListener('submit', function(e) {
    e.preventDefault();

    newYear = userInputDate.value;

    if (userInputText) {
        chosenYear.innerHTML = userInputText.value;
    } else {
        chosenYear.innerHTML = userInputDate.value;
    }
})

function newYearCountDown() {
    const newYearDate = new Date(newYear);
    const currentYear = new Date();
    const totalSeconds = (newYearDate - currentYear) / 1000;

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    daysInput.innerHTML = days;
    hoursInput.innerHTML = hours;
    minutesInput.innerHTML = minutes;
    secondsInput.innerHTML = seconds;
}

newYearCountDown();

setInterval(newYearCountDown, 1000);