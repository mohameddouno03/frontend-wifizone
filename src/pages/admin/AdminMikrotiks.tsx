// pages/admin/AdminMikrotiks.tsx - VERSION CORRIGÉE
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMikrotiks } from "@/hooks/useMikrotiks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search, Plus, Router, Wifi, WifiOff, RefreshCw, Eye, Edit, Power, PowerOff,
  ChevronLeft, ChevronRight, Wallet, Users, AlertCircle,
  Filter, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { MicrotikInSchema } from "@/types/mikrotik";

export default function AdminMikrotiks() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<MicrotikInSchema>({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    mikrotiks,
    total,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    refetch,
    createMikrotik,
    toggleOnline,
    formatCurrency,
  } = useMikrotiks(10, 0);

  const filtered = mikrotiks.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.slug.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: mikrotiks.length,
    online: mikrotiks.filter(m => m.is_online).length,
    offline: mikrotiks.filter(m => !m.is_online).length,
    blocked: mikrotiks.filter(m => m.admin_blocked).length,
    totalBalance: mikrotiks.reduce((s, m) => s + (parseFloat(m.wallet_balance) || 0), 0),
    totalUsers: mikrotiks.reduce((s, m) => s + m.users_count, 0),
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMikrotik(formData);
      toast.success("Mikrotik créé avec succès");
      setIsCreateOpen(false);
      setFormData({ name: "" });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleOnline = async (slug: string, currentStatus: boolean) => {
    try {
      await toggleOnline(slug, currentStatus);
      toast.success(`Mikrotik ${!currentStatus ? 'activé' : 'désactivé'}`);
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement des Mikrotiks...</p>
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
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mikrotiks</h1>
          <p className="text-muted-foreground mt-1">Gérez tous les points d'accès WiFi</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 w-72 bg-muted/50"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Nouveau Mikrotik</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Router className="h-5 w-5" />
                  Créer un Mikrotik
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Nom du Mikrotik <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Ex: Hotspot Cocody"
                    value={formData.name}
                    onChange={e => setFormData({ name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Créer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[
          { label: "Total", value: stats.total, icon: Router, color: "from-blue-500 to-cyan-500" },
          { label: "En ligne", value: stats.online, icon: Wifi, color: "from-green-500 to-emerald-500" },
          { label: "Hors ligne", value: stats.offline, icon: WifiOff, color: "from-red-500 to-pink-500" },
          { label: "Bloqués", value: stats.blocked, icon: AlertCircle, color: "from-orange-500 to-amber-500" },
          { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "from-purple-500 to-indigo-500" },
          { label: "Solde total", value: formatCurrency(stats.totalBalance), icon: Wallet, color: "from-emerald-500 to-teal-500" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="relative overflow-hidden border-0 shadow-lg">
              <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", stat.color)} />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("rounded-xl p-2.5 bg-gradient-to-br text-white", stat.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Liste des Mikrotiks</span>
            <Badge variant="outline">{filtered.length} résultat(s)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Nom</th>
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Utilisateurs</th>
                  <th className="pb-3 font-medium">Solde</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Aucun Mikrotik trouvé</td></tr>
                ) : (
                  filtered.map(m => (
                    <tr key={m.slug} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", m.is_online ? "bg-success/10" : "bg-destructive/10")}>
                            {m.is_online ? <Wifi className="h-4 w-4 text-success" /> : <WifiOff className="h-4 w-4 text-destructive" />}
                          </div>
                          <span className="font-medium">{m.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-muted-foreground text-sm font-mono">{m.slug.slice(0, 12)}...</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{m.users_count}</span>
                        </div>
                      </td>
                      <td className="py-4 font-medium">{formatCurrency(m.wallet_balance)}</td>
                      <td className="py-4">
                        <Badge className={cn("gap-1", 
                          m.admin_blocked ? "bg-warning/10 text-warning" : 
                          m.is_online ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        )}>
                          {m.admin_blocked ? "Bloqué" : m.is_online ? "En ligne" : "Hors ligne"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/mikrotiks/${m.slug}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/mikrotiks/${m.slug}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleToggleOnline(m.slug, m.is_online)}>
                            {m.is_online ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} · {total} Mikrotiks
              </p>
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