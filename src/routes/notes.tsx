import { createSignal, onMount, For } from "solid-js";
import { format } from "date-fns";
import { Supabase } from "../../supabaseClient";
import NoteModal from "~/components/modals/NoteModal";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const NotesPage = () => {
  const [notes, setNotes] = createSignal<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = createSignal<string>("");
  const [newNoteContent, setNewNoteContent] = createSignal<string>("");
  const [currentPage, setCurrentPage] = createSignal<number>(1);
  const itemsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
  const [currentNote, setCurrentNote] = createSignal<Note | null>(null);

  onMount(async () => {
    await loadNotes();
  });

  const loadNotes = async () => {
    const { data, error } = await Supabase.from("notes").select("*");
    if (!error) setNotes(data || []);
  };

  const paginatedNotes = (): Note[] => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    return notes().slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (): number => Math.ceil(notes().length / itemsPerPage);

  const addNote = async () => {
    if (newNoteTitle().trim() === "" || newNoteContent().trim() === "") return;
    const { data, error } = await Supabase.from("notes")
      .insert([{ title: newNoteTitle(), content: newNoteContent() }])
      .select("*");
    if (!error && data) {
      setNotes([data[0], ...notes()]);
      setNewNoteTitle("");
      setNewNoteContent("");
    }
  };

  const openEditModal = (note: Note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await Supabase.from("notes").delete().eq("id", id);
    if (!error) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    }
  };

  return (
    <div class="h-full flex flex-col overflow-hidden">
      <div class="flex-none bg-white p-4 mb-2 rounded-t-lg border-b border-gray-200 shadow-sm">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Notes</h1>
          <p class="text-sm text-gray-500">
            Here's a list of all the notes currently in the system.
          </p>
        </div>
      </div>

      <div class="flex-none bg-white p-4 mb-4 rounded-lg border-b border-gray-200">
        <input
          type="text"
          class="w-full text-black mb-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Note title..."
          value={newNoteTitle()}
          onInput={(e) => setNewNoteTitle(e.currentTarget.value)}
        />
        <textarea
          class="w-full text-black p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new note..."
          value={newNoteContent()}
          onInput={(e) => setNewNoteContent(e.currentTarget.value)}
        />
        <button
          class="bg-blue-500 text-white px-5 py-2 rounded-md shadow-sm transition-transform transform hover:scale-105 hover:bg-blue-600"
          onClick={addNote}
        >
          Add Note
        </button>
      </div>

      <div class="flex-grow overflow-y-auto p-4 bg-white rounded-lg scrollbar-hide">
        <ul class="space-y-6">
          <For each={paginatedNotes()}>
            {(note) => (
              <li
                key={note.id}
                class="bg-white border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div class="flex flex-col">
                  <h2 class="text-xl font-semibold text-gray-800 mb-2">
                    {note.title}
                  </h2>
                  <p class="text-sm text-gray-500 mb-4">
                    {note.created_at
                      ? format(new Date(note.created_at), "PPpp")
                      : "Unknown"}
                  </p>
                  <p class="text-gray-700">{note.content}</p>
                  <div class="flex mt-4 space-x-3">
                    <button
                      onClick={() => openEditModal(note)}
                      class="bg-blue-500 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      class="bg-red-500 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-red-600 shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            )}
          </For>
        </ul>
      </div>

      <div class="flex-none p-4 mt-2 border-t border-gray-200 bg-white rounded-b-lg">
        <div class="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage() === 1}
          >
            Previous
          </button>
          <span class="text-gray-700 text-lg">
            Page {currentPage()} of {totalPages()}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages()))
            }
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage() === totalPages()}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen() && currentNote() && (
        <NoteModal
          note={currentNote()}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (updatedNote) => {
            const { error } = await Supabase.from("notes")
              .update(updatedNote)
              .eq("id", currentNote()?.id);
            if (!error) {
              setNotes((prevNotes) =>
                prevNotes.map((note) =>
                  note.id === updatedNote.id ? updatedNote : note
                )
              );
              setIsModalOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default NotesPage;
