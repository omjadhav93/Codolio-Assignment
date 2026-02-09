import { useState } from "react";
import type { Topic } from "../../types/sheet";
import QuestionTable from "../Question/List";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TopicProps {
    topic: Topic;
}

export default function TopicItem({ topic }: TopicProps) {
    const [isOpen, setIsOpen] = useState(false);

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
    };

    const completed = topic.questions.filter(q => q.isSolved).length;
    const total = topic.questions.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="border rounded-md mb-6 overflow-hidden" ref={setNodeRef} style={style} {...attributes}>
            <div className="flex justify-between" onClick={toggleTopic}>
                <h2 {...listeners} className="p-4 text-xl font-semibold">{topic.title}</h2>

                <div className="flex items-center gap-4 px-4">
                    <div className="w-40">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{percentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-nowrap">
                        {completed}/{total} questions
                    </p>
                </div>
            </div>

            {isOpen && (
                <div className="p-4 bg-white">
                    <QuestionTable topicId={topic.id} questions={topic.questions} />
                </div>
            )}
        </div>
    );
}
