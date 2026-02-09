import { create } from "zustand";
import { fetchSheetData } from "../services/sheetService";
import type { Question, Topic } from "../types/sheet";
import { arrayMove } from "../utils/reorder";

interface QuestionStore {
    topics: Topic[];
    loading: boolean;
    error: string | null;
    addTopic: (title: string) => void;
    deleteTopic: (id: string) => void;
    markSolved: (topicId: string, questionId: string) => void;
    addQuestion: (topicId: string, question: Question) => void;
    deleteQuestion: (topicId: string, questionId: string) => void;
    loadSheet: () => Promise<void>;
    reorderTopics: (from: number, to: number) => void;
    reorderQuestions: (topicId: string, from: number, to: number) => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
    topics: [],
    loading: false,
    error: null,

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

    addQuestion: (topicId, question) =>
        set((state) => ({
            topics: state.topics.map((topic) =>
                topic.id !== topicId
                    ? topic
                    : {
                        ...topic,
                        questions: [...topic.questions, question],
                    }
            ),
        })),

    deleteQuestion: (topicId, questionId) =>
        set((state) => ({
            topics: state.topics.map((topic) =>
                topic.id !== topicId
                    ? topic
                    : {
                        ...topic,
                        questions: topic.questions.filter((q) => q.id !== questionId),
                    }
            ),
        })),

    markSolved: (topicId, questionId) =>
        set((state) => ({
            topics: state.topics.map((topic) =>
                topic.id !== topicId
                    ? topic
                    : {
                        ...topic,
                        questions: topic.questions.map((q) =>
                            q.id === questionId
                                ? { ...q, isSolved: !q.isSolved }
                                : q
                        ),
                    }
            ),
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

    reorderTopics: (from, to) =>
        set((state) => ({
            topics: arrayMove(state.topics, from, to),
        })),

    reorderQuestions: (topicId, from, to) =>
        set((state) => ({
            topics: state.topics.map((topic) =>
                topic.id !== topicId
                    ? topic
                    : {
                        ...topic,
                        questions: arrayMove(topic.questions, from, to),
                    }
            ),
        })),
}));