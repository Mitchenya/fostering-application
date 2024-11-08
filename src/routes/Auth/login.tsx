import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { Supabase } from "../../../supabaseClient";

const Login = () => {
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [errorMessage, setErrorMessage] = createSignal<string>("");
  const navigate = useNavigate();

  const loginUser = async (e: Event) => {
    e.preventDefault();
    const { data, error } = await Supabase.auth.signInWithPassword({
      email: email(),
      password: password(),
    });

    if (error) {
      setErrorMessage("Invalid credentials, please try again.");
      return;
    }
    if (data) {
      navigate("/dashboard");
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
          onSubmit={loginUser}
          class="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300"
        >
          <h3 class="text-3xl font-semibold text-center text-blue-700 mb-6">
            Login
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
            class="w-full p-3 mb-4 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter your email"
          />

          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            onInput={(e) => setPassword(e.currentTarget.value)}
            class="w-full p-3 mb-6 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
          >
            Login
          </button>

          <span class="block text-center mt-6 text-sm text-gray-500">
            Don't have an account?{" "}
            <A href="/auth/signUp" class="text-blue-600 hover:underline">
              Sign Up
            </A>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
