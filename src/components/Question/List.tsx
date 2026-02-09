import type { Question } from "../../types/sheet";
import QuestionRow from "./Question";

interface QuestionTableProps {
    questions: Question[];
}

export default function QuestionTable({
    questions,
}: QuestionTableProps) {
    if (questions.length === 0) {
        return (
            <p className="text-sm text-gray-500 italic">
                No questions available
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
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
                    {questions.map((q, index) => (
                        <QuestionRow
                            key={q.id}
                            question={q}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
