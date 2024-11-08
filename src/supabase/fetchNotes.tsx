import { Supabase } from "../../supabaseClient";

export const fetchNotes = async () => {
  const { data, error } = await Supabase.from("notes").select("*");
  console.log(data);

  if (error) {
    console.error("unable to fetch notes", error);
    return [];
  }

  return data;
};
