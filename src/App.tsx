import { useEffect, useRef, useState } from "react";
import { useQuestionStore } from "./store/questionStore";
import TopicList from "./components/Topic/List";
import ConfirmDialog from "./components/ConfirmDialog";

export default function App() {
  const {
    workspaces,
    topics,
    activeWorkspaceId,
    loadSheet,
    loading,
    error,
    addTopic,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setActiveWorkspace,
  } = useQuestionStore();

  const [newTopic, setNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const newT = useRef<HTMLDivElement | null>(null);

  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState("");
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("");

  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editWorkspaceTitle, setEditWorkspaceTitle] = useState("");
  const [editWorkspaceDescription, setEditWorkspaceDescription] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    loadSheet();
  }, [loadSheet]);

  const activeWorkspace = workspaces.find(
    (ws) => ws.id === activeWorkspaceId
  );

  const orderedTopics = activeWorkspace
    ? activeWorkspace.topicOrder
      .map((id) => topics[id])
      .filter(Boolean)
    : [];

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

  const submitWorkspace = () => {
    if (newWorkspaceTitle.trim() === "") return;
    addWorkspace(newWorkspaceTitle, newWorkspaceDescription.trim());
    setNewWorkspaceTitle("");
    setNewWorkspaceDescription("");
    setShowNewWorkspace(false);
  };

  const handleEditWorkspace = (ws: typeof workspaces[0]) => {
    setEditingWorkspaceId(ws.id);
    setEditWorkspaceTitle(ws.title);
    setEditWorkspaceDescription(ws.description);
    setOpenMenuId(null);
  };

  const handleSaveWorkspace = () => {
    if (editingWorkspaceId && editWorkspaceTitle.trim() !== "") {
      updateWorkspace(editingWorkspaceId, editWorkspaceTitle.trim(), editWorkspaceDescription.trim());
      setEditingWorkspaceId(null);
      setEditWorkspaceTitle("");
      setEditWorkspaceDescription("");
    }
  };

  const handleCancelEditWorkspace = () => {
    setEditingWorkspaceId(null);
    setEditWorkspaceTitle("");
    setEditWorkspaceDescription("");
  };

  const confirmDeleteWorkspace = () => {
    if (deleteWorkspaceId) {
      deleteWorkspace(deleteWorkspaceId);
      setDeleteWorkspaceId(null);
    }
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
    <div className="h-screen bg-slate-50 text-slate-900 flex overflow-hidden">
      <aside className="hidden md:flex h-full w-64 flex-col border-r border-slate-200 bg-white/80 px-4 py-6">
        <div className="mb-6 flex items-center gap-2">
          <img src="/codolio.svg" alt="Codolio Logo" className="h-6 w-6" />
          <h1 className="text-lg font-semibold text-slate-900">Codolio</h1>
        </div>

        <div className="mb-4 border-b border-slate-200 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Workspaces
          </h2>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspaceId;
            const isMenuOpen = openMenuId === ws.id;

            return (
              <div key={ws.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveWorkspace(ws.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left transition-colors ${isActive
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">
                      {ws.title}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(isMenuOpen ? null : ws.id);
                      }}
                      className={`flex-shrink-0 p-1 rounded hover:bg-slate-200/50 ${isActive ? "hover:bg-white/20" : ""}`}
                      title="Options"
                    >
                      <img
                        src="/three-dots-vertical.svg"
                        alt=""
                        className="h-4 w-4"
                      />
                    </button>
                  </div>
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-lg border border-slate-200 bg-white shadow-lg py-1">
                      <button
                        type="button"
                        onClick={() => handleEditWorkspace(ws)}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <img
                          src="/edit.svg"
                          alt=""
                          className="h-4 w-4"
                        />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteWorkspaceId(ws.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <img
                          src="/trash.svg"
                          alt=""
                          className="h-4 w-4"
                        />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {workspaces.length === 0 && (
            <p className="text-xs text-slate-400">
              No workspaces yet. Create one to get started.
            </p>
          )}
        </div>

        <div className="mt-4">
          {showNewWorkspace ? (
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 space-y-2">
              <input
                type="text"
                placeholder="Workspace name"
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                value={newWorkspaceTitle}
                onChange={(e) => setNewWorkspaceTitle(e.target.value)}
              />
              <textarea
                placeholder="Short description (optional)"
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                rows={2}
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => {
                    setShowNewWorkspace(false);
                    setNewWorkspaceTitle("");
                    setNewWorkspaceDescription("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
                  onClick={submitWorkspace}
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setShowNewWorkspace(true)}
            >
              + New workspace
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 h-full overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {activeWorkspace?.title ?? "Question Sheet"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {activeWorkspace?.description ??
                  "Organise topics, track progress, and keep your practice list tidy."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeWorkspace && (
                <button
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors"
                  onClick={() => handleEditWorkspace(activeWorkspace)}
                  title="Edit workspace"
                >
                  <img
                    src="/edit.svg"
                    alt=""
                    className="h-4 w-4"
                  />
                </button>
              )}
              <button
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={addTopicSection}
                disabled={!activeWorkspace}
              >
                <span className="mr-2 text-base leading-none">+</span>
                New topic
              </button>
            </div>
          </header>

          {activeWorkspace ? (
            <main className="space-y-6">
              <section>
                <TopicList topics={orderedTopics} />
              </section>

              {newTopic && (
                <section ref={newT}>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
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
          ) : (
            <div className="mt-16 text-center text-sm text-slate-500">
              Create a workspace from the left panel to start adding topics.
            </div>
          )}
        </div>
      </div>

      {editingWorkspaceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit Workspace</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={editWorkspaceTitle}
                  onChange={(e) => setEditWorkspaceTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Enter workspace name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={editWorkspaceDescription}
                  onChange={(e) => setEditWorkspaceDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancelEditWorkspace}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveWorkspace}
                  disabled={editWorkspaceTitle.trim() === ""}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteWorkspaceId !== null}
        title="Delete this workspace?"
        description="This will permanently remove the workspace and all of its topics and questions. This action cannot be undone."
        confirmLabel="Delete workspace"
        onConfirm={confirmDeleteWorkspace}
        onCancel={() => setDeleteWorkspaceId(null)}
      />
    </div>
  );
}