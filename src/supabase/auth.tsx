import { createSignal, createEffect } from "solid-js";
import { Supabase } from "../../supabaseClient";
import { User } from "@supabase/supabase-js";

// User state
const [user, setUser] = createSignal<User | null>(null);

// Function to get the logged-in user
export const getLoggedUser = async (navigate?: any) => {
  const {
    data: { user: loggedInUser },
    error,
  } = await Supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return;
  }

  setUser(loggedInUser);

  if (!loggedInUser && navigate) {
    navigate("/auth/login", { replace: true });
  }
};

// Function to log out the user
export const logOut = async (navigate: any) => {
  const { error } = await Supabase.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }

  setUser(null);
  if (navigate) {
    navigate("/auth/login", { replace: true });
  }
};

// Initialize auth check on mount
createEffect(() => {
  getLoggedUser();
});

// Export the user signal to be used in components
export { user };
