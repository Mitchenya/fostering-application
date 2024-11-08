import { Supabase } from "../../supabaseClient";

export const fetchChildById = async (id: string) => {
  const { data, error } = await Supabase.from("foster-children")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching child with ID ${id}:`, error.message);
    return null;
  }

  return data;
};
