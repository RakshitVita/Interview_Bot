import React from "react";
//import "./ChatWindow.css"; // Import your styles
import "./ChatWindow.css"; // Import your styles
import { Bot } from "lucide-react";

const ChatWindow = ({ onClose }) => (
  <div className="chat-window">
    <div className="chat-window-header">
        <button className="chat-window-download" title="Download">
        ⬇️
      </button>
      {/*<span>Chat</span>*/}
      <button className="chat-window-close" onClick={onClose}>×</button>
    </div>
    <div className="chat-window-body">
      <div className="chat-message bot">
        <Bot  className="chat-avatar" size={20} />
        <span className="chat-bubble">
          Hi, I am your Interviewer Bot. Let's start your interview.
        </span>
      </div>
      {/* Add more chat messages here */}
    </div>
    <div className="chat-window-footer">
      <button className="chat-audio-btn" disabled>
        <span role="img" aria-label="audio">🎤</span>
      </button>
      <input className="chat-input" placeholder="Type your message..." disabled />
      <button className="chat-send-btn" disabled>
        <span role="img" aria-label="send">▶️</span>
      </button>
      <span className="chat-timer">0:00 / 0:00</span>
    </div>
  </div>
);

export default ChatWindow;