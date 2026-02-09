import { create } from "zustand";
import { fetchSheetData } from "../services/sheetService";
import type { Question, Topic, Workspace } from "../types/sheet";
import { arrayMove } from "../utils/reorder";

interface QuestionStore {
    questions: Record<string, Question>;
    topics: Record<string, Topic>;
    workspaces: Workspace[];
    activeWorkspaceId: string | null;
    loading: boolean;
    error: string | null;
    setActiveWorkspace: (id: string) => void;
    addWorkspace: (title: string, description: string) => void;
    updateWorkspace: (id: string, title: string, description: string) => void;
    deleteWorkspace: (id: string) => void;
    addTopic: (title: string) => void;
    updateTopic: (topicId: string, title: string) => void;
    deleteTopic: (topicId: string) => void;
    reorderTopics: (from: number, to: number) => void;
    addQuestion: (topicId: string, question: Question) => void;
    updateQuestion: (questionId: string, updates: Partial<Omit<Question, 'id' | 'isSolved'>>) => void;
    deleteQuestion: (topicId: string, questionId: string) => void;
    toggleSolved: (questionId: string) => void;
    reorderQuestions: (topicId: string, from: number, to: number) => void;
    loadSheet: () => Promise<void>;
}

export const useQuestionStore = create<QuestionStore>((set, get) => ({
    questions: {},
    topics: {},
    workspaces: [],
    activeWorkspaceId: null,
    loading: false,
    error: null,

    setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

    addWorkspace: (title, description) => {
        const id = crypto.randomUUID();

        set((state) => ({
            workspaces: [
                ...state.workspaces,
                {
                    id,
                    title,
                    description,
                    topicOrder: [],
                },
            ],
            activeWorkspaceId: id,
        }));
    },

    updateWorkspace: (id, title, description) =>
        set((state) => ({
            workspaces: state.workspaces.map((ws) =>
                ws.id === id ? { ...ws, title, description } : ws
            ),
        })),

    deleteWorkspace: (id) =>
        set((state) => {
            const newWorkspaces = state.workspaces.filter((ws) => ws.id !== id);
            const newActiveId =
                state.activeWorkspaceId === id
                    ? newWorkspaces.length > 0
                        ? newWorkspaces[0].id
                        : null
                    : state.activeWorkspaceId;

            return {
                workspaces: newWorkspaces,
                activeWorkspaceId: newActiveId,
            };
        }),

    addTopic: (title) => {
        const { activeWorkspaceId } = get();
        if (!activeWorkspaceId) return;

        const topicId = crypto.randomUUID();

        set((state) => ({
            topics: {
                ...state.topics,
                [topicId]: {
                    id: topicId,
                    title,
                    questionOrder: [],
                },
            },
            workspaces: state.workspaces.map((ws) =>
                ws.id !== activeWorkspaceId
                    ? ws
                    : { ...ws, topicOrder: [...ws.topicOrder, topicId] }
            ),
        }));
    },

    updateTopic: (topicId, title) =>
        set((state) => ({
            topics: {
                ...state.topics,
                [topicId]: {
                    ...state.topics[topicId],
                    title,
                },
            },
        })),

    deleteTopic: (topicId) => {
        const { activeWorkspaceId } = get();
        if (!activeWorkspaceId) return;

        set((state) => {
            const { [topicId]: _, ...remainingTopics } = state.topics;

            return {
                topics: remainingTopics,
                workspaces: state.workspaces.map((ws) =>
                    ws.id !== activeWorkspaceId
                        ? ws
                        : {
                            ...ws,
                            topicOrder: ws.topicOrder.filter((id) => id !== topicId),
                        }
                ),
            };
        });
    },

    reorderTopics: (from, to) => {
        const { activeWorkspaceId } = get();
        if (!activeWorkspaceId) return;

        set((state) => ({
            workspaces: state.workspaces.map((ws) =>
                ws.id !== activeWorkspaceId
                    ? ws
                    : {
                        ...ws,
                        topicOrder: arrayMove(ws.topicOrder, from, to),
                    }
            ),
        }));
    },

    addQuestion: (topicId, question) =>
        set((state) => ({
            questions: {
                ...state.questions,
                [question.id]: question,
            },
            topics: {
                ...state.topics,
                [topicId]: {
                    ...state.topics[topicId],
                    questionOrder: [
                        ...state.topics[topicId].questionOrder,
                        question,
                    ],
                },
            },
        })),

    updateQuestion: (questionId, updates) =>
        set((state) => ({
            questions: {
                ...state.questions,
                [questionId]: {
                    ...state.questions[questionId],
                    ...updates,
                },
            },
        })),

    deleteQuestion: (topicId, questionId) =>
        set((state) => {
            const { [questionId]: _, ...remainingQuestions } = state.questions;

            return {
                questions: remainingQuestions,
                topics: {
                    ...state.topics,
                    [topicId]: {
                        ...state.topics[topicId],
                        questionOrder: state.topics[topicId].questionOrder.filter(
                            (q) => q.id !== questionId
                        ),
                    },
                },
            };
        }),

    toggleSolved: (questionId) =>
        set((state) => ({
            questions: {
                ...state.questions,
                [questionId]: {
                    ...state.questions[questionId],
                    isSolved: !state.questions[questionId].isSolved,
                },
            },
        })),

    reorderQuestions: (topicId, from, to) =>
        set((state) => ({
            topics: {
                ...state.topics,
                [topicId]: {
                    ...state.topics[topicId],
                    questionOrder: arrayMove(
                        state.topics[topicId].questionOrder,
                        from,
                        to
                    ),
                },
            },
        })),

    loadSheet: async () => {
        set({ loading: true, error: null });

        try {
            const apiTopics = await fetchSheetData();

            const questions: Record<string, Question> = {};
            const topics: Record<string, Topic> = {};
            const topicOrder: string[] = [];

            for (const apiTopic of apiTopics) {
                const topicId = crypto.randomUUID();
                topicOrder.push(topicId);

                const questionOrder: Question[] = [];

                for (const q of apiTopic.questionOrder) {
                    questions[q.id] = q;
                    questionOrder.push(q);
                }

                topics[topicId] = {
                    id: topicId,
                    title: apiTopic.title,
                    questionOrder,
                };
            }

            const workspaceId = "striver-sde-sheet";

            set({
                questions,
                topics,
                workspaces: [
                    {
                        id: workspaceId,
                        title: "Striver SDE Sheet",
                        description:
                            "Curated DSA sheet for software engineering interviews",
                        topicOrder,
                    },
                ],
                activeWorkspaceId: workspaceId,
                loading: false,
            });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Unknown error",
                loading: false,
            });
        }
    },
}));