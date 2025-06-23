import { useState } from 'react'
import './App.css'
import ConvAiDOMComponent from './Components/ConvoAI/ConvAiDOMComponent'
import { useConversationStore } from './stores/useChatStore'

function App() {
  const setMeta = useConversationStore((state) => state.setMeta);
    useEffect(() => {
    // Parse URL params once on mount
    const params = new URLSearchParams(window.location.search);
    const agentId = params.get("agent_id") || "";
    const jobId = params.get("job_id") || "";
    const candidateId = params.get("candidate_id") || "";

    setMeta(agentId, jobId, candidateId);
  }, [setMeta]);

  return (
    <>
       <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      <ConvAiDOMComponent
        platform="web"
        onMessage={(msg) => console.log("Message:", msg)}
        onSubtitle={(subtitle) => console.log("Subtitle:", subtitle)}
        onConversationId={(id) => console.log("Conversation ID:", id)}
      />
    </div>
    </>
  )
}

export default App
