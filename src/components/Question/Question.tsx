import { useState } from "react";
import type { Question } from "../../types/sheet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuestionStore } from "../../store/questionStore";
import ConfirmDialog from "../ConfirmDialog";

interface QuestionProps {
    question: Question;
    index: number;
    topicId: string
}

export default function QuestionRow({
    question,
    index,
    topicId
}: QuestionProps) {

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: question.id });

    const { markSolved, deleteQuestion } = useQuestionStore();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <>
            <tr
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                ref={setNodeRef}
                style={style}
                {...attributes}
            >
                <td
                    className="px-3 py-2 text-xs text-slate-400 align-middle"
                    {...listeners}
                >
                    {index + 1}
                </td>

                <td className="px-3 py-2 align-middle">
                    <p className="text-sm font-medium text-slate-900">
                        {question.title}
                    </p>
                </td>

                <td className="px-3 py-2 text-sm align-middle">
                    {question.problemUrl ? (
                        <a
                            href={question.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-slate-900 underline-offset-2 hover:underline"
                        >
                            {question.platform}
                        </a>
                    ) : (
                        <span className="text-xs text-slate-400">
                            {question.platform}
                        </span>
                    )}
                </td>

                <td className="px-3 py-2 align-middle">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${question.difficulty === "Easy"
                            ? "bg-emerald-50 text-emerald-700"
                            : question.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                    >
                        {question.difficulty}
                    </span>
                </td>

                <td className="px-3 py-2 text-center align-middle">
                    <input
                        type="checkbox"
                        checked={question.isSolved}
                        readOnly
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/40"
                        onChange={() => markSolved(topicId, question.id)}
                    />
                </td>

                <td className="px-3 py-2 text-center align-middle">
                    {question.problemUrl ? (
                        question.resource ? (
                            <a
                                href={question.resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-slate-700 underline-offset-2 hover:underline"
                            >
                                Video
                            </a>
                        ) : (
                            <span className="text-xs text-slate-400">—</span>
                        )
                    ) : (
                        <span className="text-xs text-slate-300">—</span>
                    )}
                </td>

                <td className="px-3 py-2 text-center align-middle">
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
                            alt="Delete question"
                            className="h-4 w-4"
                        />
                    </button>
                </td>
            </tr>
            <ConfirmDialog
                open={showDeleteConfirm}
                title="Delete this question?"
                description="This will remove the question from this topic. This action cannot be undone."
                confirmLabel="Delete question"
                onConfirm={() => {
                    deleteQuestion(topicId, question.id);
                    setShowDeleteConfirm(false);
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
