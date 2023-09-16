import { useState } from "react";

export default function Recorder(props) {
  const [showScreens, setShowScreens] = useState(false);

  const toggleAddScreens = () => setShowScreens(!showScreens);

  async function displayScreen(e) {
    for (const source of props.screen) {
      if (source.name === e.target.innerText) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: props.sound && {
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
            code: "h264",
          });
          handleStream(stream);
        } catch (e) {
          alert("Error! Click on add screen button to select screen");
          return;
        }
      }
    }
  }

  function handleStream(stream) {
    const videoEl = document.getElementById("captured-video");
    videoEl.srcObject = stream;
    videoEl.onloadedmetadata = (e) => videoEl.play();
  }

  return (
    <>
      <header className="screen-cast">
        <video id="captured-video" muted></video>
      </header>
      <main>
        <button
          disabled={!props.toggleBtn}
          style={{ border: "none", background: "none" }}
        >
          <svg
            fill="dodgerblue"
            width="25px"
            height="25px"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              if (props.toggleBtn) return;
              props.setSound(!props.sound);
            }}
            style={{
              background: props.sound && "lightblue",
              fill: props.sound && "darkblue",
              borderRadius: "50%",
              padding: "0.4rem",
            }}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M1129.432 113v1694.148H903.545l-451.772-451.773V564.773L903.545 113h225.887Zm542.545 248.057C1832.017 521.097 1920 733.882 1920 960.107c0 226.226-87.983 438.898-248.023 598.938l-79.851-79.85c138.694-138.582 214.93-323.018 214.93-519.087 0-196.183-76.236-380.506-214.93-519.2ZM338.83 564.773v790.602H169.415C75.672 1355.375 0 1279.703 0 1185.96V734.187c0-93.742 75.672-169.414 169.415-169.414H338.83Zm1093.922 36.085c95.776 97.018 148.407 224.644 148.407 359.16 0 134.628-52.631 262.253-148.407 359.272l-80.303-79.174c74.656-75.897 115.767-175.4 115.767-280.099 0-104.585-41.111-204.088-115.767-279.986Z"
                fillRule="evenodd"
              />{" "}
            </g>
          </svg>
        </button>
        <div>
          <h3>Select the screen to you want to record:</h3>
          {showScreens && (
            <figure className="screen-wrapper">
              <ul>
                {props.screen.length > 0
                  ? props.screen.map((el, i) => {
                      return (
                        <li
                          key={i}
                          className="active-screens"
                          onClick={(e) => {
                            displayScreen(e);
                            props.setSelectedScreen(e.target.innerText);
                            setShowScreens(!showScreens);
                          }}
                        >
                          {el.name}
                        </li>
                      );
                    })
                  : ""}
              </ul>
            </figure>
          )}
          <code style={{ padding: "0" }}>
            <strong>Screen title:</strong> {props.selectedScreen}
          </code>
        </div>
        <div
          className="btns"
          style={{
            display: "flex",
            gap: "0.3rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!showScreens && (
            <button
              className="add-screen"
              onClick={() => {
                toggleAddScreens();
                props.getScreen();
              }}
              style={{
                background: props.toggleBtn && "#ccc",
                color: props.toggleBtn && "grey",
                cursor: props.toggleBtn && "not-allowed",
              }}
              disabled={props.toggleBtn}
            >
              Add screen
            </button>
          )}
          {!showScreens && (
            <button
              onClick={
                !props.toggleBtn ? props.startRecord : props.saveRecording
              }
              className="start-record-btn"
              style={{ background: props.toggleBtn && "green" }}
              disabled={props.srBtn}
            >
              {props.srBtn && "Saving..."}
              <Btn toggleBtn={props.toggleBtn} srBtn={props.srBtn} />
            </button>
          )}
        </div>
        <h3 className="success-message" style={{ padding: !props.srBtn && 0 }}>
          {props.savedFilePath}
        </h3>
      </main>
    </>
  );
}

function Btn({ toggleBtn, srBtn }) {
  if (!toggleBtn && !srBtn) {
    return "Record";
  } else if (toggleBtn && !srBtn) {
    return "Save";
  }
}
