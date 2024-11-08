import { Supabase } from "../../supabaseClient";

export const fetchStaffMembers = async () => {
  const { data, error } = await Supabase.from("staff-members").select("*");
  console.log(data);

  if (error) {
    console.error("unable to staff members", error);
    return [];
  }

  return data;
};
