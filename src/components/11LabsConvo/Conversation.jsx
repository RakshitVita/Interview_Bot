import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useConversation } from '@11labs/react';
import logo from "../../assets/logo.png";
import "./Conversation.css"; // Import your styles

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
        <div className="voice-container">
            <div className="voice-circle">
                <img src={logo} alt="logo" className="voice-logo" />

                <button
                    className="start-button"
                    onClick={status === "connected" ? handleStop : handleStart}
                    disabled={isLoading}
                >
                    {isLoading ? "⏳ Loading..." : status === "connected" ? "🔴 End" : "📞 Start"}
                </button>
            </div>
            <button className="show-chat-button" >
                Show Chat
            </button>
        </div>
    );
};


const styles = {
    container: {
        textAlign: "center",
        marginTop: "5rem",
        fontFamily: "sans-serif"
    },
    subtitle: {
        margin: "1rem 0",
        fontSize: "1.2rem",
        color: "#333"
    },
    button: {
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    }
};

export default Conversation
