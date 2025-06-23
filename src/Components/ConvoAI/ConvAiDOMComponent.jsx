import React, { useEffect, useMemo, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { useConversationStore } from '../../stores/useChatStore' // Update path as needed
import "./ConvAiDOMComponent.css"; // Create and use this for styles

export default function ConvAiDOMComponent({
  platform,
  onMessage,
  onSubtitle,
  onConversationId,
}) {
  const {
    status,
    sessionId,
    messages,
    subtitle,
    startSession,
    endSession,
    setMeta,
  } = useConversationStore();

  

  const { agentId, jobId, candidateId } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      agentId: params.get("agent_id") || "",
      jobId: params.get("job_id") || "",
      candidateId: params.get("candidate_id") || "",
    };
  }, []);

  useEffect(() => {
    setMeta(agentId, jobId, candidateId);
  }, [agentId, jobId, candidateId, setMeta]);

  useEffect(() => {
    if (onSubtitle) onSubtitle(subtitle);
  }, [subtitle, onSubtitle]);

  useEffect(() => {
    messages.forEach((msg) => onMessage(msg));
  }, [messages, onMessage]);

  // Ripple animation state (simplified for web)
  const [showRipples, setShowRipples] = useState(false);

  useEffect(() => {
    setShowRipples(status === "connected");
  }, [status]);

  return (
    <div className="callButton">
      {showRipples && (
        <div className="ripples">
          <div className="ripple" />
          <div className="ripple" />
          <div className="ripple" />
        </div>
      )}

      <div className="buttonInner">
        <div className="logoContainer">
          <img src="./img/Vita.png" alt="Vita Logo" className="vitaLogo" />
        </div>

        <div className="gradientBg" />

        <div className="centerContent">
          <button
            className={`startMicContainer ${
              status === "connected" && !!onSubtitle ? "end" : ""
            }`}
            onClick={async () => {
              if (status === "disconnected") {
                await startSession(platform);
                if (onConversationId) onConversationId(sessionId);
              } else {
                await endSession();
              }
            }}
          >
            <Phone size={22} color="#fff" className="startMicIcon" />
            <span className="startMicText">
              {status === "connected" && !!onSubtitle ? "End" : "Start"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}