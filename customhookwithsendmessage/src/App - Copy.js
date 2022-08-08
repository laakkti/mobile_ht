// https://developers.google.com/gmail/api/quickstart/js

import React, { useState, useEffect } from "react";
import SendMessage from "./components/SendMessage";
import EmailForm from "./components/EmailForm";

const App = () => {
  const [mode, setMode] = useState("init");
  const [message, setMessage] = useState("");

  const handleSendMessage = (msg) => {
    //console.log("send=" + mode);
    setMessage(msg);
    console.log("msg=" + msg);
    //setMode("send");
  };

  // välttämättä ei lähetetä socket.id:tä koska se palautuu mutta voihan sen nöäöinkin tehdä niin saadaan samaan pakettiin json
  // 
  //<button onClick={handleSendMessage}>SendMessage</button>

  return (
    <div>
      <SendMessage mode={mode} setMode={setMode} message={message}/>      
      <EmailForm socketId="1234567" handleSendMessage={handleSendMessage}/>
    </div>
  );
};
export default App;
