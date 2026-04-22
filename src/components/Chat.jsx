import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">

      <div className="px-6 py-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      <div className="w-full flex justify-center p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center w-[650px]">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          />

          <button
            onClick={handleSend}
            className="ml-4 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium transition"
          >
            Send
          </button>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-6 flex flex-col ${
          messages.length === 0 ? "justify-center items-center" : ""
        }`}
      >
        {messages.length === 0 ? (
          <p className="text-gray-400">
            No messages yet. Start a conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender === "me" ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Chat;