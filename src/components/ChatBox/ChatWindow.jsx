import React from "react";
//import "./ChatWindow.css"; // Import your styles
import "./ChatWindow.css"; // Import your styles
import { Bot, User,Download } from "lucide-react";

const ChatWindow = ({ onClose, messages }) => (
  <div className="chat-window">
    <div className="chat-window-header">

        <button className="chat-window-download" title="Download">
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
        {messages.map((msg, index) => (
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
      <button className="chat-audio-btn" disabled>
        <span role="img" aria-label="audio">
          🎤
        </span>
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
);

export default ChatWindow;