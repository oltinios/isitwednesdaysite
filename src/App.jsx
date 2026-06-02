import React, {useState, useEffect} from "react";
import videoFile from "./assets/itiswednesdaymydudes.mp4";
import NotWednesday from "./NotWednesday";

const isWednesday = () => {
    const day = new Date().getDay();
    return day === 2; //remember to reset to 3 for wednesday when all said and done.
  }



export default function App () {

  const [text, setText] = useState("");

  const messages = [
    "MongoDB incoming",
    "soon",
    "it is",
    "wednesday my dudes",
    "ooooohh yeahhhhh"
  ]

  const [wednesday, setWednesday] = useState(isWednesday());
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setWednesday(isWednesday());
  
  const interval = setInterval(() => {
    setWednesday(isWednesday());
  }, 1000 * 60 * 60);

  return () => clearInterval(interval);

  }, []);

  if (!wednesday) {
    return <NotWednesday />;
  }

  const sendMessage = async () => {
  await fetch("http://localhost:5137/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  setText("");
};

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
        <div className="heading">
          It is Wednesday my dudes! 
          </div>
          <div className="video-wrapper">
            <video 
              src={videoFile}
              className="video"
              autoPlay
              loop
              playsInline
              muted={muted}
            />
          </div>
          <div className="input-wrapper">
            <input
              className="text-input"
              type="text"
              placeholder="Type here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <span className="enter-icon">↵</span>
          </div>
          <div>
          <button 
            onClick={()=> setMuted(prev =>!prev)}
            className="mute-button"
          >
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
          </div>
        </div>
      </div>
  )
};