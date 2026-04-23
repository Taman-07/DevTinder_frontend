import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage]=useState("");

  const user=useSelector(store => store.user);
  const userId=user?._id;


useEffect(() => {
  if(!userId){
    return;
  }
  const socket=createSocketConnection();
  socket.emit("joinChat", {userId, targetUserId});

  socket.on("messageReceived", ({ firstName, text }) => {
    console.log(firstName + ": " + text);
    setMessages((messages) => [...messages, {firstName, text}]);
  });

  return () => {
    socket.disconnect();
  };
}, [userId, targetUserId]);


const sendMessage = () => {
  const socket=createSocketConnection();
  socket.emit("sendMessage", {
    firstName: user.firstName,
    userId, 
    targetUserId, 
    text: newMessage
  });
  setNewMessage("");
}


return (
  <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
    <h1 className="p-5 border-b border-gray-600">Chat</h1>
    <div className="flex-1 overflow-scroll p-5">
    {messages.map((msg, index) => {
    return (
      <div key={index} className="chat chat-start">
        <div className="chat-header">{msg.firstName}
        <time className="text-xs opacity-50"> 2 hours ago</time>
      </div>
      <div className="chat-bubble">{msg.text}</div>
    <div className="chat-footer opacity-50">Seen</div>
  </div>
);
})}
  </div>
    <div className="p-4 border-t border-gray-600 flex gap-2">
      <input 
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      type="text" placeholder="Type a message" 
      className="flex-1 border border-gray-400 rounded-full px-4 py-2 outline-none"/>

      <button onClick={sendMessage} 
      className="px-4 py-2 bg-blue-500 text-white rounded-full">Send</button></div>
    </div>
);
};

export default Chat;