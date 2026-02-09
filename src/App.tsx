import { useEffect, useRef, useState } from "react";
import { useQuestionStore } from "./store/questionStore";
import TopicList from "./components/Topic/List";

export default function App() {
  const { topics, loadSheet, loading, error } = useQuestionStore();
  const [newTopic, setNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const newT = useRef<HTMLDivElement | null>(null);
  const { addTopic } = useQuestionStore();

  useEffect(() => {
    loadSheet();
  }, [loadSheet]);

  const addTopicSection = () => {
    setNewTopic(true);
    newT.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const submitTopic = () => {
    if (newTopicTitle.trim() === "") return;
    addTopic(newTopicTitle);
    setNewTopicTitle("");
    closeTopic();
  };

  const closeTopic = () => {
    setNewTopic(false);
    setNewTopicTitle("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading your sheet…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Question Sheet
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Organise topics, track progress, and keep your practice list tidy.
            </p>
          </div>
          <button
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors"
            onClick={addTopicSection}
          >
            <span className="mr-2 text-base leading-none">＋</span>
            New topic
          </button>
        </header>

        <main className="space-y-6">
          <section>
            <TopicList topics={topics} />
          </section>

          {newTopic && (
            <section ref={newT}>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" ref={newT}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <input
                    type="text"
                    placeholder="Topic title"
                    className="w-full border-0 bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                  <div className="flex gap-2 md:ml-4">
                    <button
                      className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                      onClick={submitTopic}
                    >
                      Add
                    </button>
                    <button
                      className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      onClick={closeTopic}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}