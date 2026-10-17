import React, { useState, useEffect, useRef } from "react";
import videoFile from "./assets/itiswednesdaymydudes.mp4";
import NotWednesday from "./NotWednesday";

const API = import.meta.env.VITE_API_URL || "http://localhost:5137";
const TICKER_THRESHOLD = 10;
const TICKER_MAX = 7;
const UNLIMITED_VOTES_TEST = false; // TESTING: set to false later
const COLORS = ["#fff475", "#f28b82", "#a7ffeb", "#cbf0f8", "#fdcfe8", "#ccff90"];
const DEFAULT_TICKER = [
  "MongoDB incoming",
  "soon",
  "it is",
  "wednesday my dudes",
  "ooooohh yeahhhhh",
];

const isWednesday = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "long" })
    .format(new Date()) === "Wednesday"; // TESTING: reset to "Wednesday" later

const getVoterId = () => {
  let id = localStorage.getItem("voterId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("voterId", id);
  }
  return id;
};

let nextSide = 0;
const pickPosition = () => {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const NOTE_W = 200, NOTE_H = 200, CENTER_HALF = 250, MARGIN = 12;
  const mid = W / 2;
  const leftMax = mid - CENTER_HALF - NOTE_W;
  const rightMin = mid + CENTER_HALF;
  const rightMax = W - NOTE_W - MARGIN;

  nextSide = 1 - nextSide;
  let left;
  if (leftMax > MARGIN && rightMax > rightMin) {
    left =
      nextSide === 0
        ? MARGIN + Math.random() * (leftMax - MARGIN)
        : rightMin + Math.random() * (rightMax - rightMin);
  } else {
    left = Math.random() * Math.max(0, W - NOTE_W);
  }
  const top = 140 + Math.random() * Math.max(0, H - 140 - NOTE_H - 70);
  return { left, top };
};

export default function App() {
  const [text, setText] = useState("");
  const [board, setBoard] = useState([]); // all live messages from the server
  const [notes, setNotes] = useState([]); // post-its currently on screen
  const [wednesday, setWednesday] = useState(isWednesday());
  const [muted, setMuted] = useState(true);
  const [voterId] = useState(getVoterId);

  // refs let the timers always see the latest values
  const boardRef = useRef([]);
  const notesRef = useRef([]);
  const cursor = useRef(0);
  boardRef.current = board;
  notesRef.current = notes;

  const loadBoard = async () => {
    try {
      const res = await fetch(`${API}/messages?voterId=${voterId}`);
      const list = await res.json();
      boardRef.current = list;
      setBoard(list);
      setNotes((prev) => prev.filter((n) => list.some((m) => m._id === n.id)));
    } catch (err) {
      console.log("Could not load messages", err);
    }
  };

  const spawnNote = () => {
    const list = boardRef.current;
    if (list.length === 0 || notesRef.current.length >= 6) return;

    let msg = null;
    for (let i = 0; i < list.length; i++) {
      const candidate = list[cursor.current % list.length];
      cursor.current += 1;
      if (!notesRef.current.some((n) => n.id === candidate._id)) {
        msg = candidate;
        break;
      }
    }
    if (!msg) return;

    const { left, top } = pickPosition();
    const note = {
      key: Math.random().toString(36).slice(2),
      id: msg._id,
      left,
      top,
      rotate: Math.random() * 14 - 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    notesRef.current = [...notesRef.current, note];
    setNotes((prev) => [...prev, note]);
  };

  const vote = async (id, current) => {
  const next = UNLIMITED_VOTES_TEST ? 1 : current === 1 ? 0 : 1;
  const change = UNLIMITED_VOTES_TEST ? 1 : next - current;

  setBoard((prev) =>
    prev.map((m) =>
      m._id === id ? { ...m, score: m.score + change, myVote: next } : m
    )
  );
  try {
    await fetch(`${API}/message/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId, vote: next }),
    });
  } catch (err) {
    loadBoard();
  }
};

  useEffect(() => {
    setWednesday(isWednesday());
    const interval = setInterval(() => setWednesday(isWednesday()), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadBoard().then(spawnNote);
    const poll = setInterval(loadBoard, 10000); // fetch new messages every 10s
    const cycle = setInterval(spawnNote, 2000); // new post-it every 5s
    return () => {
      clearInterval(poll);
      clearInterval(cycle);
    };
  }, []);

  if (!wednesday) {
    return <NotWednesday />;
  }

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${API}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setText("");
        loadBoard();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert("Could not reach the server. Is it running?");
    }
  };

const hotMessages = board
  .filter((m) => m.score >= TICKER_THRESHOLD)
  .sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, TICKER_MAX);
const onTape = new Set(hotMessages.map((m) => m._id));
const hot = hotMessages.map((m) => m.text);
const base = hot.length > 0 ? hot : DEFAULT_TICKER;
  let items = [];
  while (items.length < 6) items = items.concat(base); 
  const tickerItems = items.concat(items);

  return (
    <div className="page">
      <div className="top-bar">
        <div className="ticker">
          {tickerItems.map((msg, i) => (
            <div className="box" key={i}>
              {msg}
            </div>
          ))}
        </div>
      </div>

      <div className="content">
        <div className="heading">It is Wednesday my dudes!</div>

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
              if (e.key === "Enter") sendMessage();
            }}
          />
          <span className="enter-icon">↵</span>
        </div>

        <button onClick={() => setMuted((prev) => !prev)} className="mute-button">
          {muted ? "🔇 Muted" : "🔊 Sound"}
        </button>
      </div>

      <div className="notes-layer">
        {notes.map((n) => {
          const m = board.find((b) => b._id === n.id);
          if (!m) return null;
          return (
            <div
              className="note"
              key={n.key}
              style={{
                top: `${n.top}px`,
                left: `${n.left}px`,
                background: n.color,
                "--rot": `${n.rotate}deg`,
              }}
              onAnimationEnd={() =>
                setNotes((prev) => prev.filter((x) => x.key !== n.key))
              }
            >
              <div className="note-text">{m.text}</div>
              <div className="vote-bar">
                <button
                  className={`vote-btn ${m.myVote === 1 ? "active" : ""}`}
                  onClick={() => vote(m._id, m.myVote)}
                >
                  ▲ {m.score}
                </button>
                {onTape.has(m._id) && (
                  <span className="tape-tag">📼 on the tape</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}