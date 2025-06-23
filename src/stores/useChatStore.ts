import { create } from "zustand";
import { useConversation as use11Conversation } from "@11labs/react";
import { Message } from "../types/Message";
import React, { useRef } from "react";

type ConversationStatus = "disconnected" | "connected" | "connecting" | "error";

interface ConversationStore {
  status: ConversationStatus;
  sessionId: string;
  agentId: string;
  jobId: string;
  candidateId: string;
  setMeta: (agentId: string, jobId: string, candidateId: string) => void;

  messages: Message[];
  subtitle: string;

  startSession: (platform: string) => Promise<void>;
  endSession: () => Promise<void>;
  conversation: ReturnType<typeof use11Conversation> | null;
}

export const useConversationStore = create<ConversationStore>((set, get) => {
  const conversation = use11Conversation({
    onConnect: () => set({ status: "connected" }),
    onDisconnect: () => set({ status: "disconnected" }),
    onMessage: (msg) => {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            text: msg.text ?? msg.message, // fallback if needed
            type: msg.type ?? msg.role ?? msg.source, // fallback if needed
          },
        ],
        subtitle: (msg.type ?? msg.role ?? msg.source) === "agent" ? (msg.text ?? msg.message) : "",
      }));
    },
    onError: () => set({ status: "error" }),
  });

  const requestMicPermission = async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (err) {
      console.error("Mic permission denied:", err);
      return false;
    }
  };

  return {
    status: "disconnected",
    sessionId: "",
    agentId: "",
    jobId: "",
    candidateId: "",
    subtitle: "",
    messages: [],
    conversation,
    setMeta: (agentId, jobId, candidateId) =>
      set({ agentId, jobId, candidateId }),

    startSession: async (platform: string) => {
      const { agentId, conversation } = get();
      if (!agentId) {
        alert("Agent ID missing.");
        return;
      }

      const hasPermission = await requestMicPermission();
      if (!hasPermission) return;

      const sessionId = await conversation?.startSession({
        agentId,
        dynamicVariables: { platform },
        clientTools: {
          logMessage: async ({ message }) => console.log("Log:", message),
        },
      });

      if (typeof sessionId === "string") {
        set({ sessionId, status: "connected" });
      }
    },

    endSession: async () => {
      const { conversation, sessionId, agentId, jobId, candidateId } = get();
      await conversation?.endSession();
      set({ status: "disconnected", subtitle: "" });

      // Call the check-conversation API
      try {
        await fetch("https://vitascout-nginx.eastus.cloudapp.azure.com/api/vitascout/default/check-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: sessionId,
            agent_id: agentId,
            job_id: parseInt(jobId),
            candidate_id: parseInt(candidateId),
          }),
        });
      } catch (err) {
        console.error("check-conversation API failed", err);
      }
    },
  };
});

function MyComponent() {
  const myRef = useRef(null); // ✅ OK: inside a component
  // ...
}
