import { h, text, app } from "https://esm.run/hyperapp";
import { beep } from "./beep.js";

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

app({
  init: [{ time: void Infinity, boxSize: 6 }, now(Tick)],
  view: ({ time, boxSize }) =>
    main(
      title("Box Breathing"),
      p("Pick number of seconds for inhale, hold, exhale, hold."),
      input(
        withPayload(({ target }) => [SetBoxSize, +target.value]),
        {
          placeholder: "Number of seconds",
          value: boxSize,
          type: "number",
          min: 1,
          max: 100,
        }
      ),
      h("svg", { viewBox: "0 0 100 100", width: "40%", "stroke-width": 2 }, [
        h("circle", {
          cx: 50,
          cy: 50,
          r: 45,
          stroke: "#0366d6",
          fill: "white",
        }),
        h("line", {
          x1: "50",
          y1: "50",
          x2: 50 + 40 * Math.cos(angle(time)),
          y2: 50 + 40 * Math.sin(angle(time)),
          stroke: "#0366d6",
          "stroke-width": 3,
        }),
      ])
    ),
  subscriptions: () => [every(1000, Tick)],
  node: document.getElementById("app"),
});
