import { useState } from "react";
import type { Question } from "../../types/sheet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuestionStore } from "../../store/questionStore";
import ConfirmDialog from "../ConfirmDialog";

interface QuestionProps {
    question: Question;
    topicId: string
}

export default function QuestionRow({
    question,
    topicId
}: QuestionProps) {

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: question.title,
        difficulty: question.difficulty,
        problemUrl: question.problemUrl,
        resource: question.resource,
    });

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: question.id });

    const { toggleSolved, deleteQuestion, updateQuestion } = useQuestionStore();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm({
            title: question.title,
            difficulty: question.difficulty,
            problemUrl: question.problemUrl,
            resource: question.resource,
        });
    };

    const handleSave = () => {
        if (editForm.title.trim() === "") return;

        updateQuestion(question.id, {
            title: editForm.title.trim(),
            difficulty: editForm.difficulty,
            problemUrl: editForm.problemUrl.trim(),
            resource: editForm.resource.trim(),
        });

        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            title: question.title,
            difficulty: question.difficulty,
            problemUrl: question.problemUrl,
            resource: question.resource,
        });
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-3 border-b border-slate-100 last:border-0 bg-slate-50/70 transition-colors px-4 py-3">
                <div className="flex-shrink-0">
                    <input
                        type="checkbox"
                        checked={question.isSolved}
                        readOnly
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/40"
                        onChange={() => toggleSolved(question.id)}
                    />
                </div>

                <div className="flex-shrink-0">
                    <img
                        src="/dots-six-black.svg"
                        alt="Drag to reorder"
                        className="h-4 w-4 opacity-40"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Question title"
                        autoFocus
                    />
                </div>

                <div className="flex-shrink-0 w-24">
                    <input
                        type="url"
                        value={editForm.problemUrl}
                        onChange={(e) => setEditForm({ ...editForm, problemUrl: e.target.value })}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Problem URL"
                    />
                </div>

                <div className="flex-shrink-0 w-20 flex justify-center">
                    <select
                        value={editForm.difficulty}
                        onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as "Easy" | "Medium" | "Hard" })}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${editForm.difficulty === "Easy"
                            ? "bg-emerald-50 text-emerald-700"
                            : editForm.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div className="flex-shrink-0 w-24">
                    <input
                        type="url"
                        value={editForm.resource}
                        onChange={(e) => setEditForm({ ...editForm, resource: e.target.value })}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Resource URL"
                    />
                </div>

                <div className="flex-shrink-0 flex items-center gap-1">
                    <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-emerald-100 bg-emerald-50 transition-colors"
                        onClick={handleSave}
                        disabled={editForm.title.trim() === ""}
                        title="Save"
                    >
                        <img
                            src="/check.svg"
                            alt=""
                            className="h-4 w-4 text-emerald-700"
                        />
                    </button>

                    <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-200 bg-slate-100 transition-colors"
                        onClick={handleCancel}
                        title="Cancel"
                    >
                        <img
                            src="/x.svg"
                            alt=""
                            className="h-4 w-4 text-slate-600"
                        />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className="flex items-center gap-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors px-4 py-3"
                ref={setNodeRef}
                style={style}
                {...attributes}
            >
                <div className="flex-shrink-0">
                    <input
                        type="checkbox"
                        checked={question.isSolved}
                        readOnly
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/40"
                        onChange={() => toggleSolved(question.id)}
                    />
                </div>


                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                        {question.title}
                    </p>
                </div>

                <div className="flex-shrink-0 w-24 text-center">
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
                </div>

                <div className="flex-shrink-0 w-20 flex justify-center">
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
                </div>

                <div className="flex-shrink-0 w-12 text-center">
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
                </div>

                <div className="flex-shrink-0 flex items-center gap-1">
                    <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit();
                        }}
                    >
                        <img
                            src="/edit.svg"
                            alt=""
                            className="h-4 w-4 text-slate-600"
                        />
                    </button>

                    <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-rose-50 transition-colors"
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
                </div>

                <div
                    className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                    {...listeners}
                >
                    <img
                        src="/dots-six-black.svg"
                        alt="Drag to reorder"
                        className="h-4 w-4 opacity-60 hover:opacity-100 transition-opacity"
                    />
                </div>
            </div>
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
