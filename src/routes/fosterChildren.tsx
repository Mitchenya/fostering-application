import { createSignal, onMount } from "solid-js";
import { fetchFosterChildren } from "~/supabase/fetchChildren";
import { Supabase } from "../../supabaseClient";
import ChildModal from "~/components/modals/ChildModal";

type Child = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  family_details?: string;
  medical_information?: string;
  education_details?: string;
  social_worker?: string;
  placement_status?: string;
  placement_history?: string;
  behavioural_needs?: string;
  photo_url?: string;
};

const FosterChildren = () => {
  const [fosterChildren, setFosterChildren] = createSignal<Child[]>([]);
  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
  const [currentChild, setCurrentChild] = createSignal<Child | null>(null);
  const [currentPage, setCurrentPage] = createSignal<number>(1);
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("asc");
  const itemsPerPage = 6;

  onMount(async () => {
    await loadChildren();
  });

  const loadChildren = async () => {
    const children = await fetchFosterChildren();
    setFosterChildren(children);
  };

  const fetchChildDetails = async (id: string) => {
    const { data, error } = await Supabase.from("foster-children")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(`Error fetching child details: ${error.message}`);
    } else {
      setCurrentChild(data);
      setIsModalOpen(true);
    }
  };

  const sortedChildren = () => {
    return fosterChildren()
      .slice()
      .sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return sortOrder() === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  };

  const handleAddChild = async (childData: Omit<Child, "id">) => {
    const { data, error } = await Supabase.from("foster-children")
      .insert([childData])
      .select();

    if (error) {
      alert(`Error adding child: ${error.message}`);
      return;
    }

    if (data) {
      setFosterChildren((prev) => [data[0], ...prev]);
      setIsModalOpen(false);
    }
  };

  const handleEditChild = async (childData: Child) => {
    const { error } = await Supabase.from("foster-children")
      .update(childData)
      .eq("id", childData.id);

    if (error) {
      alert(`Error updating child: ${error.message}`);
    } else {
      setFosterChildren((prev) =>
        prev.map((child) =>
          child.id === childData.id ? { ...child, ...childData } : child
        )
      );
      setIsModalOpen(false);
    }
  };

  const handleDeleteChild = async (id: string) => {
    const { error } = await Supabase.from("foster-children")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Error deleting child: ${error.message}`);
    } else {
      setFosterChildren((prev) => prev.filter((child) => child.id !== id));
    }
  };

  const totalPages = (): number =>
    Math.ceil(fosterChildren().length / itemsPerPage);

  const paginatedChildren = (): Child[] => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    return sortedChildren().slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div class="h-full flex flex-col overflow-hidden">
      <div class="flex-none bg-white p-4 mb-2 rounded-t-lg flex justify-between items-center border-b border-gray-200 shadow-sm">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Foster Children</h1>
          <p class="text-sm text-gray-500">
            Here's a list of all the foster children currently in the system.
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
            onClick={() => {
              setCurrentChild(null);
              setIsModalOpen(true);
            }}
            class="bg-blue-500 text-white rounded-full px-4 py-2 transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-md"
          >
            + Add Foster Child
          </button>
        </div>
      </div>

      <div class="flex-grow overflow-y-auto p-4 bg-white scrollbar-hide">
        <ul class="space-y-6">
          {paginatedChildren().map((child) => (
            <li
              key={child.id}
              class="bg-white border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center"
            >
              <div class="w-24 h-24 bg-gray-600 rounded-md mr-6 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {child.photo_url ? (
                  <img
                    src={child.photo_url}
                    alt={`${child.first_name} ${child.last_name}`}
                    class="object-cover w-full h-full"
                  />
                ) : (
                  <span class="text-gray-400">No Photo</span>
                )}
              </div>
              <div class="flex-grow">
                <h2 class="text-xl font-semibold text-gray-800 mb-2">
                  {child.first_name} {child.last_name}
                </h2>
                <p class="text-sm text-gray-500 mb-1">
                  DOB: {new Date(child.date_of_birth).toLocaleDateString()}
                </p>
              </div>
              <div class="ml-auto flex space-x-3">
                <button
                  onClick={() => fetchChildDetails(child.id)}
                  class="bg-blue-500 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteChild(child.id)}
                  class="bg-red-500 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-red-600 shadow-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
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

      {isModalOpen() && (
        <ChildModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={currentChild() ? handleEditChild : handleAddChild}
          child={currentChild()}
        />
      )}
    </div>
  );
};

export default FosterChildren;
