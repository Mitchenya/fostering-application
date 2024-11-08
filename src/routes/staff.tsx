import { createSignal, onMount } from "solid-js";
import { fetchStaffMembers } from "~/supabase/fetchStaffMembers";
import { Supabase } from "../../supabaseClient";
import StaffModal from "~/components/modals/StaffModal";

type Staff = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  position: string;
  contact_number: string;
  photo_url?: string;
};

const StaffMembers = () => {
  const [staffMembers, setStaffMembers] = createSignal<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
  const [currentStaff, setCurrentStaff] = createSignal<Staff | null>(null);
  const [currentPage, setCurrentPage] = createSignal<number>(1);
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("asc");
  const itemsPerPage = 6;

  onMount(async () => {
    await loadStaff();
  });

  const loadStaff = async () => {
    const staff = await fetchStaffMembers();
    setStaffMembers(staff);
  };

  const sortedStaff = () => {
    return staffMembers()
      .slice()
      .sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return sortOrder() === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  };

  const handleAddStaff = async (staffData: Staff) => {
    const { error } = await Supabase.from("staff-members").insert([staffData]);
    if (error) {
      alert(`Error adding staff member: ${error.message}`);
    } else {
      setStaffMembers((prev) => [...prev, staffData]);
      setIsModalOpen(false);
    }
  };

  const handleEditStaff = async (staffData: Staff) => {
    const { error } = await Supabase.from("staff-members")
      .update(staffData)
      .eq("id", staffData.id);
    if (error) {
      alert(`Error updating staff member: ${error.message}`);
    } else {
      setStaffMembers((prev) =>
        prev.map((staff) => (staff.id === staffData.id ? staffData : staff))
      );
      setIsModalOpen(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    const { error } = await Supabase.from("staff-members")
      .delete()
      .eq("id", id);
    if (error) {
      alert(`Error deleting staff member: ${error.message}`);
    } else {
      setStaffMembers((prev) => prev.filter((staff) => staff.id !== id));
    }
  };

  const openEditModal = (staff: Staff) => {
    setCurrentStaff(staff);
    setIsModalOpen(true);
  };

  const totalPages = (): number =>
    Math.ceil(staffMembers().length / itemsPerPage);

  const paginatedStaff = (): Staff[] => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    return sortedStaff().slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div class="h-full flex flex-col overflow-hidden">
      <div class="flex-none bg-white p-4 mb-2 rounded-t-lg flex justify-between items-center border-b border-gray-200 shadow-sm">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Staff Management</h1>
          <p class="text-sm text-gray-500">
            Here's a list of all the staff members currently in the system.
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
              setCurrentStaff(null);
              setIsModalOpen(true);
            }}
            class="bg-blue-500 text-white rounded-full px-4 py-2 transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-md"
          >
            + Add Staff Member
          </button>
        </div>
      </div>

      <div class="flex-grow overflow-y-auto p-4 bg-white scrollbar-hide">
        <ul class="space-y-6">
          {paginatedStaff().map((staff) => (
            <li
              key={staff.id}
              class="bg-white border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center"
            >
              <div class="w-24 h-24 bg-gray-600 rounded-md mr-6 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {staff.photo_url ? (
                  <img
                    src={staff.photo_url}
                    alt={`${staff.first_name} ${staff.last_name}`}
                    class="object-cover w-full h-full"
                  />
                ) : (
                  <span class="text-gray-400">No Photo</span>
                )}
              </div>
              <div class="flex-grow">
                <h2 class="text-xl font-semibold text-gray-800 mb-2">
                  {staff.first_name} {staff.last_name}
                </h2>
                <p class="text-sm text-gray-500 mb-1">
                  DOB: {new Date(staff.date_of_birth).toLocaleDateString()}
                </p>
                <p class="text-sm text-gray-500 mb-1">
                  Position: {staff.position}
                </p>
                <p class="text-sm text-gray-500">
                  Contact: {staff.contact_number}
                </p>
              </div>
              <div class="ml-auto flex space-x-3">
                <button
                  onClick={() => openEditModal(staff)}
                  class="bg-blue-500 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStaff(staff.id)}
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
        <StaffModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={currentStaff() ? handleEditStaff : handleAddStaff}
          staff={currentStaff()}
        />
      )}
    </div>
  );
};

export default StaffMembers;
