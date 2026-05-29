import React from 'react'


export default function App() {
  return (
    <div className="page">

      {/* TOP BAR */}
      <div className="top-bar"></div>

      {/* MAIN CONTENT */}
      <div className="content">

        <h1 className="heading">My Heading</h1>

        {/* YouTube square embed */}
        <div className="video-wrapper">
          <div className="video-crop">
            <iframe
              src="https://www.youtube.com/embed/D2LwHX0PjTs?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0"
              title="video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>

        {/* Textbox */}
        <input
          className="textbox"
          type="text"
          placeholder="Type here..."
        />

      </div>
    </div>
  )
}