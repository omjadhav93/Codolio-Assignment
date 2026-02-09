import type { Topic } from "../../types/sheet";
import TopicItem from "./Topic";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useQuestionStore } from "../../store/questionStore";

interface TopicListProps {
    topics: Topic[];
}

export default function TopicList({ topics }: TopicListProps) {
    const { reorderTopics } = useQuestionStore();
    if (topics.length === 0) {
        return (
            <p className="text-gray-500 italic">
                No topics available
            </p>
        );
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
                const { active, over } = event;
                if (!over || active.id === over.id) return;

                const from = topics.findIndex(t => t.id === active.id);
                const to = topics.findIndex(t => t.id === over.id);

                reorderTopics(from, to);
            }}
        >
            <SortableContext
                items={topics.map(t => t.id)}
                strategy={verticalListSortingStrategy}
            >
                {topics.map((topic) => (
                    <TopicItem key={topic.id} topic={topic} />
                ))}
            </SortableContext>
        </DndContext>
    );
}
