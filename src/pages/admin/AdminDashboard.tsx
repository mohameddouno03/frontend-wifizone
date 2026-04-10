import { Users, Router, DollarSign, UserCog } from "lucide-react";
import StatCard from "@/components/StatCard";
import { mockOwners, mockMikrotiks, mockUsers } from "@/lib/mock-data";

export default function AdminDashboard() {
  const totalBalance = mockMikrotiks.reduce((s, m) => s + m.balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tableau de bord Admin</h2>
        <p className="text-sm text-muted-foreground">Vue d'ensemble du système</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Propriétaires" value={mockOwners.length} icon={UserCog} variant="primary" />
        <StatCard title="Mikrotiks" value={mockMikrotiks.length} icon={Router} variant="accent" />
        <StatCard title="Utilisateurs" value={mockUsers.length} icon={Users} variant="success" />
        <StatCard title="Revenus totaux" value={`${totalBalance.toLocaleString()} FCFA`} icon={DollarSign} variant="warning" />
      </div>

      {/* Mikrotik revenue overview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Revenus par Mikrotik</h3>
        <div className="space-y-3">
          {mockMikrotiks.map(m => {
            const pct = totalBalance > 0 ? (m.balance / totalBalance) * 100 : 0;
            return (
              <div key={m.id} className="flex items-center gap-4">
                <span className="w-40 text-sm font-medium text-foreground">{m.name}</span>
                <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-32 text-right text-sm font-semibold text-foreground">{m.balance.toLocaleString()} FCFA</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
