import { useEffect } from "react";
import { useQuestionStore } from "./store/questionStore";
import TopicList from "./components/Topic/List";

export default function App() {
  console.log("App component rendering");
  const { topics, loadSheet, loading, error } = useQuestionStore();

  useEffect(() => {
    console.log("useEffect running, calling loadSheet");
    loadSheet();
  }, [loadSheet]);

  return (loading ? <p className="p-4">Loading...</p> : error ? <p className="p-4 text-red-500">{error}</p> :
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Topics</h1>

      <TopicList topics={topics} />
    </div>
  );
}