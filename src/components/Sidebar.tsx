import { logOut } from "~/supabase/auth";
import { useNavigate } from "@solidjs/router";

interface SidebarProps {
  activeTab: () => string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navigate = useNavigate();

  const tabs = [
    { name: "Foster Children" },
    { name: "Foster Families" },
    { name: "Staff Management" },
    { name: "Notes" },
    { name: "Files" },
  ];

  return (
    <div class="w-64 h-full bg-white text-gray-700 flex flex-col justify-between shadow-lg">
      <ul class="space-y-4 px-4 py-6">
        {tabs.map((tab) => (
          <li key={tab.name}>
            <button
              class={`flex items-center w-full px-4 py-3 rounded-lg transition-transform duration-200 ${
                activeTab() === tab.name
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-700"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <span class="text-sm font-medium">{tab.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div class="px-4 pb-6">
        <button
          type="button"
          class="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg shadow-md transition-transform duration-200 hover:bg-red-600 hover:scale-105"
          onClick={() => logOut(navigate)}
        >
          <span class="mr-2"></span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
