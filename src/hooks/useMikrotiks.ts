import { useState, useEffect, useCallback } from "react";
import { mikrotikService } from "@/services/mikrotik.service";
import type {
  MicrotikOutListSchema,
  MicrotikOutRetrieveSchema,
  MicrotikInSchema,
  MicrotikUpdateSchema,
  MicrotikCheckSchema,
  MicrotikCheckResponseSchema,
  ProfilOutSchema,
  ProfilInSchema,
  ProfilUpdateSchema,
} from "@/types/mikrotik";
import { toast } from "sonner";

export function useMikrotiks(initialLimit = 100, initialOffset = 0) {
  const [mikrotiks, setMikrotiks] = useState<MicrotikOutListSchema[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(initialOffset);

  const fetchMikrotiks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mikrotikService.list(limit, offset);
      setMikrotiks(response.items);
      setTotal(response.count);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des Mikrotiks");
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchMikrotiks();
  }, [fetchMikrotiks]);

  const refetch = useCallback(() => {
    return fetchMikrotiks();
  }, [fetchMikrotiks]);

  const getMikrotik = useCallback(async (slug: string): Promise<MicrotikOutRetrieveSchema> => {
    try {
      setError(null);
      return await mikrotikService.retrieve(slug);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement du Mikrotik");
      throw err;
    }
  }, []);

  const createMikrotik = useCallback(async (data: MicrotikInSchema) => {
    try {
      setError(null);
      const newMikrotik = await mikrotikService.create(data);
      toast.success("Mikrotik créé avec succès");
      await fetchMikrotiks();
      return newMikrotik;
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
      throw err;
    }
  }, [fetchMikrotiks]);

  const updateMikrotik = useCallback(async (slug: string, data: MicrotikUpdateSchema) => {
    try {
      setError(null);
      const updated = await mikrotikService.update(slug, data);
      toast.success("Mikrotik mis à jour");
      await fetchMikrotiks();
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
      throw err;
    }
  }, [fetchMikrotiks]);

  const deleteMikrotik = useCallback(async (slug: string) => {
    try {
      setError(null);
      await mikrotikService.delete(slug);
      toast.success("Mikrotik supprimé");
      await fetchMikrotiks();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
      throw err;
    }
  }, [fetchMikrotiks]);

  const toggleOnline = useCallback(async (slug: string, currentStatus: boolean) => {
    return updateMikrotik(slug, { is_online: !currentStatus });
  }, [updateMikrotik]);

  const checkConnection = useCallback(async (data: MicrotikCheckSchema): Promise<MicrotikCheckResponseSchema> => {
    try {
      setError(null);
      return await mikrotikService.checkConnection(data);
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
      throw err;
    }
  }, []);

  // Profils
  const getProfiles = useCallback(async (mikrotikSlug: string): Promise<ProfilOutSchema[]> => {
    try {
      setError(null);
      return await mikrotikService.listProfiles(mikrotikSlug);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du chargement des profils");
      throw err;
    }
  }, []);

  const createProfile = useCallback(async (mikrotikSlug: string, data: ProfilInSchema) => {
    try {
      setError(null);
      const result = await mikrotikService.createProfile(mikrotikSlug, data);
      toast.success("Profil créé avec succès");
      return result;
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création du profil");
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (mikrotikSlug: string, profilSlug: string, data: ProfilUpdateSchema) => {
    try {
      setError(null);
      const result = await mikrotikService.updateProfile(mikrotikSlug, profilSlug, data);
      toast.success("Profil mis à jour");
      return result;
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour du profil");
      throw err;
    }
  }, []);

  const deleteProfile = useCallback(async (mikrotikSlug: string, profilSlug: string) => {
    try {
      setError(null);
      const result = await mikrotikService.deleteProfile(mikrotikSlug, profilSlug);
      toast.success("Profil supprimé");
      return result;
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression du profil");
      throw err;
    }
  }, []);

  const subscribe = useCallback(async (mikrotikSlug: string, categorySlug: string) => {
    try {
      setError(null);
      const result = await mikrotikService.subscribe(mikrotikSlug, categorySlug);
      toast.success("Abonnement souscrit avec succès");
      return result;
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'abonnement");
      throw err;
    }
  }, []);

  // Pagination
  const nextPage = useCallback(() => {
    if (offset + limit < total) setOffset(offset + limit);
  }, [offset, limit, total]);

  const prevPage = useCallback(() => {
    if (offset - limit >= 0) setOffset(offset - limit);
  }, [offset, limit]);

  const goToPage = useCallback((page: number) => {
    const newOffset = (page - 1) * limit;
    if (newOffset >= 0 && newOffset < total) setOffset(newOffset);
  }, [limit, total]);

  return {
    mikrotiks,
    total,
    loading,
    error,
    limit,
    offset,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(total / limit),
    refetch,
    getMikrotik,
    createMikrotik,
    updateMikrotik,
    deleteMikrotik,
    toggleOnline,
    checkConnection,
    getProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    subscribe,
    nextPage,
    prevPage,
    goToPage,
    setLimit,
    formatCurrency: mikrotikService.formatCurrency,
  };
}