import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

// ---------- date / time helpers ----------
const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

const formatDateLabel = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  return d.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // ---------- load old messages ----------
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = (chat?.data?.messages || []).map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          senderId: senderId?._id,
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          createdAt: createdAt || new Date().toISOString(),
        };
      });

      setMessages(chatMessages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  // ---------- socket connection ----------
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, createdAt }) => {
      setMessages((prev) => [
        ...prev,
        {
          firstName,
          lastName,
          text,
          createdAt: createdAt || new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  // ---------- auto scroll to latest message ----------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------- send ----------
  const sendMessage = () => {
    const text = newMessage.trim();
    if (!text || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text,
    });

    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMine = (msg) =>
    msg.senderId ? msg.senderId === userId : msg.firstName === user?.firstName;

  return (
    <div className="w-full max-w-3xl mx-auto my-5 px-3">
      <div className="h-[75vh] flex flex-col rounded-3xl border border-white/10 bg-base-300 shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-white/10 bg-base-100/40 backdrop-blur">
          <h1 className="text-xl font-extrabold tracking-tight">Chat</h1>
          <p className="text-xs text-base-content/50 mt-0.5">
            {formatDateLabel(new Date())} •{" "}
            {new Date().toLocaleDateString([], { weekday: "long" })}
          </p>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-base-content/40">
                No messages yet. Say hello! 👋
              </p>
            </div>
          )}

          {messages.map((msg, index) => {
            const mine = isMine(msg);
            const prev = messages[index - 1];
            const showDate =
              !prev ||
              new Date(prev.createdAt).toDateString() !==
                new Date(msg.createdAt).toDateString();

            return (
              <div key={index}>
                {/* DATE SEPARATOR */}
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-base-100/60 text-base-content/60">
                      {formatDateLabel(msg.createdAt)}
                    </span>
                  </div>
                )}

                <div className={"chat " + (mine ? "chat-end" : "chat-start")}>
                  <div className="chat-header text-xs font-semibold text-base-content/70 mb-1">
                    {mine ? "You" : `${msg.firstName} ${msg.lastName || ""}`}
                  </div>

                  <div
                    className={
                      "chat-bubble max-w-[80%] break-words " +
                      (mine ? "chat-bubble-primary" : "")
                    }
                  >
                    {msg.text}
                  </div>

                  <div className="chat-footer mt-1">
                    <time className="text-[11px] text-base-content/50">
                      {formatTime(msg.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="px-4 py-3 border-t border-white/10 bg-base-100/40 flex items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input input-bordered flex-1 rounded-full px-5"
          />

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            aria-label="Send message"
            className="btn btn-primary rounded-full px-6 font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
