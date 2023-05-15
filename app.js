import { h, text, app } from "https://esm.run/hyperapp";
import html from "https://unpkg.com/hyperlit";
import { beep } from "./beep.js";
import "./wake-lock.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/serviceworker.js");
}

const angle = (t) => (2 * Math.PI * t) / 60000;

/// Time Fx

const play = () => {
  // Simple beep
  beep(
    // Set the duration to 0.2 second (200 milliseconds)
    200,
    // Set the frequency of the note to A4 (440 Hz)
    440,
    // Set the volume of the beep to 100%
    20
  );
};

const interval = (dispatch, props) => {
  const id = setInterval(() => dispatch(props.action, Date.now()), props.delay);
  return () => clearInterval(id);
};

const getTime = (dispatch, props) => dispatch(props.action, Date.now());

const every = (delay, action) => [interval, { delay, action }];

const now = (action) => [getTime, { action }];

const SetBoxSize = (state, boxSize) => ({ ...state, boxSize });
const withPayload = (filter) => (_, payload) => filter(payload);

/// Main

const main = (...children) => h("main", {}, children);
const input = (oninput, props) => h("input", { oninput, ...props });
const p = (paragraph) => h("p", {}, text(paragraph));
const title = (paragraph) => h("h1", {}, text(paragraph));

const Tick = (state, time) => [
  { ...state, time },
  () => {
    if (time % state.boxSize == 0) {
      console.log(time, state.boxSize, time % state.boxSize);
      play();
    }
  },
];

const svg = (time) => html`
  <svg width="40%" height="100%" viewBox="0 0 100 100" stroke-width="2">
    <circle cx="50" cy="50" r="45" stroke="#0366d6" fill="white" />
    <line
      x1="50"
      y1="50"
      x2="${50 + 40 * Math.cos(angle(time))}"
      y2="${50 + 40 * Math.sin(angle(time))}"
      stroke="#0366d6"
    />
  </svg>
`;

app({
  init: [{ time: void Infinity, boxSize: 6 }, now(Tick)],
  view: ({ time, boxSize }) => html` <main>
    <h1>Box Breathing</h1>
    <p>Pick number of seconds for inhale, hold, exhale, hold.</p>
    <input
      placeholder="Number of seconds"
      value=${boxSize}
      oninput=${withPayload(({ target }) => [SetBoxSize, +target.value])}
      min="1"
      max="100"
      type="number"
    />
    <p>Time: ${time}</p>
    ${svg(time)}
  </main>`,
  subscriptions: () => [every(1000, Tick)],
  node: document.getElementById("app"),
});
