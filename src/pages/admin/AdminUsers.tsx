import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Plus, 
  Users as UsersIcon,
  Mail,
  Phone,
  Shield,
  UserCog,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  RefreshCw,
  Eye,
  Edit,
  MapPin,
  MoreVertical,
  Filter,
  Download,
  Upload,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  Copy,
  Key,
  Building,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import type { UserCreate, UserUpdate, UserOutSchema } from "@/types/user";
import { cn } from "@/lib/utils";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserOutSchema | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [formData, setFormData] = useState<UserCreate>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    user_type: "owner",
    address: "",
  });
  const [editFormData, setEditFormData] = useState<UserUpdate>({
    first_name: "",
    last_name: "",
    phone_number: "",
    user_type: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    users,
    total,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    createUser,
    updateUser,
    deleteUser,
    refetch,
  } = useUsers(12, 0);

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase()) ||
      (u.address && u.address.toLowerCase().includes(search.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && u.is_active;
    if (activeTab === "inactive") return matchesSearch && !u.is_active;
    if (activeTab === "admin") return matchesSearch && u.user_type === "admin";
    if (activeTab === "owner") return matchesSearch && (u.user_type === "owner" || u.user_type === "ownermicrotik");
    if (activeTab === "client") return matchesSearch && u.user_type === "client";
    
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    admin: users.filter(u => u.user_type === "admin").length,
    owner: users.filter(u => u.user_type === "owner" || u.user_type === "ownermicrotik").length,
    client: users.filter(u => u.user_type === "client").length,
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUser(formData);
      toast.success("Utilisateur créé avec succès");
      setIsCreateDialogOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        user_type: "owner",
        address: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      await updateUser(selectedUser.slug, editFormData);
      toast.success("Utilisateur mis à jour avec succès");
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserOutSchema) => {
    try {
      await updateUser(user.slug, { is_active: !user.is_active } as any);
      toast.success(`Utilisateur ${!user.is_active ? 'activé' : 'désactivé'}`);
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    }
  };

  const handleDelete = async (user: UserOutSchema) => {
    if (confirm(`Supprimer ${user.first_name} ${user.last_name} ?`)) {
      try {
        await deleteUser(user.slug);
        toast.success("Utilisateur supprimé");
      } catch (err: any) {
        toast.error(err.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (confirm(`Supprimer ${selectedUsers.length} utilisateur(s) ?`)) {
      try {
        for (const slug of selectedUsers) {
          await deleteUser(slug);
        }
        toast.success(`${selectedUsers.length} utilisateur(s) supprimé(s)`);
        setSelectedUsers([]);
      } catch (err: any) {
        toast.error(err.message || "Erreur lors de la suppression");
      }
    }
  };

  const toggleSelectUser = (slug: string) => {
    setSelectedUsers(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.slug));
    }
  };

  const getRoleBadge = (type: string) => {
    const configs: Record<string, { label: string; icon: React.ElementType; className: string }> = {
      admin: { label: "Admin", icon: Shield, className: "bg-red-500/10 text-red-500 border-red-500/20" },
      owner: { label: "Propriétaire", icon: UserCog, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      ownermicrotik: { label: "Propriétaire", icon: UserCog, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      client: { label: "Client", icon: UsersIcon, className: "bg-green-500/10 text-green-500 border-green-500/20" },
    };
    const config = configs[type] || { label: type, icon: UsersIcon, className: "bg-gray-500/10 text-gray-500" };
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={cn("gap-1", config.className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <Label>
      <span className="text-destructive mr-0.5">*</span>
      {children}
    </Label>
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Card className="max-w-md border-destructive/50">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3 inline-block">
              <Ban className="h-8 w-8 text-destructive" />
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Utilisateurs
            </h1>
            
          </div>
          <p className="text-muted-foreground mt-1">
            Gérez les comptes et les permissions des utilisateurs
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <Badge variant="secondary" className="gap-1">
                <UsersIcon className="h-3 w-3" />
                {selectedUsers.length} sélectionné(s)
              </Badge>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          )}
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-9 w-72 bg-muted/50 border-0 focus-visible:ring-1" 
              placeholder="Rechercher..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveTab("all")}>
                <UsersIcon className="mr-2 h-4 w-4" />Tous
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("active")}>
                <UserCheck className="mr-2 h-4 w-4" />Actifs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("inactive")}>
                <UserX className="mr-2 h-4 w-4" />Inactifs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nouveau
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Tous
            <Badge variant="secondary" className="ml-2">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
            Actifs
            <Badge variant="secondary" className="ml-2">{stats.active}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
            Inactifs
            <Badge variant="secondary" className="ml-2">{stats.inactive}</Badge>
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
            Admins
            <Badge variant="secondary" className="ml-2">{stats.admin}</Badge>
          </TabsTrigger>
          <TabsTrigger value="owner" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Propriétaires
            <Badge variant="secondary" className="ml-2">{stats.owner}</Badge>
          </TabsTrigger>
          <TabsTrigger value="client" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Clients
            <Badge variant="secondary" className="ml-2">{stats.client}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[
          { label: "Total", value: stats.total, icon: UsersIcon, color: "from-blue-500 to-cyan-500" },
          { label: "Actifs", value: stats.active, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
          { label: "Inactifs", value: stats.inactive, icon: Ban, color: "from-orange-500 to-amber-500" },
          { label: "Admins", value: stats.admin, icon: Shield, color: "from-red-500 to-pink-500" },
          { label: "Propriétaires", value: stats.owner, icon: UserCog, color: "from-purple-500 to-indigo-500" },
          { label: "Clients", value: stats.client, icon: UsersIcon, color: "from-teal-500 to-green-500" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="relative overflow-hidden border-0 shadow-lg">
              <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", stat.color)} />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("rounded-xl p-2.5 bg-gradient-to-br text-white", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-xl">
        {filteredUsers.length === 0 ? (
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <UsersIcon className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {search ? "Aucun résultat pour votre recherche" : "Commencez par créer un utilisateur"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Créer un utilisateur
            </Button>
          </CardContent>
        ) : viewMode === "table" ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-border"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Adresse
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map(u => (
                    <tr key={u.slug} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.slug)}
                          onChange={() => toggleSelectUser(u.slug)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-medium">
                              {getInitials(u.first_name, u.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {u.first_name} {u.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">ID: {u.slug.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{u.email}</span>
                          </div>
                          {u.phone_number && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">{u.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground truncate max-w-[120px]">
                            {u.address || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getRoleBadge(u.user_type)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "gap-1",
                            u.is_active 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <span className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            u.is_active ? "bg-success" : "bg-muted-foreground"
                          )} />
                          {u.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(u);
                                setIsViewDialogOpen(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(u);
                                setEditFormData({
                                  first_name: u.first_name,
                                  last_name: u.last_name,
                                  phone_number: u.phone_number,
                                  user_type: u.user_type,
                                  address: u.address || "",
                                });
                                setIsEditDialogOpen(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(u)}>
                                {u.is_active ? (
                                  <><Ban className="mr-2 h-4 w-4" />Désactiver</>
                                ) : (
                                  <><CheckCircle className="mr-2 h-4 w-4" />Activer</>
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(u)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages} · {total} utilisateurs
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        onClick={() => goToPage(pageNum)}
                        className="h-8 w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredUsers.map(u => (
                <Card key={u.slug} className="group relative overflow-hidden hover:shadow-lg transition-all">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.slug)}
                    onChange={() => toggleSelectUser(u.slug)}
                    className="absolute top-3 left-3 z-10 rounded"
                  />
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-3 ring-4 ring-primary/10">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xl font-medium">
                          {getInitials(u.first_name, u.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">
                        {u.first_name} {u.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{u.email}</p>
                      <div className="flex flex-wrap justify-center gap-1 mb-3">
                        {getRoleBadge(u.user_type)}
                        <Badge 
                          variant="outline"
                          className={cn(
                            "gap-1",
                            u.is_active 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <span className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            u.is_active ? "bg-success" : "bg-muted-foreground"
                          )} />
                          {u.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                      
                      <div className="w-full space-y-1.5 text-sm">
                        {u.phone_number && (
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{u.phone_number}</span>
                          </div>
                        )}
                        {u.address && (
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{u.address}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-center gap-1 mt-4 pt-3 border-t border-border w-full">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          setSelectedUser(u);
                          setIsViewDialogOpen(true);
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          setSelectedUser(u);
                          setEditFormData({
                            first_name: u.first_name,
                            last_name: u.last_name,
                            phone_number: u.phone_number,
                            user_type: u.user_type,
                            address: u.address || "",
                          });
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleStatus(u)}>
                          {u.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              Créer un nouvel utilisateur
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel>Prénom</RequiredLabel>
                <Input
                  placeholder="John"
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Nom</RequiredLabel>
                <Input
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <RequiredLabel>Email</RequiredLabel>
              <Input
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Téléphone</RequiredLabel>
              <Input
                placeholder="+33 6 12 34 56 78"
                value={formData.phone_number}
                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Mot de passe</RequiredLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Type d'utilisateur</RequiredLabel>
              <Select
                value={formData.user_type}
                onValueChange={(value) => setFormData({ ...formData, user_type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="owner">Propriétaire</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Adresse (optionnel)</Label>
              <Input
                placeholder="123 rue Example"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <Separator />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" />Création...</>
                ) : (
                  <><UserPlus className="h-4 w-4" />Créer l'utilisateur</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Profil utilisateur
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-2xl font-medium">
                    {getInitials(selectedUser.first_name, selectedUser.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  {getRoleBadge(selectedUser.user_type)}
                </div>
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                
                {selectedUser.phone_number && (
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{selectedUser.phone_number}</p>
                    </div>
                  </div>
                )}
                
                {selectedUser.address && (
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Adresse</p>
                      <p className="font-medium">{selectedUser.address}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Statut</p>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "gap-1 mt-1",
                        selectedUser.is_active 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        selectedUser.is_active ? "bg-success" : "bg-muted-foreground"
                      )} />
                      {selectedUser.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">ID unique</p>
                    <p className="font-mono text-sm">{selectedUser.slug}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  setEditFormData({
                    first_name: selectedUser.first_name,
                    last_name: selectedUser.last_name,
                    phone_number: selectedUser.phone_number,
                    user_type: selectedUser.user_type,
                    address: selectedUser.address || "",
                  });
                  setIsEditDialogOpen(true);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Edit className="h-5 w-5 text-white" />
              </div>
              Modifier l'utilisateur
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <RequiredLabel>Prénom</RequiredLabel>
                  <Input
                    value={editFormData.first_name}
                    onChange={e => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Nom</RequiredLabel>
                  <Input
                    value={editFormData.last_name}
                    onChange={e => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={editFormData.phone_number}
                  onChange={e => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Type d'utilisateur</RequiredLabel>
                <Select
                  value={editFormData.user_type}
                  onValueChange={(value) => setEditFormData({ ...editFormData, user_type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="owner">Propriétaire</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input
                  value={editFormData.address || ""}
                  onChange={e => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              </div>
              <Separator />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" />Mise à jour...</>
                  ) : (
                    <><CheckCircle className="h-4 w-4" />Enregistrer</>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}