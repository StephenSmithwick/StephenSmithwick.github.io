async function mediaCapture() {
  var track = {};
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: "browser",
      },
      selfBrowserSurface: "include",
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;

    await new Promise((resolve) => (video.onloadedmetadata = resolve));

    track = stream.getVideoTracks()[0];
    const settings = track.getSettings();

    const canvas = document.createElement("canvas");
    canvas.width = settings.width;
    canvas.height = settings.height;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error(`Error: ${err}`);
  } finally {
    track.stop?.();
  }
}

async function takeScreenshot() {
  const imgUrl = await mediaCapture();

  chrome.downloads.download({
    filename: currentDate`screenshot.${YYYY}.${MM}.${DD}.${HH}.${mm}.${ss}.png`,
    url: imgUrl,
  });
}

format = {
  YYYY: new Intl.DateTimeFormat("en", { year: "numeric" }),
  MM: new Intl.DateTimeFormat("en", { month: "2-digit" }),
  DD: new Intl.DateTimeFormat("en", { day: "2-digit" }),
  HH: new Intl.DateTimeFormat("en", { hour12: false, hour: "2-digit" }),
  mm: new Intl.DateTimeFormat("en", { minute: "2-digit" }),
  ss: new Intl.DateTimeFormat("en", { second: "2-digit" }),
};

const YYYY = "YYYY";
const MM = "MM";
const DD = "DD";
const HH = "HH";
const mm = "mm";
const ss = "ss";

function currentDate(strings, ...expressions) {
  //This is gratuituous but I wanted to explore using a tagged template
  const current = new Date();

  let result = "";
  strings.forEach((str, i) => {
    result += str;
    if (i < expressions.length) {
      result += format[expressions[i]]?.format(current) || expressions[i];
    }
  });
  return result;
}

document
  .querySelector("#capture")
  .addEventListener("click", () => takeScreenshot());
