import React, { useRef, useState } from "react";
import videoFile from "./assets/itiswednesdaymydudes.mp4";
import { storage, ID } from "./appwrite";

export default function App() {
  const messages = [
    "hello world",
    "it is wednesday",
    "my dudes",
    "react is alive",
    "firebase incoming",
    "winter is coming",
    "oooooohhh yeahhhh",
    "boi what the helllllll",
  ];

  const [muted, setMuted] = useState(true);
  const [videoId, setVideoId] = useState(null);
  const videoRef = useRef(null);

  const uploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await storage.createFile(
        "YOUR_BUCKET_ID",
        ID.unique(),
        file
      );

      console.log("Uploaded:", res);

      setVideoId(res.$id);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const videoUrl = videoId
    ? storage.getFileView("6a19ff28001b207204bc", videoId)
    : videoFile;

  return (
    <div className="page">

      <div className="top-bar">
        <div className="ticker">
          {messages.concat(messages).map((msg, i) => (
            <div className="box" key={i}>
              {msg}
            </div>
          ))}
        </div>
      </div>

      <div className="content">
        <h1 className="heading">It is Wednesday my dudes!</h1>

        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="video"
            autoPlay
            loop
            playsInline
            muted={muted}
            src={videoUrl}
          />
        </div>

        <input
          className="textbox"
          type="text"
          placeholder="Type here..."
        />

        <button
          onClick={() => setMuted(prev => !prev)}
          className="mute-button"
        >
          {muted ? "🔇 Muted" : "🔊 Sound"}
        </button>
      </div>

    </div>
  );
}