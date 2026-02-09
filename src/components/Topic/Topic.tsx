import { useState } from "react";
import type { Topic } from "../../types/sheet";
import QuestionTable from "../Question/List";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuestionStore } from "../../store/questionStore";
import ConfirmDialog from "../ConfirmDialog";

interface TopicProps {
    topic: Topic;
}

export default function TopicItem({ topic }: TopicProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState(false);
    const [newQuestionTitle, setNewQuestionTitle] = useState("");
    const [newQuestionPlatform, setNewQuestionPlatform] = useState("");
    const [newQuestionUrl, setNewQuestionUrl] = useState("");
    const [newQuestionDifficulty, setNewQuestionDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { addQuestion, deleteTopic } = useQuestionStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: topic.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const toggleTopic = () => {
        setIsOpen(!isOpen);
        closeNewQuestion();
    };

    const completed = topic.questions.filter(q => q.isSolved).length;
    const total = topic.questions.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const openNewQuestion = () => {
        setNewQuestion(true);
    };

    const closeNewQuestion = () => {
        setNewQuestion(false);
        setNewQuestionTitle("");
        setNewQuestionPlatform("");
        setNewQuestionUrl("");
        setNewQuestionDifficulty("Easy");
    };

    const submitQuestion = () => {
        if (newQuestionTitle.trim() === "") return;

        addQuestion(topic.id, {
            id: Date.now().toString(),
            title: newQuestionTitle,
            platform: newQuestionPlatform || "Unknown",
            problemUrl: newQuestionUrl,
            resource: "",
            difficulty: newQuestionDifficulty,
            isSolved: false,
        });

        closeNewQuestion();
    };

    return (
        <div
            className="mb-4 rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm transition hover:border-slate-300"
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <div
                className="flex w-full items-center justify-between px-4 py-3"
                onClick={toggleTopic}
                role="button"
            >
                <div className="flex items-center gap-3">
                    <img
                        src="/dots-six-black.svg"
                        alt=""
                        className="h-4 w-4 cursor-grab opacity-60"
                        {...listeners}
                    />
                    <div>
                        <h2 className="text-sm font-medium text-slate-900">
                            {topic.title}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {completed}/{total} questions solved
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-32">
                        <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                            <span>Progress</span>
                            <span>{percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-slate-900 transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                    <span className="ml-1 text-xs text-slate-400">
                        {isOpen ? "Hide" : "Show"}
                    </span>
                    <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-rose-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                        }}
                    >
                        <img
                            src="/delete.svg"
                            alt="Delete topic"
                            className="h-4 w-4"
                        />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Questions
                        </h3>
                        <button
                            className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                openNewQuestion();
                            }}
                        >
                            Add question
                        </button>
                    </div>

                    <QuestionTable topicId={topic.id} questions={topic.questions} />

                    {newQuestion && (
                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/60">
                            <div className="flex flex-col gap-3 p-3">
                                <input
                                    type="text"
                                    placeholder="Question title"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                    value={newQuestionTitle}
                                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                                />
                                <div className="flex flex-col gap-3 md:flex-row">
                                    <input
                                        type="text"
                                        placeholder="Platform (e.g. LeetCode)"
                                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                        value={newQuestionPlatform}
                                        onChange={(e) => setNewQuestionPlatform(e.target.value)}
                                    />
                                    <select
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                        value={newQuestionDifficulty}
                                        onChange={(e) =>
                                            setNewQuestionDifficulty(e.target.value as "Easy" | "Medium" | "Hard")
                                        }
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <input
                                    type="url"
                                    placeholder="Problem URL"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                    value={newQuestionUrl}
                                    onChange={(e) => setNewQuestionUrl(e.target.value)}
                                />

                                <div className="mt-1 flex justify-end gap-2">
                                    <button
                                        className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                                        onClick={submitQuestion}
                                    >
                                        Add
                                    </button>
                                    <button
                                        className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                        onClick={closeNewQuestion}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                open={showDeleteConfirm}
                title="Delete this topic?"
                description="This will remove the topic and all of its questions. This action cannot be undone."
                confirmLabel="Delete topic"
                onConfirm={() => {
                    deleteTopic(topic.id);
                    setShowDeleteConfirm(false);
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
}
