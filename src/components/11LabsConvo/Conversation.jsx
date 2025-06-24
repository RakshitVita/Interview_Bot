import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useConversation } from '@11labs/react';
import logo from "../../assets/logo.png";
import "./Conversation.css"; // Import your styles
import ChatWindow from '../ChatBox/ChatWindow';


async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
    } catch (error) {
        console.error("Microphone permission denied", error);
        return false;
    }
}

const Conversation = ({ agent_id, candidate_id, job_id }) => {
    const [sessionId, setSessionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [subtitle, setSubtitle] = useState("");

    const [showChat, setShowChat] = useState(false);

    const [message, setMessages] = useState(
        [
                { source: "ai", message: "Hi there!" },
                { source: "user", message: "Hello!" },
                { source: "ai", message: "What's your name?" }
            ]
    );
   





    const {
        startSession,
        endSession,
        status,
        messages
    } = useConversation({
        onConnect: () => console.log("Connected to 11labs"),
        onDisconnect: () => console.log("Disconnected from 11labs"),
        onMessage: (msg) => {
            console.log("AI said:", msg);
            setSubtitle(msg.text || "");
            setMessages(prev => [...prev, msg]);
        },
        onError: (err) => console.error("11labs Error", err)
    });

    const handleStart = useCallback(async () => {
        if (!agent_id) {
            alert("Missing agent ID");
            return;
        }

        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            alert("Please enable microphone access to continue.");
            return;
        }

        try {
            setIsLoading(true);
            const sid = await startSession({
                agentId: agent_id,
                dynamicVariables: { platform: "web" },
                clientTools: {
                    logMessage: async ({ message }) => console.log(message),
                },
            });

            if (typeof sid === "string") {
                setSessionId(sid);
            } else {
                console.warn("startSession returned:", sid);
            }
        } catch (err) {
            console.error("Failed to start session:", err);
        } finally {
            setIsLoading(false);
        }
    }, [agent_id, startSession]);

    const handleStop = useCallback(async () => {
        await endSession();
        try {
            const payload = {
                conversation_id: sessionId,
                agent_id,
                candidate_id: candidate_id ? parseInt(candidate_id, 10) : undefined,
                job_id: job_id ? parseInt(job_id, 10) : undefined,
            };

            await fetch("https://vitascout-nginx.eastus.cloudapp.azure.com/api/vitascout/default/check-conversation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.error("check-conversation API call failed", err);
        }
    }, [sessionId, agent_id, candidate_id, job_id, endSession]);



    return (
        <div className={`voice-container${status === "connected" ? " ripple-active" : ""}`}>
            <div className="voice-circle">
                <img src={logo} alt="logo" className="voice-logo" />

                <button

                    className="start-button"


                    onClick={status === "connected" ? handleStop : handleStart}
                    disabled={isLoading}
                >
                    {isLoading ? "⏳ Loading..." : status === "connected" ? "End" : "📞 Start"}
                </button>
            </div>
            <button
                className="show-chat-button"

                onClick={() => setShowChat((prev) => !prev)}
            >
                {showChat ? "Hide Chat" : "Show Chat"}
            </button>

            {showChat && <ChatWindow onClose={() => setShowChat(false)} />}

        </div>
    );
};

// onClick={() => setShowChat(prev => !prev)}
// {showChat && <Demo messages={message} />}


export default Conversation
