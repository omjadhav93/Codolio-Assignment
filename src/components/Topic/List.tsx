import type { Topic } from "../../types/sheet";
import TopicItem from "./Topic";

interface TopicListProps {
    topics: Topic[];
}

export default function TopicList({ topics }: TopicListProps) {
    if (topics.length === 0) {
        return (
            <p className="text-gray-500 italic">
                No topics available
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {topics.map((topic) => (
                <TopicItem key={topic.id} topic={topic} />
            ))}
        </div>
    );
}
