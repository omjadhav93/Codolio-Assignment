import { create } from "zustand";
import { fetchSheetData } from "../services/sheetService";
import type { Topic } from "../types/sheet";

interface QuestionStore {
    topics: Topic[];
    loading: boolean;
    error: string | null;
    setTopics: (topics: Topic[]) => void;
    addTopic: (title: string) => void;
    deleteTopic: (id: string) => void;
    loadSheet: () => Promise<void>;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
    topics: [],
    loading: false,
    error: null,

    setTopics: (topics) => set({ topics }),

    addTopic: (title) =>
        set((state) => ({
            topics: [
                ...state.topics,
                {
                    id: Date.now().toString(),
                    title,
                    questions: [],
                },
            ],
        })),

    deleteTopic: (id) =>
        set((state) => ({
            topics: state.topics.filter((t) => t.id !== id),
        })),


    loadSheet: async () => {
        set({ loading: true, error: null });
        try {
            const topics = await fetchSheetData();
            console.log(topics);
            set({ topics, loading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Unknown error",
                loading: false,
            });
        }
    },
}));