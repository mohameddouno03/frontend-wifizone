// pages/shared/MikrotikDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMikrotiks } from "@/hooks/useMikrotiks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wifi, WifiOff, Users, Wallet, TrendingUp, CreditCard,
  RefreshCw, Edit, Trash2, Plus, Power, PowerOff,
  ChevronLeft, AlertCircle, Copy, Server, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { 
  MicrotikOutRetrieveSchema, 
  ProfilInSchema, 
  ProfilOutSchema, 
  MikroTikRateLimit, 
  ProfilDurationEnum, 
  StatusEnum 
} from "@/types/mikrotik";

const RATE_LIMITS: MikroTikRateLimit[] = [
  "256k/512k", "512k/1M", "1M/2M", "2M/4M", "4M/8M",
  "5M/10M", "10M/20M", "20M/50M", "50M/100M", "0/0"
];

const DURATION_TYPES: { value: ProfilDurationEnum; label: string }[] = [
  { value: "m", label: "Minutes" },
  { value: "h", label: "Heures" },
  { value: "d", label: "Jours" },
];

const STATUS_OPTIONS: { value: StatusEnum; label: string }[] = [
  { value: "active", label: "Actif" },
  { value: "disable", label: "Désactivé" },
];

export default function MikrotikDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const basePath = isAdmin ? "/admin" : "/owner";
  
  const { 
    getMikrotik, 
    updateMikrotik, 
    deleteMikrotik, 
    toggleOnline, 
    getProfiles, 
    createProfile, 
    updateProfile, 
    deleteProfile, 
    formatCurrency 
  } = useMikrotiks();

  const [mikrotik, setMikrotik] = useState<MicrotikOutRetrieveSchema | null>(null);
  const [profiles, setProfiles] = useState<ProfilOutSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfilOutSchema | null>(null);
  const [editName, setEditName] = useState("");
  
  const [profileForm, setProfileForm] = useState<ProfilInSchema>({
    name: "",
    rate_limit: "1M/2M",
    shared_users: 1,
    price: 0,
    currency: "gnf",
    status: "active",
    type_session: "h",
    duration: 1,
  });

  const loadData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const [mikrotikData, profilesData] = await Promise.all([
        getMikrotik(slug),
        getProfiles(slug),
      ]);
      setMikrotik(mikrotikData);
      setProfiles(profilesData);
      setEditName(mikrotikData.name);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleBack = () => {
    navigate(`${basePath}/mikrotiks`);
  };

  const handleUpdate = async () => {
    if (!slug || !editName.trim()) return;
    try {
      await updateMikrotik(slug, { name: editName });
      toast.success("Mikrotik mis à jour");
      setIsEditOpen(false);
      loadData();
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    if (!slug) return;
    if (confirm("Êtes-vous sûr de vouloir supprimer ce Mikrotik ?")) {
      try {
        await deleteMikrotik(slug);
        toast.success("Mikrotik supprimé");
        navigate(`${basePath}/mikrotiks`);
      } catch (err) {
        // Error handled in hook
      }
    }
  };

  const handleToggleOnline = async () => {
    if (!slug || !mikrotik) return;
    try {
      await toggleOnline(slug, mikrotik.is_online);
      toast.success(`Mikrotik ${!mikrotik.is_online ? 'activé' : 'désactivé'}`);
      loadData();
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    try {
      if (isEditingProfile && selectedProfile) {
        await updateProfile(slug, selectedProfile.slug, {
          name: profileForm.name,
          rate_limit: profileForm.rate_limit,
          shared_users: profileForm.shared_users,
          price: String(profileForm.price),
          currency: profileForm.currency,
          status: profileForm.status,
          type_session: profileForm.type_session,
          duration: profileForm.duration,
        });
        toast.success("Profil mis à jour");
      } else {
        await createProfile(slug, profileForm);
        toast.success("Profil créé");
      }
      setIsProfileOpen(false);
      setIsEditingProfile(false);
      setSelectedProfile(null);
      setProfileForm({
        name: "",
        rate_limit: "1M/2M",
        shared_users: 1,
        price: 0,
        currency: "gnf",
        status: "active",
        type_session: "h",
        duration: 1,
      });
      loadData();
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleEditProfile = (profile: ProfilOutSchema) => {
    setSelectedProfile(profile);
    setProfileForm({
      name: profile.name,
      rate_limit: profile.rate_limit,
      shared_users: profile.shared_users,
      price: parseFloat(profile.price) || 0,
      currency: profile.currency,
      status: profile.status || "active",
      type_session: profile.type_session || "h",
      duration: profile.duration || 1,
    });
    setIsEditingProfile(true);
    setIsProfileOpen(true);
  };

  const handleDeleteProfile = async (profilSlug: string) => {
    if (!slug) return;
    if (confirm("Supprimer ce profil ?")) {
      try {
        await deleteProfile(slug, profilSlug);
        toast.success("Profil supprimé");
        loadData();
      } catch (err) {
        // Error handled in hook
      }
    }
  };

  const handleCopySlug = () => {
    if (mikrotik?.slug) {
      navigator.clipboard.writeText(mikrotik.slug);
      toast.success("Slug copié !");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <RefreshCw className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!mikrotik) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-muted-foreground">Mikrotik non trouvé</p>
            <Button className="mt-4" onClick={handleBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />Retour
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className={cn("p-2 rounded-lg", mikrotik.is_online ? "bg-success/10" : "bg-destructive/10")}>
                {mikrotik.is_online ? <Wifi className="h-5 w-5 text-success" /> : <WifiOff className="h-5 w-5 text-destructive" />}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{mikrotik.name}</h1>
              <Badge className={cn(mikrotik.is_online ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                {mikrotik.is_online ? "En ligne" : "Hors ligne"}
              </Badge>
              {mikrotik.admin_blocked && (
                <Badge className="bg-warning/10 text-warning">Bloqué par admin</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="font-mono">ID: {mikrotik.slug.slice(0, 16)}...</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopySlug}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToggleOnline}>
            {mikrotik.is_online ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
            {mikrotik.is_online ? "Désactiver" : "Activer"}
          </Button>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Modifier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le Mikrotik</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
                  <Button onClick={handleUpdate}>Enregistrer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />Supprimer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Solde", value: formatCurrency(mikrotik.wallet_balance), icon: Wallet, color: "from-emerald-500 to-teal-500" },
          { label: "Disponible", value: formatCurrency(mikrotik.amount_available_windrawal), icon: DollarSign, color: "from-blue-500 to-cyan-500" },
          { label: "Utilisateurs", value: mikrotik.users_count, icon: Users, color: "from-purple-500 to-indigo-500" },
          { label: "Commission", value: `${mikrotik.commission_rate}%`, icon: TrendingUp, color: "from-orange-500 to-amber-500" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="relative overflow-hidden border-0 shadow-lg">
              <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", stat.color)} />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                    <p className="text-xl font-bold mt-1 truncate">{stat.value}</p>
                  </div>
                  <div className={cn("rounded-xl p-2.5 bg-gradient-to-br text-white shrink-0", stat.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subscription Info */}
      {mikrotik.subscription && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Abonnement VPN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">IP VPN</p>
                <p className="font-mono font-medium">{mikrotik.subscription.vpn_ip}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="font-mono font-medium">{mikrotik.subscription.vpn_username}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expire le</p>
                <p className="font-medium">{new Date(mikrotik.subscription.expire_at).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Statut</p>
                <Badge className={mikrotik.subscription.is_paid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                  {mikrotik.subscription.is_paid ? "Payé" : "En attente"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profils Section */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="h-5 w-5" />
            Profils de connexion
          </CardTitle>
          <Dialog open={isProfileOpen} onOpenChange={(open) => {
            setIsProfileOpen(open);
            if (!open) {
              setIsEditingProfile(false);
              setSelectedProfile(null);
              setProfileForm({
                name: "",
                rate_limit: "1M/2M",
                shared_users: 1,
                price: 0,
                currency: "gnf",
                status: "active",
                type_session: "h",
                duration: 1,
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-2 h-4 w-4" />Nouveau profil</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditingProfile ? "Modifier le profil" : "Créer un profil"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProfile} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom <span className="text-destructive">*</span></Label>
                    <Input
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Limite de débit <span className="text-destructive">*</span></Label>
                    <Select value={profileForm.rate_limit} onValueChange={(v) => setProfileForm({ ...profileForm, rate_limit: v as MikroTikRateLimit })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {RATE_LIMITS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Prix (GNF) <span className="text-destructive">*</span></Label>
                    <Input
                      type="number"
                      value={profileForm.price}
                      onChange={e => setProfileForm({ ...profileForm, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Durée <span className="text-destructive">*</span></Label>
                    <Input
                      type="number"
                      value={profileForm.duration}
                      onChange={e => setProfileForm({ ...profileForm, duration: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unité <span className="text-destructive">*</span></Label>
                    <Select value={profileForm.type_session} onValueChange={(v) => setProfileForm({ ...profileForm, type_session: v as ProfilDurationEnum })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DURATION_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Utilisateurs simultanés <span className="text-destructive">*</span></Label>
                    <Input
                      type="number"
                      value={profileForm.shared_users}
                      onChange={e => setProfileForm({ ...profileForm, shared_users: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select value={profileForm.status || "active"} onValueChange={(v) => setProfileForm({ ...profileForm, status: v as StatusEnum })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsProfileOpen(false)}>Annuler</Button>
                  <Button type="submit">{isEditingProfile ? "Mettre à jour" : "Créer"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun profil créé</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Nom</th>
                    <th className="pb-3 font-medium">Débit</th>
                    <th className="pb-3 font-medium">Prix</th>
                    <th className="pb-3 font-medium">Durée</th>
                    <th className="pb-3 font-medium">Utilisateurs</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {profiles.map(p => (
                    <tr key={p.slug} className="hover:bg-muted/30">
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="py-3 text-muted-foreground">{p.rate_limit}</td>
                      <td className="py-3">{formatCurrency(p.price)}</td>
                      <td className="py-3 text-muted-foreground">{p.duration}{p.type_session}</td>
                      <td className="py-3">{p.shared_users}</td>
                      <td className="py-3">
                        <Badge className={p.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                          {p.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProfile(p)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProfile(p.slug)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}