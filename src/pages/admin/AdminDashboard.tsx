// pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/hooks/useUsers";
import { useMikrotiks } from "@/hooks/useMikrotiks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Router, Wifi, DollarSign, TrendingUp,
  RefreshCw, ChevronRight, Activity, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  
  const { users, total: totalUsers, loading: usersLoading } = useUsers(100, 0);
  const { mikrotiks, total: totalMikrotiks, loading: mikrotiksLoading } = useMikrotiks(100, 0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  const stats = {
    totalUsers,
    activeUsers: users.filter(u => u.is_active).length,
    totalMikrotiks,
    onlineMikrotiks: mikrotiks.filter(m => m.is_online).length,
    totalBalance: mikrotiks.reduce((s, m) => s + (parseFloat(m.wallet_balance) || 0), 0),
  };

  const loading = usersLoading || mikrotiksLoading;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <RefreshCw className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-cyan-500" },
          { label: "Actifs", value: stats.activeUsers, icon: Activity, color: "from-green-500 to-emerald-500" },
          { label: "Mikrotiks", value: stats.totalMikrotiks, icon: Router, color: "from-purple-500 to-indigo-500" },
          { label: "En ligne", value: stats.onlineMikrotiks, icon: Wifi, color: "from-emerald-500 to-teal-500" },
          { label: "Revenus", value: `${stats.totalBalance.toLocaleString()} FCFA`, icon: DollarSign, color: "from-orange-500 to-amber-500" },
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Actions rapides</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/admin/users"}>
                <Users className="mr-2 h-4 w-4" />Gérer les utilisateurs
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/admin/mikrotiks"}>
                <Router className="mr-2 h-4 w-4" />Gérer les Mikrotiks
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">État du système</h3>
              <Badge variant="outline" className="gap-1"><Activity className="h-3 w-3" />Opérationnel</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API</span>
                <Badge className="bg-success/10 text-success">En ligne</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de données</span>
                <Badge className="bg-success/10 text-success">Connectée</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}