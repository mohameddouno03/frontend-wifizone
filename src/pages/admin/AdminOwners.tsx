import { useState } from "react";
import { mockOwners, type Owner } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Ban, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminOwners() {
  const [owners, setOwners] = useState(mockOwners);
  const [search, setSearch] = useState("");

  const filtered = owners.filter(o => o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()));

  const toggleBlock = (id: string) => {
    setOwners(owners.map(o => o.id === id ? { ...o, is_blocked: !o.is_blocked } : o));
    toast.success("Statut mis à jour");
  };

  const deleteOwner = (id: string) => {
    setOwners(owners.filter(o => o.id !== id));
    toast.success("Propriétaire supprimé");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Propriétaires</h2>
          <p className="text-sm text-muted-foreground">{owners.length} propriétaire(s)</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Mikrotiks</th>
              <th className="px-4 py-3 font-medium">Solde</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(o => (
              <tr key={o.id} className="text-foreground hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{o.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.phone}</td>
                <td className="px-4 py-3">{o.mikrotik_count}</td>
                <td className="px-4 py-3 font-medium">{o.total_balance.toLocaleString()} FCFA</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.is_blocked ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                    {o.is_blocked ? "Bloqué" : "Actif"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleBlock(o.id)}>
                      {o.is_blocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteOwner(o.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
