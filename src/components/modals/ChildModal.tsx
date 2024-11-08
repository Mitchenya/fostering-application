import { createSignal, createEffect } from "solid-js";

const ChildModal = ({ onClose, onSubmit, child }: any) => {
  const [activeTab, setActiveTab] = createSignal("Basic Information");
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [dateOfBirth, setDateOfBirth] = createSignal("");
  const [gender, setGender] = createSignal("");
  const [familyDetails, setFamilyDetails] = createSignal("");
  const [medicalInformation, setMedicalInformation] = createSignal("");
  const [educationDetails, setEducationDetails] = createSignal("");
  const [socialWorker, setSocialWorker] = createSignal("");
  const [placementStatus, setPlacementStatus] = createSignal("");
  const [placementHistory, setPlacementHistory] = createSignal("");
  const [behaviouralNeeds, setBehaviouralNeeds] = createSignal("");
  const [photo, setPhoto] = createSignal<File | null>(null);
  const [photoUrl, setPhotoUrl] = createSignal("");

  createEffect(() => {
    if (child) {
      setFirstName(child.first_name || "");
      setLastName(child.last_name || "");
      setDateOfBirth(child.date_of_birth || "");
      setGender(child.gender || "");
      setFamilyDetails(child.family_details || "");
      setMedicalInformation(child.medical_information || "");
      setEducationDetails(child.education_details || "");
      setSocialWorker(child.social_worker || "");
      setPlacementStatus(child.placement_status || "");
      setPlacementHistory(child.placement_history || "");
      setBehaviouralNeeds(child.behavioural_needs || "");
      setPhotoUrl(child.photo_url || "");
    }
  });

  const handlePhotoClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setPhoto(file);
        setPhotoUrl(URL.createObjectURL(file)); // Preview the photo
      }
    };
    input.click();
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const newChild = {
      id: child?.id || "", // Use id instead of child_id
      first_name: firstName(),
      last_name: lastName(),
      date_of_birth: dateOfBirth(),
      gender: gender(),
      family_details: familyDetails(),
      medical_information: medicalInformation(),
      education_details: educationDetails(),
      social_worker: socialWorker(),
      placement_status: placementStatus(),
      placement_history: placementHistory(),
      behavioural_needs: behaviouralNeeds(),
      photo_url: photoUrl(),
    };

    await onSubmit(newChild);
    onClose();
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-gray-800">
            {child ? "Edit Child" : "Add New Child"}
          </h2>
          <button onClick={onClose} class="text-gray-600 text-xl">
            &times;
          </button>
        </div>
        <div class="border-b mb-4 flex">
          {[
            "Basic Information",
            "Family/Support",
            "Medical",
            "Education/Placement",
          ].map((tab) => (
            <button
              class={`px-4 py-2 text-sm font-medium ${
                activeTab() === tab
                  ? "border-b-2 border-blue-500 text-blue-700"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} class="space-y-4">
          {activeTab() === "Basic Information" && (
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2 flex justify-center mb-4">
                <div
                  class="w-24 h-24 bg-gray-200 rounded-full overflow-hidden cursor-pointer flex items-center justify-center"
                  onClick={handlePhotoClick}
                >
                  {photoUrl() ? (
                    <img
                      src={photoUrl()}
                      alt="Child Photo"
                      class="object-cover w-full h-full"
                    />
                  ) : (
                    <span class="text-gray-500">Add Photo</span>
                  )}
                </div>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  class="w-full p-2 border rounded-lg text-black"
                  value={firstName()}
                  onInput={(e) => setFirstName(e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  class="w-full p-2 border rounded-lg text-black"
                  value={lastName()}
                  onInput={(e) => setLastName(e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  class="w-full p-2 border rounded-lg text-black"
                  value={dateOfBirth()}
                  onInput={(e) => setDateOfBirth(e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  class="w-full p-2 border rounded-lg text-black"
                  value={gender()}
                  onInput={(e) => setGender(e.currentTarget.value)}
                />
              </div>
            </div>
          )}
          {activeTab() === "Family/Support" && (
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Family Details
                </label>
                <textarea
                  class="w-full p-2 border rounded-lg text-black"
                  value={familyDetails()}
                  onInput={(e) => setFamilyDetails(e.currentTarget.value)}
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Social Worker
                </label>
                <input
                  type="text"
                  class="w-full p-2 border rounded-lg text-black"
                  value={socialWorker()}
                  onInput={(e) => setSocialWorker(e.currentTarget.value)}
                />
              </div>
            </div>
          )}
          {activeTab() === "Medical" && (
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Medical Information
                </label>
                <textarea
                  class="w-full p-2 border rounded-lg text-black"
                  value={medicalInformation()}
                  onInput={(e) => setMedicalInformation(e.currentTarget.value)}
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Behavioural Needs
                </label>
                <textarea
                  class="w-full p-2 border rounded-lg text-black"
                  value={behaviouralNeeds()}
                  onInput={(e) => setBehaviouralNeeds(e.currentTarget.value)}
                />
              </div>
            </div>
          )}
          {activeTab() === "Education/Placement" && (
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Education Details
                </label>
                <textarea
                  class="w-full p-2 border rounded-lg text-black"
                  value={educationDetails()}
                  onInput={(e) => setEducationDetails(e.currentTarget.value)}
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Placement Status
                </label>
                <input
                  type="text"
                  class="w-full p-2 border rounded-lg text-black"
                  value={placementStatus()}
                  onInput={(e) => setPlacementStatus(e.currentTarget.value)}
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Placement History
                </label>
                <textarea
                  class="w-full p-2 border rounded-lg text-black"
                  value={placementHistory()}
                  onInput={(e) => setPlacementHistory(e.currentTarget.value)}
                />
              </div>
            </div>
          )}
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Close
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {child ? "Update Child" : "Add Child"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChildModal;
