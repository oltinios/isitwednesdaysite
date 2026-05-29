import React from 'react'
import videoFile from './assets/itiswednesdaymydudes.mp4'

export default function App() {
  return (
    <div className="page">
      <div className="top-bar"></div>
      <div className="content">
        <h1 className="heading">My Heading</h1>

        <div className="video-wrapper">
          <video
            className="video"
            autoPlay
            muted
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