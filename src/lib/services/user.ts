import { createClient, isMockMode } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string | null;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
  plans?: {
    name_en: string;
    name_es: string;
  };
}

export const userService = {
  async getProfile() {
    if (isMockMode()) {
      return {
        id: "mock-user",
        email: "demo@user.com",
        first_name: "Usuario",
        last_name: "Demo",
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .select("*, plans(name_en, name_es)")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw new Error(`Error al obtener perfil: ${error.message}`);
    }
    return data as any;
  },

  async updateProfile(profile: Partial<Pick<UserProfile, "first_name" | "last_name" | "avatar_url">>) {
    if (isMockMode()) {
      return {
        id: "mock-user",
        email: "demo@user.com",
        first_name: profile.first_name || "Usuario",
        last_name: profile.last_name || "Demo",
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");

    // Sync Auth metadata if names are updated
    if (profile.first_name !== undefined || profile.last_name !== undefined) {
      await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name !== undefined ? profile.first_name : user.user_metadata?.first_name,
          last_name: profile.last_name !== undefined ? profile.last_name : user.user_metadata?.last_name,
        }
      });
    }

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
