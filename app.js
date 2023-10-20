import "./wake-lock.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/serviceworker.js");
}

const url = new URL(location);
const form = document.getElementById("js-box-time");
const timeInput = document.getElementById("time");
const path = document.querySelector(".path");

const time = +url.searchParams.get("time");

const minTime = +timeInput.getAttribute("min");
const maxTime = +timeInput.getAttribute("max");

function isValidTime(time) {
  return time && time >= minTime && time <= maxTime;
}

function setAnimationTime(time) {
  path.style.setProperty("--time", time * 4 + "s");
}

if (isValidTime(time)) {
  timeInput.value = time;
  setAnimationTime(time);
}

timeInput.addEventListener("change", setTime);

function setTime(ev) {
  const time = +ev.target.value;
  if (isValidTime(time)) {
    url.searchParams.set("time", time);
    history.pushState({}, "", url);
    setAnimationTime(time);
    path.getAnimations().forEach((anim) => {
      anim.cancel();
      anim.play();
    });
  }
}

form.addEventListener("submit", setBreathingTime);

function setBreathingTime(event) {
  event.preventDefault();
}
