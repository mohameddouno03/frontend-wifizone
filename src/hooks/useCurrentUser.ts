import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user.service";
import type { UserOutSchema, UserUpdate, UserPasswordUpdateMe } from "@/types/user";

export function useCurrentUser() {
  const [user, setUser] = useState<UserOutSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement du profil");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const updateProfile = useCallback(async (data: UserUpdate) => {
    try {
      setError(null);
      const updated = await userService.updateCurrentUser(data);
      setUser(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du profil");
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (data: UserPasswordUpdateMe) => {
    try {
      setError(null);
      await userService.resetMyPassword(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du changement de mot de passe");
      throw err;
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      setError(null);
      await userService.deleteMyAccount();
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du compte");
      throw err;
    }
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchCurrentUser,
    updateProfile,
    resetPassword,
    deleteAccount,
  };
}