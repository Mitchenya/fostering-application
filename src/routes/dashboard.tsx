import Sidebar from "~/components/Sidebar";
import { createSignal, createEffect } from "solid-js";
import FosterChildren from "./fosterChildren";
import FosterFamilies from "./fosterFamilies";
import Notes from "./notes";
import AuthCheck from "~/components/AuthCheck";
import Files from "./files";
import StaffMembers from "./staff";

export default function Dashboard() {
  const [activeTab, setActiveTab] = createSignal("Foster Children");

  createEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = sessionStorage.getItem("activeTab");
      if (storedTab) {
        setActiveTab(storedTab);
      } else {
        setActiveTab("Foster Children");
      }
    }
  });

  createEffect(() => {
    if (typeof window !== "undefined" && activeTab()) {
      sessionStorage.setItem("activeTab", activeTab()!);
    }
  });

  return (
    <AuthCheck>
      <div class="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div class="flex flex-col flex-1 p-4 space-x-4">
          <div class="flex-1 bg-white rounded-lg shadow overflow-hidden">
            {activeTab() === "Foster Children" && <FosterChildren />}
            {activeTab() === "Foster Families" && <FosterFamilies />}
            {activeTab() === "Staff Management" && <StaffMembers />}
            {activeTab() === "Notes" && <Notes />}
            {activeTab() === "Files" && <Files />}
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
