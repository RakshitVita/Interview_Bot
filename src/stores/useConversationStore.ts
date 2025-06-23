import { create } from "zustand";
import { Message } from "../types/Message";

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
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  status: "disconnected",
  sessionId: "",
  agentId: "",
  jobId: "",
  candidateId: "",
  subtitle: "",
  messages: [],
  setMeta: (agentId, jobId, candidateId) =>
    set({ agentId, jobId, candidateId }),
  startSession: async (platform: string) => {
    // implement logic here or in your component
  },
  endSession: async () => {
    // implement logic here or in your component
  },
}));