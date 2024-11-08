import { createSignal, onMount } from "solid-js";
import { fetchFosterFamilies } from "~/supabase/fetchFamilies";
import { Supabase } from "../../supabaseClient";
import FamilyModal from "~/components/modals/FamilyModal";

type Family = {
  id: string;
  p1_first_name: string;
  p1_last_name: string;
  p2_first_name?: string;
  p2_last_name?: string;
  date_of_birth: string;
  contact_number: string;
  photo_url?: string;
};

const FosterFamilies = () => {
  const [fosterFamilies, setFosterFamilies] = createSignal<Family[]>([]);
  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
  const [currentFamily, setCurrentFamily] = createSignal<Family | null>(null);
  const [currentPage, setCurrentPage] = createSignal<number>(1);
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("asc");
  const itemsPerPage = 6;

  onMount(async () => {
    await loadFamilies();
  });

  const loadFamilies = async () => {
    const families = await fetchFosterFamilies();
    setFosterFamilies(families);
  };

  const sortedFamilies = () => {
    return fosterFamilies()
      .slice()
      .sort((a, b) => {
        const nameA = `${a.p1_first_name} ${a.p1_last_name}`.toLowerCase();
        const nameB = `${b.p1_first_name} ${b.p1_last_name}`.toLowerCase();
        return sortOrder() === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  };

  const handleAddFamily = async (familyData: Family) => {
    const { error } = await Supabase.from("foster-families").insert([
      familyData,
    ]);

    if (error) {
      alert(`Error adding family: ${error.message}`);
    } else {
      setFosterFamilies((prev) => [...prev, familyData]);
      setIsModalOpen(false);
    }
  };

  const handleEditFamily = async (familyData: Family) => {
    const { error } = await Supabase.from("foster-families")
      .update(familyData)
      .eq("id", familyData.id);

    if (error) {
      alert(`Error updating family: ${error.message}`);
    } else {
      setFosterFamilies((prev) =>
        prev.map((family) =>
          family.id === familyData.id ? familyData : family
        )
      );
      setIsModalOpen(false);
    }
  };

  const handleDeleteFamily = async (id: string) => {
    const { error } = await Supabase.from("foster-families")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Error deleting family: ${error.message}`);
    } else {
      setFosterFamilies((prev) => prev.filter((family) => family.id !== id));
    }
  };

  const openEditModal = (family: Family) => {
    setCurrentFamily(family);
    setIsModalOpen(true);
  };

  const totalPages = (): number =>
    Math.ceil(fosterFamilies().length / itemsPerPage);

  const paginatedFamilies = (): Family[] => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    return sortedFamilies().slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div class="h-full flex flex-col overflow-hidden">
      <div class="flex-none bg-white p-4 mb-2 rounded-t-lg flex justify-between items-center border-b border-gray-200 shadow-sm">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Foster Families</h1>
          <p class="text-sm text-gray-500">
            Here's a list of all the foster families currently in the system.
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
              setCurrentFamily(null);
              setIsModalOpen(true);
            }}
            class="bg-blue-500 text-white rounded-full px-4 py-2 transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-md"
          >
            + Add Foster Family
          </button>
        </div>
      </div>

      <div class="flex-grow overflow-y-auto p-4 bg-white scrollbar-hide">
        <ul class="space-y-6">
          {paginatedFamilies().map((family) => (
            <li
              key={family.id}
              class="bg-white border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center"
            >
              <div class="w-24 h-24 bg-gray-600 rounded-md mr-6 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {family.photo_url ? (
                  <img
                    src={family.photo_url}
                    alt={`${family.p1_first_name} ${family.p1_last_name} and ${family.p2_first_name} ${family.p2_last_name}`}
                    class="object-cover w-full h-full"
                  />
                ) : (
                  <span class="text-gray-400">No Photo</span>
                )}
              </div>
              <div class="flex-grow">
                <h2 class="text-xl font-semibold text-gray-800 mb-2">
                  {family.p1_first_name} {family.p1_last_name}{" "}
                  {family.p2_first_name
                    ? `& ${family.p2_first_name} ${family.p2_last_name}`
                    : ""}
                </h2>
                <p class="text-sm text-gray-500 mb-1">
                  DOB: {new Date(family.date_of_birth).toLocaleDateString()}
                </p>
                <p class="text-sm text-gray-500">
                  Contact: {family.contact_number}
                </p>
              </div>
              <div class="ml-auto flex space-x-3">
                <button
                  onClick={() => openEditModal(family)}
                  class="bg-blue-500 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteFamily(family.id)}
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
        <FamilyModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={currentFamily() ? handleEditFamily : handleAddFamily}
          family={currentFamily()}
        />
      )}
    </div>
  );
};

export default FosterFamilies;
