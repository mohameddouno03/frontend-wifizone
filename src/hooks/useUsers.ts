import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user.service";
import type { UserOutSchema, UserCreate, UserUpdate } from "@/types/user";

export function useUsers(initialLimit: number = 100, initialOffset: number = 0) {
  const [users, setUsers] = useState<UserOutSchema[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(initialOffset);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.listUsers(limit, offset);
      setUsers(response.items);
      setTotal(response.count);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getUser = useCallback(async (slug: string) => {
    try {
      setError(null);
      return await userService.getUser(slug);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement de l'utilisateur");
      throw err;
    }
  }, []);

  const createUser = useCallback(async (data: UserCreate) => {
    try {
      setError(null);
      const newUser = await userService.createUser(data);
      await fetchUsers();
      return newUser;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'utilisateur");
      throw err;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (slug: string, data: UserUpdate) => {
    try {
      setError(null);
      const updated = await userService.updateUser(slug, data);
      await fetchUsers();
      return updated;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour de l'utilisateur");
      throw err;
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (slug: string) => {
    try {
      setError(null);
      await userService.deleteUser(slug);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression de l'utilisateur");
      throw err;
    }
  }, [fetchUsers]);

  const resetUserPassword = useCallback(async (email: string, newPassword: string) => {
    try {
      setError(null);
      await userService.resetUserPassword({ email, new_password: newPassword });
    } catch (err: any) {
      setError(err.message || "Erreur lors de la réinitialisation du mot de passe");
      throw err;
    }
  }, []);

  const nextPage = useCallback(() => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  }, [offset, limit, total]);

  const prevPage = useCallback(() => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  }, [offset, limit]);

  const goToPage = useCallback((page: number) => {
    const newOffset = (page - 1) * limit;
    if (newOffset >= 0 && newOffset < total) {
      setOffset(newOffset);
    }
  }, [limit, total]);

  return {
    users,
    total,
    loading,
    error,
    limit,
    offset,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(total / limit),
    refetch: fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    nextPage,
    prevPage,
    goToPage,
    setLimit,
  };
}