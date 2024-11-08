const PleaseConfirmEmail = () => {
  return (
    <div class="flex min-h-screen h-screen w-full">
      <div class="hidden lg:flex w-1/2 h-full">
        <img
          src="/images/FosterFamily.jpg"
          alt="Foster Family"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="w-full lg:w-1/2 flex items-center justify-center h-full bg-white p-8">
        <div class="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300 text-center">
          <h3 class="text-3xl font-semibold text-blue-700 mb-6">
            Confirm Your Email
          </h3>
          <p class="text-gray-600 leading-relaxed">
            A confirmation email has been sent to your email address. Please
            check your inbox and follow the instructions to verify your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PleaseConfirmEmail;
