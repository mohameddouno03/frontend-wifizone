import { Router, Users, DollarSign, Wifi } from "lucide-react";
import StatCard from "@/components/StatCard";
import { mockMikrotiks, mockUsers } from "@/lib/mock-data";

export default function OwnerDashboard() {
  const totalBalance = mockMikrotiks.reduce((s, m) => s + m.balance, 0);
  const totalUsers = mockMikrotiks.reduce((s, m) => s + m.total_users, 0);
  const activeUsers = mockMikrotiks.reduce((s, m) => s + m.active_users, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bonjour, Jean 👋</h2>
        <p className="text-sm text-muted-foreground">Voici un aperçu de vos zones WiFi</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Mikrotiks actifs" value={mockMikrotiks.filter(m => m.is_active).length} icon={Router} variant="primary" />
        <StatCard title="Utilisateurs totaux" value={totalUsers} icon={Users} variant="accent" />
        <StatCard title="Utilisateurs actifs" value={activeUsers} icon={Wifi} variant="success" />
        <StatCard title="Solde global" value={`${totalBalance.toLocaleString()} FCFA`} icon={DollarSign} variant="warning" />
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Mikrotiks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Nom</th>
                <th className="pb-3 font-medium">Adresse IP</th>
                <th className="pb-3 font-medium">Utilisateurs</th>
                <th className="pb-3 font-medium">Solde</th>
                <th className="pb-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockMikrotiks.map((m) => (
                <tr key={m.id} className="text-foreground">
                  <td className="py-3 font-medium">{m.name}</td>
                  <td className="py-3 text-muted-foreground">{m.ip_address}</td>
                  <td className="py-3">{m.active_users}/{m.total_users}</td>
                  <td className="py-3 font-medium">{m.balance.toLocaleString()} FCFA</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${m.is_active ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {m.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
