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
            <p className="text-sm text-gray-500 italic">
                No questions available
            </p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full border rounded-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm">#</th>
                        <th className="px-4 py-2 text-left text-sm">Question</th>
                        <th className="px-4 py-2 text-left text-sm">Platform</th>
                        <th className="px-4 py-2 text-left text-sm">Difficulty</th>
                        <th className="px-4 py-2 text-center text-sm">Solved</th>
                        <th className="px-4 py-2 text-center text-sm">Resource</th>
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
                            ))}</SortableContext>
                    </DndContext>
                </tbody>
            </table>
        </div>
    );
}
