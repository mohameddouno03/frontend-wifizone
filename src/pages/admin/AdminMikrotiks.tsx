import { mockMikrotiks } from "@/lib/mock-data";
import StatCard from "@/components/StatCard";
import { Router, DollarSign } from "lucide-react";

export default function AdminMikrotiks() {
  const totalBalance = mockMikrotiks.reduce((s, m) => s + m.balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tous les Mikrotiks</h2>
        <p className="text-sm text-muted-foreground">Vue globale de tous les équipements</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Total Mikrotiks" value={mockMikrotiks.length} icon={Router} variant="primary" />
        <StatCard title="Revenus totaux" value={`${totalBalance.toLocaleString()} FCFA`} icon={DollarSign} variant="success" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Adresse IP</th>
              <th className="px-4 py-3 font-medium">Utilisateurs</th>
              <th className="px-4 py-3 font-medium">Solde généré</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockMikrotiks.map(m => (
              <tr key={m.id} className="text-foreground hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.ip_address}</td>
                <td className="px-4 py-3">{m.active_users}/{m.total_users}</td>
                <td className="px-4 py-3 font-medium">{m.balance.toLocaleString()} FCFA</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.is_active ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {m.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
