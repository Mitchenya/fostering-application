import { Supabase } from "../../supabaseClient";

export const fetchFiles = async () => {
  const { data, error } = await Supabase.from("files").select("*");
  console.log(data);

  if (error) {
    console.error("unable to fetch files", error);
    return [];
  }

  return data;
};
