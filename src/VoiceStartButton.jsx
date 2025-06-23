import React from "react";
import "./VoiceStartButton.css"; // We'll use this for styles
import logo from "./assets/logo.png"; // Logo image

export default function VoiceStartButton({ onStart, onShowChat }) {
  return (
    <div className="voice-container">
      <div className="voice-circle">
        <img src={logo} alt="logo" className="voice-logo" />
        
        <button className="start-button" onClick={onStart}>
          📞 Start
        </button>
      </div>
      <button className="show-chat-button" onClick={onShowChat}>
        Show Chat
      </button>
    </div>
  );
}
