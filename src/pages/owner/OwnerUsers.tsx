// pages/owner/OwnerUsers.tsx
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search, Users as UsersIcon, Mail, Phone, MapPin,
  RefreshCw, Eye, ChevronLeft, ChevronRight, AlertCircle,
  CheckCircle2, Ban
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OwnerUsers() {
  const [search, setSearch] = useState("");

  const {
    users,
    total,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    refetch,
  } = useUsers(10, 0);

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name.toLowerCase().includes(search.toLowerCase()) ||
    u.last_name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3 inline-block">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Liste des utilisateurs connectés à vos hotspots</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 w-72 bg-muted/50"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="rounded-xl p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <UsersIcon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Actifs</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <div className="rounded-xl p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Inactifs</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <div className="rounded-xl p-2.5 bg-gradient-to-br from-red-500 to-pink-500 text-white">
                <Ban className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Liste des utilisateurs</span>
            <Badge variant="outline">{filtered.length} résultat(s)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Utilisateur</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Adresse</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Aucun utilisateur trouvé</td></tr>
                ) : (
                  filtered.map(u => (
                    <tr key={u.slug} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(u.first_name, u.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{u.first_name} {u.last_name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{u.email}</span>
                          </div>
                          {u.phone_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{u.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{u.address || "-"}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge className={cn("gap-1", u.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
                          {u.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">Page {currentPage} sur {totalPages} · {total} utilisateurs</p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm">{currentPage} / {totalPages}</span>
                <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}