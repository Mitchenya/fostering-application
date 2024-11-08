import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { Supabase } from "../../supabaseClient";

const IndexPage = () => {
  const navigate = useNavigate();

  onMount(async () => {
    const { data } = await Supabase.auth.getSession();

    if (!data?.session) {
      navigate("/login", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  });

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default IndexPage;
