import { useState } from "react";
import { mockUsers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Ban, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  const toggleBlock = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, is_blocked: !u.is_blocked } : u));
    toast.success("Statut mis à jour");
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success("Utilisateur supprimé");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tous les utilisateurs</h2>
          <p className="text-sm text-muted-foreground">{users.length} utilisateur(s)</p>
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
              <th className="px-4 py-3 font-medium">Utilisateur</th>
              <th className="px-4 py-3 font-medium">Mikrotik</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Créé le</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(u => (
              <tr key={u.id} className="text-foreground hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{u.username}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.mikrotik_name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.is_blocked ? "bg-destructive/10 text-destructive" : u.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {u.is_blocked ? "Bloqué" : u.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.created_at}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleBlock(u.id)}>
                      {u.is_blocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteUser(u.id)} className="text-destructive hover:text-destructive">
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
