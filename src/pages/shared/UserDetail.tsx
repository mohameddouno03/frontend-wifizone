import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronLeft, RefreshCw, AlertCircle, Mail, Phone, MapPin,
  CheckCircle2, XCircle, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserDetailResponse } from "@/types/user";

export default function UserDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const basePath = isAdmin ? "/admin" : "/owner";

  const [userData, setUserData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await userService.getUser(slug);
        setUserData(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [slug]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <RefreshCw className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-muted-foreground">{error || "Utilisateur non trouvé"}</p>
            <Button className="mt-4" onClick={() => navigate(`${basePath}/users`)}>
              <ChevronLeft className="mr-2 h-4 w-4" />Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
=      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`${basePath}/users`)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(userData.first_name, userData.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{userData.first_name} {userData.last_name}</h1>
                <Badge className={userData.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                  {userData.is_active ? "Actif" : "Inactif"}
                </Badge>
                <Badge className="bg-primary/10 text-primary">
                  <User className="mr-1 h-3 w-3" />
                  Client
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
            </div>
            {userData.phone_number && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{userData.phone_number}</p>
                </div>
              </div>
            )}
            {userData.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Adresse</p>
                  <p className="font-medium">{userData.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              {userData.is_active ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Statut</p>
                <p className="font-medium">{userData.is_active ? "Actif" : "Inactif"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}