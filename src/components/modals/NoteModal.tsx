import { createSignal, createEffect } from "solid-js";

const NoteModal = ({ onClose, onSubmit, note }: any) => {
  const [title, setTitle] = createSignal(note?.title || "");
  const [content, setContent] = createSignal(note?.content || "");

  createEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const newNote = {
      id: note?.id,
      title: title(),
      content: content(),
    };

    await onSubmit(newNote);
    onClose();
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold text-black mb-4">
          {note ? "Edit Note" : "Add New Note"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label class="block mb-1 text-black">
              Title:
              <input
                type="text"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
                required
              />
            </label>
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-black">
              Content:
              <textarea
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={content()}
                onInput={(e) => setContent(e.currentTarget.value)}
                required
              />
            </label>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 text-white rounded px-4 py-2 mr-2 hover:bg-blue-600"
            >
              {note ? "Update Note" : "Add Note"}
            </button>
            <button
              type="button"
              onClick={onClose}
              class="bg-gray-300 rounded px-4 py-2 hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
