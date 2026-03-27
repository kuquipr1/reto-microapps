import { createClient } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

export const userService = {
  async getProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw new Error(`Error al obtener perfil: ${error.message}`);
    }
    return data as UserProfile;
  },

  async updateProfile(profile: Partial<Pick<UserProfile, "first_name" | "last_name">>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .update(profile)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      throw new Error(`Error al actualizar perfil: ${error.message}`);
    }
    return data as UserProfile;
  },
};
