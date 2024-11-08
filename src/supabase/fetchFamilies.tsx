import { Supabase } from "../../supabaseClient";

export const fetchFosterFamilies = async () => {
  const { data, error } = await Supabase.from("foster-families").select("*");
  console.log(data);

  if (error) {
    console.error("unable to fetch foster families", error);
    return [];
  }

  return data;
};
