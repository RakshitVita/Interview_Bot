import React from 'react'
import { Bot, User } from 'lucide-react';
import './ChatBox.css';

const Chatbox = () => {
      const isAI = message.source.toLowerCase() === "ai";
  const isUser = message.source.toLowerCase() === "user";
  return (
 <div className={`message-row ${isAI ? 'start' : 'end'}`}>
      {isAI && (
        <div className="avatar bot-avatar">
          <Bot size={20} color="#006AFF" />
        </div>
      )}
      <div className={`bubble ${isAI ? 'bot-bubble' : 'user-bubble'}`}>
        <p className={`message-text ${isAI ? 'bot-text' : 'user-text'}`}>
          {message.message}
        </p>
      </div>
      {isUser && (
        <div className="avatar user-avatar">
          <User size={20} color="#006AFF" />
        </div>
      )}
    </div>
  )
}

export default Chatbox
