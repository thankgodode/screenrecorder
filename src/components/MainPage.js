import { useState } from "react";
import Recorder from "./Recorder";

let mediaRecorder;

//NB: "SRBtn/srBtn" stands for "save record button"

export default function MainPage() {
  const [toggleBtn, setToggleBtn] = useState(false);
  const [sound, setSound] = useState(false);
  const [screen, setScreen] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("None");
  const [srBtn, setSRBtn] = useState(false);
  const [savedFilePath, setSavedFilePath] = useState("");

  async function getScreen() {
    const request = await window.electronAPI.getScreenSources();
    setScreen(request);
    return request;
  }

  async function handleSelectScreen() {
    try {
      return screen.find((el) => (el.name === selectedScreen ? el : ""));
    } catch (error) {
      console.error(
        `Error retrieving desktop sources. The screen you selected has been closed. Try restarting the app again`
      );
    }
  }

  async function startRecording() {
    if (selectedScreen === "None") {
      alert('Please click on "Add Screen" button to add screen');
      return;
    }

    const chunks = [];

    for (const source of screen) {
      if (source.name === selectedScreen) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: sound && {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: source.id,
              },
            },
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: source.id,
                minWidth: 1092,
                maxWidth: 1092,
                minHeight: 614,
                maxHeight: 614,
                minFrameRate: 30,
                maxFrameRate: 30,
                minBitsPerSecond: 2500000,
                maxBitsPerSecond: 2500000,
              },
            },
            // code: "h264",
          });

          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          mediaRecorder.onstop = async () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const blobToBuffer = await blob.arrayBuffer();
            const buffer = new Uint8Array(blobToBuffer);

            setSRBtn(true);
            const convert = await window.electronAPI.convert(buffer);
            setSavedFilePath(`Recorded file saved to ${convert}`);
            setSRBtn(false);

            await new Promise((resolve) => {
              return setTimeout(resolve, 3000);
            });

            setSavedFilePath("");
          };
          mediaRecorder.start();
        } catch (e) {
          alert(
            "Error! Seems like the screen you are \ntrying to record has been closed/minimized"
          );
          return;
        }
      }
    }

    setToggleBtn(!toggleBtn);
  }

  async function saveRecording() {
    setToggleBtn(!toggleBtn);
    mediaRecorder.stop();
  }

  return (
    <>
      <Recorder
        screen={screen}
        selectedScreen={selectedScreen}
        setSelectedScreen={setSelectedScreen}
        toggleBtn={toggleBtn}
        sound={sound}
        setSound={setSound}
        startRecord={startRecording}
        saveRecording={saveRecording}
        getScreen={getScreen}
        handleSelectScreen={handleSelectScreen}
        srBtn={srBtn}
        savedFilePath={savedFilePath}
      />
    </>
  );
}
