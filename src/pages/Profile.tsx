import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Key,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  LogOut,
  ChevronLeft,
  Calendar,
  Clock,
  Edit,
  X,
  Home
} from "lucide-react";
import { toast } from "sonner";
import type { UserUpdate, UserPasswordUpdateMe } from "@/types/user";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, loading, error, refetch, updateProfile, resetPassword, deleteAccount } = useCurrentUser();
  
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formulaire profil
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });

  // Formulaire mot de passe
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Initialiser le formulaire quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const getInitials = () => {
    if (!user) return "U";
    return `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`.toUpperCase();
  };

  const getRoleLabel = (type: string) => {
    const labels: Record<string, string> = {
      admin: "Administrateur",
      owner: "Propriétaire",
      client: "Client",
      ownermicrotik: "Propriétaire",
    };
    return labels[type] || type;
  };

  const getRoleBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      admin: "destructive",
      owner: "default",
      client: "secondary",
      ownermicrotik: "default",
    };
    return variants[type] || "outline";
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData: UserUpdate = {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        phone_number: profileForm.phone_number,
        address: profileForm.address || "",
      };
      
      await updateProfile(updateData);
      await refetch();
      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (passwordForm.new_password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const passwordData: UserPasswordUpdateMe = {
        password: passwordForm.password,
        new_password: passwordForm.new_password,
      };
      
      await resetPassword(passwordData);
      setPasswordSuccess(true);
      setPasswordForm({
        password: "",
        new_password: "",
        confirm_password: "",
      });
      toast.success("Mot de passe changé avec succès");
    } catch (err: any) {
      setPasswordError(err.message || "Erreur lors du changement de mot de passe");
      toast.error(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Compte supprimé avec succès");
      await logout();
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression du compte");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCancel = () => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3 inline-block">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4">{error || "Utilisateur non trouvé"}</p>
            <Button onClick={() => refetch()} variant="outline">
              <Loader2 className="mr-2 h-4 w-4" />
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Mon Profil</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar - Infos utilisateur */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">
                  {user.first_name} {user.last_name}
                </h2>
                <Badge variant={getRoleBadgeVariant(user.user_type)} className="mt-2">
                  {getRoleLabel(user.user_type)}
                </Badge>
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{user.email}</span>
                  </div>
                  {user.phone_number && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{user.phone_number}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{user.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Badge variant={user.is_active ? "default" : "secondary"} className={user.is_active ? "bg-success/10 text-success" : ""}>
                      {user.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="w-full space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/")}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Tableau de bord
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content - Tabs */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info" className="gap-2">
                <User className="h-4 w-4" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Key className="h-4 w-4" />
                Sécurité
              </TabsTrigger>
            </TabsList>

            {/* Tab Informations */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>
                        Mettez à jour vos informations de profil
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">
                          <span className="text-destructive mr-0.5">*</span>
                          Prénom
                        </Label>
                        <Input
                          id="first_name"
                          value={profileForm.first_name}
                          onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">
                          <span className="text-destructive mr-0.5">*</span>
                          Nom
                        </Label>
                        <Input
                          id="last_name"
                          value={profileForm.last_name}
                          onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        L'email ne peut pas être modifié
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Téléphone</Label>
                      <Input
                        id="phone_number"
                        value={profileForm.phone_number}
                        onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                        disabled={!isEditing}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={profileForm.address || ""}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        disabled={!isEditing}
                        placeholder="123 rue Example"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Annuler
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Sécurité */}
            <TabsContent value="security">
              <div className="space-y-4">
                {/* Changement de mot de passe */}
                <Card>
                  <CardHeader>
                    <CardTitle>Changer le mot de passe</CardTitle>
                    <CardDescription>
                      Utilisez un mot de passe fort et unique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {passwordSuccess && (
                      <Alert className="mb-4 border-success/50 bg-success/10">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <AlertDescription className="text-success">
                          Mot de passe changé avec succès !
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {passwordError && (
                      <Alert className="mb-4 border-destructive/50 bg-destructive/10">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <AlertDescription className="text-destructive">
                          {passwordError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">
                          <span className="text-destructive mr-0.5">*</span>
                          Mot de passe actuel
                        </Label>
                        <div className="relative">
                          <Input
                            id="current_password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new_password">
                          <span className="text-destructive mr-0.5">*</span>
                          Nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            id="new_password"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.new_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">
                          <span className="text-destructive mr-0.5">*</span>
                          Confirmer le mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm_password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirm_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isChangingPassword}>
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Changement...
                            </>
                          ) : (
                            <>
                              <Key className="mr-2 h-4 w-4" />
                              Changer le mot de passe
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Zone dangereuse - Suppression de compte */}
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
                    <CardDescription>
                      Actions irréversibles sur votre compte
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Supprimer le compte</p>
                        <p className="text-sm text-muted-foreground">
                          Cette action est irréversible. Toutes vos données seront supprimées.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer mon compte
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Supprimer votre compte
            </DialogTitle>
            <DialogDescription>
              Cette action est <strong>irréversible</strong>. Toutes vos données personnelles,
              vos Mikrotiks et votre historique seront définitivement supprimés.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous absolument sûr de vouloir continuer ?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Oui, supprimer mon compte
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}