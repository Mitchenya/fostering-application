import { Show } from "solid-js";

export default function MainContent({ activeTab }: { activeTab: string }) {
  return (
    <div class="flex-1 bg-white p-6 rounded-lg shadow">
      <Show when={activeTab === "Foster Children"}>
        <h2 class="text-2xl font-bold mb-4">Foster Children</h2>
      </Show>

      <Show when={activeTab === "Foster Families"}>
        <h2 class="text-2xl font-bold mb-4">Foster Families</h2>
      </Show>

      <Show when={activeTab === "Staff"}>
        <h2 class="text-2xl font-bold mb-4">Staff Management</h2>
      </Show>

      <Show when={activeTab === "Notes"}>
        <h2 class="text-2xl font-bold mb-4">Notes</h2>
      </Show>

      <Show when={activeTab === "Files"}>
        <h2 class="text-2xl font-bold mb-4">Files</h2>
      </Show>
    </div>
  );
}
