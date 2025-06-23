import React from "react";
import VoiceStartButton from "./VoiceStartButton";


function App() {
  const handleStart = () => {
    console.log("Start clicked");
  };

  const handleShowChat = () => {
    console.log("Show Chat clicked");
  };

  return <VoiceStartButton onStart={handleStart} onShowChat={handleShowChat} />;
}

export default App;
