import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { Supabase } from "../../../supabaseClient";

const SignUp = () => {
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: Event) => {
    e.preventDefault();
    const { data, error } = await Supabase.auth.signUp({
      email: email(),
      password: password(),
      options: {
        emailRedirectTo: "http://localhost:3000/auth/login",
      },
    });

    if (error) {
      setErrorMessage("Invalid credentials. Please try again.");
      return;
    }

    if (data) {
      navigate("/auth/confirmEmail");
    } else {
      navigate("/");
    }
  };

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
        <form
          onSubmit={handleSignUp}
          class="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300"
        >
          <h3 class="text-3xl font-semibold text-center text-blue-700 mb-6">
            Sign Up
          </h3>

          {errorMessage() && (
            <p class="text-center mb-4 text-red-600 bg-red-100 p-3 rounded-lg">
              {errorMessage()}
            </p>
          )}

          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            onInput={(e) => setEmail(e.currentTarget.value)}
            class="w-full p-3 mb-4 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your email"
          />

          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            onInput={(e) => setPassword(e.currentTarget.value)}
            class="w-full p-3 mb-6 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
          >
            Sign Up
          </button>

          <span class="block text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <A href="/auth/login" class="text-blue-600 hover:underline">
              Login
            </A>
          </span>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
