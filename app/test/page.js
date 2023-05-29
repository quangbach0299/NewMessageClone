"use client";
import React, { useState, useEffect } from "react";

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      return;
    }
    const newMessage = {
      id: new Date().getTime().toString(),
      text: inputValue,
      timestamp: new Date().toLocaleString(),
    };
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleMessageSubmit(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [messages]);

  return (
    <div>
      <h1>Chat App</h1>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <p>{message.text}</p>
            <span>{message.timestamp}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatApp;
