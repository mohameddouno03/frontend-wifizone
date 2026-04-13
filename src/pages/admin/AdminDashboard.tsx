// pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/hooks/useUsers";
import { useMikrotiks } from "@/hooks/useMikrotiks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users, Router, Wifi, DollarSign,
  RefreshCw, ChevronRight, Activity, CheckCircle2,
  XCircle, Clock, CreditCard, Wallet,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart,
  UserPlus, UserCheck, WifiOff,
  Download, Filter, Award, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Types pour les données mockées
interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface Transaction {
  id: string;
  user: string;
  amount: number;
  type: "subscription" | "withdrawal" | "commission";
  status: "completed" | "pending" | "failed";
  date: string;
  avatar: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "client";
  status: "active" | "inactive";
  joinedAt: string;
  avatar: string;
}

interface TopOwner {
  id: string;
  name: string;
  revenue: number;
  mikrotiks: number;
  users: number;
  avatar: string;
  trend: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
  const { users, total: totalUsers, loading: usersLoading } = useUsers(100, 0);
  const { mikrotiks, total: totalMikrotiks, loading: mikrotiksLoading, formatCurrency } = useMikrotiks(100, 0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Données actualisées");
    }, 1500);
  };

  // Données mockées pour les graphiques
  const revenueChartData: ChartData[] = [
    { label: "Lun", value: 1250000, color: "bg-blue-500" },
    { label: "Mar", value: 1450000, color: "bg-blue-500" },
    { label: "Mer", value: 980000, color: "bg-blue-500" },
    { label: "Jeu", value: 1670000, color: "bg-blue-500" },
    { label: "Ven", value: 1890000, color: "bg-blue-500" },
    { label: "Sam", value: 2100000, color: "bg-blue-500" },
    { label: "Dim", value: 1780000, color: "bg-blue-500" },
  ];

  const mikrotikStatusData = [
    { label: "En ligne", value: mikrotiks.filter(m => m.is_online).length, color: "bg-success" },
    { label: "Hors ligne", value: mikrotiks.filter(m => !m.is_online && !m.admin_blocked).length, color: "bg-destructive" },
    { label: "Bloqués", value: mikrotiks.filter(m => m.admin_blocked).length, color: "bg-warning" },
  ];

  const recentTransactions: Transaction[] = [
    { id: "TRX-001", user: "Koné Amadou", amount: 50000, type: "subscription", status: "completed", date: "Aujourd'hui, 10:30", avatar: "KA" },
    { id: "TRX-002", user: "Touré Aïssata", amount: 100000, type: "subscription", status: "completed", date: "Aujourd'hui, 09:15", avatar: "TA" },
    { id: "TRX-003", user: "Bamba Moussa", amount: 250000, type: "withdrawal", status: "pending", date: "Hier, 22:45", avatar: "BM" },
    { id: "TRX-004", user: "Coulibaly Fatou", amount: 150000, type: "subscription", status: "completed", date: "Hier, 18:20", avatar: "CF" },
    { id: "TRX-005", user: "Admin System", amount: 125000, type: "commission", status: "completed", date: "Hier, 14:00", avatar: "AS" },
  ];

  const recentUsers: RecentUser[] = [
    { id: "1", name: "Jean Kouadio", email: "jean.k@email.com", role: "owner", status: "active", joinedAt: "Il y a 2h", avatar: "JK" },
    { id: "2", name: "Marie Konan", email: "marie.k@email.com", role: "client", status: "active", joinedAt: "Il y a 5h", avatar: "MK" },
    { id: "3", name: "Paul Yao", email: "paul.y@email.com", role: "owner", status: "inactive", joinedAt: "Hier", avatar: "PY" },
    { id: "4", name: "Sophie Bah", email: "sophie.b@email.com", role: "client", status: "active", joinedAt: "Hier", avatar: "SB" },
  ];

  const topOwners: TopOwner[] = [
    { id: "1", name: "Ivoire Telecom", revenue: 12500000, mikrotiks: 8, users: 450, avatar: "IT", trend: 12.5 },
    { id: "2", name: "Koné Networks", revenue: 9800000, mikrotiks: 5, users: 320, avatar: "KN", trend: 8.3 },
    { id: "3", name: "Côte Ouest WiFi", revenue: 7500000, mikrotiks: 4, users: 280, avatar: "CW", trend: -2.1 },
  ];

  const stats = {
    totalUsers,
    activeUsers: users.filter(u => u.is_active).length,
    inactiveUsers: users.filter(u => !u.is_active).length,
    totalMikrotiks,
    onlineMikrotiks: mikrotiks.filter(m => m.is_online).length,
    offlineMikrotiks: mikrotiks.filter(m => !m.is_online).length,
    totalBalance: mikrotiks.reduce((s, m) => s + (parseFloat(m.wallet_balance) || 0), 0),
    totalRevenue: 4585000,
    revenueTrend: 15.3,
    userTrend: 22.4,
  };

  const maxChartValue = Math.max(...revenueChartData.map(d => d.value));

  const loading = usersLoading || mikrotiksLoading;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "pending": return <Clock className="h-4 w-4 text-warning" />;
      case "failed": return <XCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      admin: { label: "Admin", className: "bg-destructive/10 text-destructive" },
      owner: { label: "Propriétaire", className: "bg-primary/10 text-primary" },
      client: { label: "Client", className: "bg-success/10 text-success" },
    };
    const config = configs[role] || { label: role, className: "bg-muted text-muted-foreground" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <RefreshCw className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}, <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{user?.name?.split(" ")[0]}</span> 👋
            </h1>
            <Badge className="bg-gradient-to-r from-primary to-primary/80">
              <Crown className="mr-1 h-3 w-3" />
              Admin
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[
          { label: "Utilisateurs", value: stats.totalUsers, subValue: `+${stats.userTrend}%`, icon: Users, color: "from-blue-500 to-cyan-500", trend: "up" },
          { label: "Actifs", value: stats.activeUsers, icon: UserCheck, color: "from-green-500 to-emerald-500" },
          { label: "Mikrotiks", value: stats.totalMikrotiks, icon: Router, color: "from-purple-500 to-indigo-500" },
          { label: "En ligne", value: stats.onlineMikrotiks, icon: Wifi, color: "from-emerald-500 to-teal-500" },
          { label: "Hors ligne", value: stats.offlineMikrotiks, icon: WifiOff, color: "from-red-500 to-pink-500" },
          { label: "Revenus", value: formatCurrency(stats.totalRevenue), subValue: `+${stats.revenueTrend}%`, icon: DollarSign, color: "from-orange-500 to-amber-500", trend: "up" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", stat.color)} />
              <CardContent className="p-4 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    {stat.subValue && (
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 text-success" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-destructive" />
                        )}
                        <span className={cn("text-xs font-medium", stat.trend === "up" ? "text-success" : "text-destructive")}>
                          {stat.subValue}
                        </span>
                      </div>
                    )}
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

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Graphique des revenus */}
        <Card className="lg:col-span-2 border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Revenus
              </CardTitle>
              <p className="text-sm text-muted-foreground">Évolution sur les 7 derniers jours</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPeriod("week")} className={cn(selectedPeriod === "week" && "bg-primary/10")}>
                Semaine
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPeriod("month")} className={cn(selectedPeriod === "month" && "bg-primary/10")}>
                Mois
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <div className="flex items-end justify-between h-full px-2">
                {revenueChartData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div className="relative w-full flex justify-center">
                      <div 
                        className="w-10 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${(item.value / maxChartValue) * 180}px` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
                          <Badge variant="secondary" className="text-[10px]">
                            {formatCurrency(item.value)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total cette semaine</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <Badge className="gap-1 bg-success/10 text-success">
                <ArrowUpRight className="h-3 w-3" />
                +{stats.revenueTrend}% vs semaine dernière
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Répartition Mikrotiks */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              État des Mikrotiks
            </CardTitle>
            <p className="text-sm text-muted-foreground">Répartition par statut</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mikrotikStatusData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-3 w-3 rounded-full", item.color)} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                  <Progress value={stats.totalMikrotiks > 0 ? (item.value / stats.totalMikrotiks) * 100 : 0} className="h-2" />
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">{stats.totalMikrotiks}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">{stats.onlineMikrotiks}</p>
                <p className="text-xs text-muted-foreground">En ligne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableaux et listes */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Transactions récentes */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Transactions récentes
              </CardTitle>
              <p className="text-sm text-muted-foreground">Dernières opérations</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/finances")}>
              Voir tout
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-4">
              <div className="space-y-1">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {tx.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{tx.user}</p>
                        <span className={cn(
                          "text-sm font-semibold",
                          tx.type === "subscription" && "text-success",
                          tx.type === "withdrawal" && "text-destructive",
                          tx.type === "commission" && "text-primary"
                        )}>
                          {tx.type === "withdrawal" ? "-" : "+"}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getStatusIcon(tx.status)}
                        <span className="text-xs text-muted-foreground">{tx.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Nouveaux utilisateurs */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Nouveaux utilisateurs
              </CardTitle>
              <p className="text-sm text-muted-foreground">Dernières inscriptions</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/users")}>
              Voir tout
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-4">
              <div className="space-y-1">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs">
                        {u.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        {getRoleBadge(u.role)}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{u.joinedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Top Owners */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-warning" />
                Top Propriétaires
              </CardTitle>
              <p className="text-sm text-muted-foreground">Meilleurs revenus</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/owners")}>
              Voir tout
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-4">
              <div className="space-y-3">
                {topOwners.map((owner, index) => (
                  <div key={owner.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-warning/20 to-warning/10 text-warning">
                            {owner.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-warning" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{owner.name}</p>
                          <div className="flex items-center gap-1">
                            {owner.trend > 0 ? (
                              <ArrowUpRight className="h-3 w-3 text-success" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-destructive" />
                            )}
                            <span className={cn("text-xs", owner.trend > 0 ? "text-success" : "text-destructive")}>
                              {owner.trend > 0 ? "+" : ""}{owner.trend}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium">{formatCurrency(owner.revenue)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Router className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{owner.mikrotiks}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{owner.users}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate("/admin/users")}>
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Utilisateurs</p>
                <p className="text-xs text-muted-foreground">Gérer les comptes</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate("/admin/mikrotiks")}>
              <Router className="mr-2 h-5 w-5 text-purple-500" />
              <div className="text-left">
                <p className="font-medium">Mikrotiks</p>
                <p className="text-xs text-muted-foreground">Gérer les points d'accès</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate("/admin/owners")}>
              <UserCheck className="mr-2 h-5 w-5 text-green-500" />
              <div className="text-left">
                <p className="font-medium">Propriétaires</p>
                <p className="text-xs text-muted-foreground">Voir les owners</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate("/admin/finances")}>
              <BarChart3 className="mr-2 h-5 w-5 text-orange-500" />
              <div className="text-left">
                <p className="font-medium">Rapports</p>
                <p className="text-xs text-muted-foreground">Voir les statistiques</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate("/admin/settings")}>
              <Activity className="mr-2 h-5 w-5 text-cyan-500" />
              <div className="text-left">
                <p className="font-medium">Système</p>
                <p className="text-xs text-muted-foreground">État et paramètres</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}