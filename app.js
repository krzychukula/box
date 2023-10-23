import "./wake-lock.js";
import { zzfx } from "./zzfx.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/serviceworker.js");
}

const url = new URL(location);
const form = document.getElementById("js-box-time");
const timeInput = document.getElementById("time");
const playSoundInput = document.getElementById("play-sound");
const path = document.querySelector(".path");
const animation = path.getAnimations().find((a) => a.animationName == "move");

let canPlay = false;
playSoundInput.addEventListener("change", (e) => {
  canPlay = e.target.checked;
});

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

    animation.cancel();
    animation.play();
  }
}

form.addEventListener("submit", setBreathingTime);

function setBreathingTime(event) {
  event.preventDefault();
}

let lastTime = time;
function tick() {
  if (canPlay) {
    const { currentTime } = animation;
    const stepTime = currentTime % (time * 1000);

    if (stepTime < lastTime) {
      playSound();
    }
    lastTime = stepTime;
  }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function playSound() {
  zzfx(...[795, , 10, , , 0.01, 4, 2.38, , 42, , , , , , , 0.01, 0.73]); // Blip 128
}
