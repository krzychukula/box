// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API

// wake lock
let isSupported = false;
if ("wakeLock" in navigator) {
  isSupported = true;
}

console.log("wakeLock is supported", isSupported);

if (isSupported) {
  // create a reference for the wake lock
  let wakeLock = null;

  // create an async function to request a wake lock
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      console.log("Wake Lock is active!");

      // listen for our release event
      wakeLock.onrelease = function (ev) {
        console.log(ev);
      };
      wakeLock.addEventListener("release", () => {
        // if wake lock is released alter the button accordingly
        console.log("wakeLock released");
      });
    } catch (err) {
      // if wake lock request fails - usually system related, such as battery
      // The Wake Lock request has failed - usually system related, such as battery.
      console.log(`${err.name}, ${err.message}`);
    }
  }; // requestWakeLock()

  const handleVisibilityChange = () => {
    if (wakeLock !== null && document.visibilityState === "visible") {
      requestWakeLock();
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);
}
