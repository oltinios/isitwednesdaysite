import React from 'react'
import videoFile from './assets/itiswednesdaymydudes.mp4'

export default function App() {
  const messages = [
    "hello world",
    "it is wednesday",
    "my dudes",
    "react is alive",
    "firebase incoming",
    "winter is coming",
    "oooooohhh yeahhhh",
    "boi what the helllllll"   
  ]

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
            className="video"
            autoPlay
            loop
            playsInline
          >
            <source src={videoFile} type="video/mp4" />
          </video>
        </div>

        <input
          className="textbox"
          type="text"
          placeholder="Type here..."
        />
      </div>

    </div>
  )
}