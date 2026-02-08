import { useEffect } from "react";
import { useQuestionStore } from "./store/questionStore";

export default function App() {
  console.log("App component rendering");
  const { topics, loadSheet, loading, error } = useQuestionStore();

  useEffect(() => {
    console.log("useEffect running, calling loadSheet");
    loadSheet();
  }, [loadSheet]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Topics</h1>

      {topics.map((topic) => (
        <div
          key={topic.id}
          className="border p-4 mb-3 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-2">{topic.title}</h2>
          {topic.questions && topic.questions.length > 0 && (
            <p className="text-sm text-gray-600">
              {topic.questions.length} questions
            </p>
          )}
        </div>
      ))}
    </div>
  );
}