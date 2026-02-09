import type { Question } from "../../types/sheet";
import QuestionRow from "./Question";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useQuestionStore } from "../../store/questionStore";

interface QuestionTableProps {
    questions: Question[];
    topicId: string;
}

export default function QuestionTable({
    questions,
    topicId
}: QuestionTableProps) {
    const { reorderQuestions } = useQuestionStore();

    if (questions.length === 0) {
        return (
            <p className="text-xs text-slate-400 italic">
                No questions added yet.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white/70">
            <table className="min-w-full text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/80">
                    <tr>
                        <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            #
                        </th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Question
                        </th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Platform
                        </th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Difficulty
                        </th>
                        <th className="px-3 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Solved
                        </th>
                        <th className="px-3 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Resource
                        </th>
                        <th className="px-3 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Delete
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => {
                            const { active, over } = event;
                            if (!over || active.id === over.id) return;

                            const from = questions.findIndex(t => t.id === active.id);
                            const to = questions.findIndex(t => t.id === over.id);

                            reorderQuestions(topicId, from, to);
                        }}
                    >
                        <SortableContext
                            items={questions.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {questions.map((q, index) => (
                                <QuestionRow
                                    key={q.id}
                                    question={q}
                                    index={index}
                                    topicId={topicId}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </tbody>
            </table>
        </div>
    );
}
