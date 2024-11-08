import { createSignal } from "solid-js";

const FamilyModal = ({ onClose, onSubmit }: any) => {
  const [p1FirstName, setP1FirstName] = createSignal("");
  const [p1LastName, setP1LastName] = createSignal("");
  const [p2FirstName, setP2FirstName] = createSignal("");
  const [p2LastName, setP2LastName] = createSignal("");
  const [dateOfBirth, setDateOfBirth] = createSignal("");
  const [contactNumber, setContactNumber] = createSignal("");
  const [photo, setPhoto] = createSignal<File | null>(null);
  const [photoUrl, setPhotoUrl] = createSignal("");

  const handlePhotoClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setPhoto(file);
        setPhotoUrl(URL.createObjectURL(file));
      }
    };
    input.click();
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const newFamily = {
      p1_first_name: p1FirstName(),
      p1_last_name: p1LastName(),
      p2_first_name: p2FirstName(),
      p2_last_name: p2LastName(),
      date_of_birth: dateOfBirth(),
      contact_number: contactNumber(),
      photo_url: photoUrl(),
    };

    await onSubmit(newFamily);
    onClose();
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4 text-black">Add New Family</h2>
        <div class="flex justify-center mb-4">
          <div
            class="w-24 h-24 bg-gray-200 rounded-full overflow-hidden cursor-pointer flex items-center justify-center"
            onClick={handlePhotoClick}
          >
            {photoUrl() ? (
              <img
                src={photoUrl()}
                alt="Family Photo"
                class="object-cover w-full h-full"
              />
            ) : (
              <span class="text-gray-500">Add Photo</span>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block mb-1 text-black">Parent First Name:</label>
              <input
                type="text"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={p1FirstName()}
                onInput={(e) => setP1FirstName(e.currentTarget.value)}
                required
              />
            </div>
            <div>
              <label class="block mb-1 text-black">Parent Last Name:</label>
              <input
                type="text"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={p1LastName()}
                onInput={(e) => setP1LastName(e.currentTarget.value)}
                required
              />
            </div>
            <div>
              <label class="block mb-1 text-black">Parent First Name:</label>
              <input
                type="text"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={p2FirstName()}
                onInput={(e) => setP2FirstName(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="block mb-1 text-black">Parent Last Name:</label>
              <input
                type="text"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={p2LastName()}
                onInput={(e) => setP2LastName(e.currentTarget.value)}
              />
            </div>
          </div>
          <div>
            <label class="block mb-1 text-black">Date of Birth:</label>
            <input
              type="date"
              class="border border-gray-300 rounded px-2 py-1 w-full text-black"
              value={dateOfBirth()}
              onInput={(e) => setDateOfBirth(e.currentTarget.value)}
              required
            />
          </div>
          <div>
            <label class="block mb-1 text-black">Contact Number:</label>
            <input
              type="text"
              class="border border-gray-300 rounded px-2 py-1 w-full text-black"
              value={contactNumber()}
              onInput={(e) => setContactNumber(e.currentTarget.value)}
              required
            />
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 text-white rounded px-4 py-2 mr-2 hover:bg-blue-600"
            >
              Add Family
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

export default FamilyModal;
