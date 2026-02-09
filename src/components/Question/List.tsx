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
        <div className="rounded-xl border border-slate-100 bg-white/70">
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
                    <div className="flex flex-col">
                        {questions.map((q) => (
                            <QuestionRow
                                key={q.id}
                                question={q}
                                topicId={topicId}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
