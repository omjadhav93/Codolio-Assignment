import type { Question } from "../../types/sheet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuestionStore } from "../../store/questionStore";

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

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: question.id });

    const { markSolved } = useQuestionStore();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr className="border-b hover:bg-gray-50" ref={setNodeRef} style={style} {...attributes}>
            <td className="px-4 py-2 text-sm text-gray-600" {...listeners}>
                {index + 1}
            </td>

            <td className="px-4 py-2">
                {question.title}
            </td>

            <td className="px-4 py-2 text-sm capitalize">
                <a
                    href={question.problemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                >
                    {question.platform}
                </a>
            </td>

            {/* Difficulty */}
            <td className="px-4 py-2">
                <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${question.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : question.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {question.difficulty}
                </span>
            </td>

            <td className="px-4 py-2 text-center">
                <input
                    type="checkbox"
                    checked={question.isSolved}
                    readOnly
                    className="h-4 w-4"
                    onChange={() => markSolved(topicId, question.id)}
                />
            </td>

            <td className="px-4 py-2 text-center">
                {question.problemUrl ? (
                    <a
                        href={question.problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm"
                    >
                        Video
                    </a>
                ) : (
                    "-"
                )}
            </td>
        </tr>
    );
}
