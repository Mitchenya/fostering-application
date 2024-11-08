import { Supabase } from "../../supabaseClient";

export const fetchFosterChildren = async () => {
  const { data, error } = await Supabase.from("foster-children").select("*");
  if (error) {
    console.error("Error fetching foster children:", error);
    return [];
  }
  return data || [];
};
