import { createSignal, createEffect } from "solid-js";

const StaffModal = ({ onClose, onSubmit, staff }: any) => {
  const [firstName, setFirstName] = createSignal(staff?.first_name || "");
  const [lastName, setLastName] = createSignal(staff?.last_name || "");
  const [dateOfBirth, setDateOfBirth] = createSignal(
    staff?.date_of_birth || ""
  );
  const [contactNumber, setContactNumber] = createSignal(
    staff?.contact_number || ""
  );
  const [photo, setPhoto] = createSignal<File | null>(null);
  const [photoUrl, setPhotoUrl] = createSignal(staff?.photo_url || "");

  createEffect(() => {
    if (staff) {
      setFirstName(staff.first_name || "");
      setLastName(staff.last_name || "");
      setDateOfBirth(staff.date_of_birth || "");
      setContactNumber(staff.contact_number || "");
      setPhotoUrl(staff.photo_url || "");
    }
  });

  const handlePhotoClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: Event) => {
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
    const newStaff = {
      first_name: firstName(),
      last_name: lastName(),
      date_of_birth: dateOfBirth(),
      contact_number: contactNumber(),
      photo_url: photoUrl(),
    };

    await onSubmit(newStaff);
    onClose();
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <div class="flex flex-col items-center mb-4">
          <div
            class="w-24 mt-5 h-24 bg-gray-200 rounded-full overflow-hidden cursor-pointer flex items-center justify-center mb-2"
            onClick={handlePhotoClick}
          >
            {photoUrl() ? (
              <img
                src={photoUrl()}
                alt="Staff Photo"
                class="object-cover w-full h-full"
              />
            ) : (
              <span class="text-gray-500">Add Photo</span>
            )}
          </div>
        </div>
        <h2 class="text-lg font-bold mb-4">Add New Staff Member</h2>
        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label class="block mb-1 text-black">
              First Name:
              <input
                type="text"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={firstName()}
                onInput={(e) => setFirstName(e.currentTarget.value)}
                required
              />
            </label>
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-black">
              Last Name:
              <input
                type="text"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={lastName()}
                onInput={(e) => setLastName(e.currentTarget.value)}
                required
              />
            </label>
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-black">
              Date of Birth:
              <input
                type="date"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={dateOfBirth()}
                onInput={(e) => setDateOfBirth(e.currentTarget.value)}
                required
              />
            </label>
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-black">
              Contact Number:
              <input
                type="text"
                class="border border-gray-300 rounded px-2 py-1 w-full text-black"
                value={contactNumber()}
                onInput={(e) => setContactNumber(e.currentTarget.value)}
                required
              />
            </label>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 text-white rounded px-4 py-2 mr-2 hover:bg-blue-600"
            >
              Add Staff
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

export default StaffModal;
