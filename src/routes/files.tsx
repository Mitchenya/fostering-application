import { createSignal, onMount, For } from "solid-js";
import { Supabase } from "../../supabaseClient";

interface FileItem {
  name: string;
  type: string;
  created_at: string;
}

const Files = () => {
  const [files, setFiles] = createSignal<FileItem[]>([]);
  const [fileName, setFileName] = createSignal<string>("");
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
  const [isUploading, setIsUploading] = createSignal<boolean>(false);
  const [currentPage, setCurrentPage] = createSignal<number>(1);
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  onMount(async () => {
    await fetchFiles();
  });

  const fetchFiles = async () => {
    const { data, error } = await Supabase.storage.from("files").list("public");
    if (error) {
      alert(`Error fetching files: ${error.message}`);
    } else {
      const fileList = data.map((file) => ({
        name: file.name,
        type: file.metadata
          ? file.metadata.mimetype
          : "application/octet-stream",
        created_at: file.created_at || "",
      }));
      setFiles(fileList);
    }
  };

  const sortedFiles = () => {
    return files()
      .slice()
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder() === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  };

  const handleFileSelection = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile() || fileName().trim() === "") {
      alert("Please provide a valid file and name.");
      return;
    }

    setIsUploading(true);
    const { error } = await Supabase.storage
      .from("files")
      .upload(`public/${fileName()}`, selectedFile()!, {
        contentType: selectedFile()!.type,
      });

    if (error) {
      alert(`Upload failed: ${error.message}`);
      setIsUploading(false);
      return;
    }

    await fetchFiles();
    setFileName("");
    setSelectedFile(null);
    setIsModalOpen(false);
    setIsUploading(false);
  };

  const handleDelete = async (name: string) => {
    const { error } = await Supabase.storage
      .from("files")
      .remove([`public/${name}`]);
    if (error) {
      alert(`Delete failed: ${error.message}`);
    } else {
      setFiles(files().filter((file) => file.name !== name));
    }
  };

  const handleView = async (name: string) => {
    const { data, error } = await Supabase.storage
      .from("files")
      .getPublicUrl(`public/${name}`);
    if (error) {
      alert(`Error retrieving file URL: ${error.message}`);
    } else if (data?.publicUrl) {
      window.open(data.publicUrl, "_blank");
    } else {
      alert("Public URL not available for this file.");
    }
  };

  const paginatedFiles = () => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    return sortedFiles().slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = () => Math.ceil(files().length / itemsPerPage);

  return (
    <div class="h-[90vh] flex flex-col overflow-hidden">
      <div class="flex-none bg-white p-4 mb-2 rounded-t-lg flex justify-between items-center border-b border-gray-200 shadow-sm">
        <div>
          <h2 class="text-2xl font-semibold text-gray-800">File Management</h2>
          <p class="text-sm text-gray-500">
            Manage your files efficiently with the options below.
          </p>
        </div>
        <div class="flex space-x-4 items-center">
          <select
            value={sortOrder()}
            onInput={(e) =>
              setSortOrder(e.currentTarget.value as "asc" | "desc")
            }
            class="px-3 py-2 border rounded-lg text-gray-700"
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
          <button
            onClick={() => document.getElementById("fileInput")?.click()}
            class="bg-blue-500 text-white rounded-full px-4 py-2 transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-md"
            disabled={isUploading()}
          >
            + Upload File
          </button>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileSelection}
            class="hidden text-black"
            disabled={isUploading()}
          />
        </div>
      </div>

      <div class="flex-grow overflow-y-auto p-4 bg-white rounded-lg">
        <table class="w-full text-left table-fixed border-collapse">
          <thead>
            <tr class="text-gray-600 text-sm border-b border-gray-200">
              <th class="p-3 w-2/5">File Name</th>
              <th class="p-3 w-1/5">Type</th>
              <th class="p-3 w-1/5">Date Added</th>
              <th class="p-3 w-1/5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginatedFiles()}>
              {(file) => (
                <tr
                  key={file.name}
                  class="bg-white shadow rounded-lg mb-2 hover:bg-gray-50 transition-all"
                >
                  <td class="p-3 text-gray-800 font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {file.name}
                  </td>
                  <td class="p-3 text-gray-800 font-medium whitespace-nowrap">
                    {file.type}
                  </td>
                  <td class="p-3 text-gray-600 whitespace-nowrap">
                    {file.created_at
                      ? new Date(file.created_at).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td class="p-3 text-center whitespace-nowrap">
                    <div class="flex justify-center space-x-2">
                      <button
                        onClick={() => handleView(file.name)}
                        class="bg-blue-500 text-white px-3 py-1 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(file.name)}
                        class="bg-red-500 text-white px-3 py-1 rounded-md transition-transform transform hover:scale-105 hover:bg-red-600 shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
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

      {isModalOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-2xl text-black font-semibold mb-4">
              Name Your File
            </h2>
            <input
              type="text"
              value={fileName()}
              onInput={(e) => setFileName(e.currentTarget.value)}
              placeholder="Enter file name"
              class="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg"
            />
            <div class="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                disabled={isUploading() || fileName().trim() === ""}
              >
                {isUploading() ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
