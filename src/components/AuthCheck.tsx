import { Supabase } from "../../supabaseClient";
import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

export const isAuthenticated = async () => {
  const { data } = await Supabase.auth.getSession();
  return !!data?.session;
};

const AuthCheck = ({ children }: { children: any }) => {
  const navigate = useNavigate();

  onMount(async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      navigate("/auth/login", { replace: true });
    }
  });

  return children;
};

export default AuthCheck;
