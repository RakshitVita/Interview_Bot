import React from 'react'
import { Download, User, Bot,AudioLines } from "lucide-react";
import "./ChatWindow.css"; // Import your styles
import { useState, useRef } from 'react';

const ChatWindow = ({onClose,messages,conversationId}) => {
const downloadChatAsText = () => {
  const textContent = messages
    .map(msg => `${msg.source.toUpperCase()}: ${msg.message}`)
    .join("\n");

  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "chat-history.txt";
  link.click();

  URL.revokeObjectURL(url);
};

const API_AUDIO_URL = "https://vitascout-nginx.eastus.cloudapp.azure.com/api/vitascout/default/get-conversation-audio";


  //Handling Audio 
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioCurrent, setAudioCurrent] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef(null);

  const fetchAudio = async () => {
    if (!conversationId) {
      alert("No conversation ID");
      return;
    }

    try {
      const response = await fetch(API_AUDIO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId }),
      });

      if (!response.ok) throw new Error("Failed to fetch audio");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioPlaying(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching audio");
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setAudioPlaying(true);
    } else {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  return (
<div className="chat-window">
    <div className="chat-window-header">

        <button className="chat-window-download" title="Download" onClick={downloadChatAsText}>
        <Download size={20} />

      </button>
      {/*<span>Chat</span>*/}
      <button className="chat-window-close" onClick={onClose}>
        ×
      </button>
    </div>
    <div className="chat-window-body">
      <div style={{ maxHeight: "400px", overflowY: "auto", padding: "1rem" }}>
        {/* <div className="chat-message bot">
          <Bot className="chat-avatar" size={20} />
          <span className="chat-bubble">
            Hi, I am your Interviewer Bot. Let's start your interview.
          </span>
        </div> */}
        {messages && messages.map((msg, index) => (
          <div
          className="chat-message bot"
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.source === "user" ? "flex-end" : "flex-start",
            }}
          >
            {/* Avatar */}
            {msg.source === "ai" ? (
              <Bot className="chat-avatar" size={20} />
            ) : (
              <User className="chat-avatar" size={20} />
            )}

            <div
              className="chat-bubble"
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="chat-window-footer">
      <button className="chat-audio-btn" onClick={fetchAudio}>
          <AudioLines size={23} color="#fff" />
      </button>
      <input className="chat-input" placeholder="Type your message..." disabled />
      <button className="chat-send-btn" disabled>
        
        <span role="img" aria-label="send">
          ▶️
        </span>
      </button>
      <span className="chat-timer">0:00 / 0:00</span>
    </div>
  </div>
  )
}

export default ChatWindow
