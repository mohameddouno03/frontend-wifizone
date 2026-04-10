import { useState } from "react";
import { mockMikrotiks, type Mikrotik } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Power, Router } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function OwnerMikrotiks() {
  const [mikrotiks, setMikrotiks] = useState(mockMikrotiks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", ip_address: "", username: "", password: "" });

  const handleAdd = () => {
    if (!form.name || !form.ip_address) return;
    const newMk: Mikrotik = {
      id: Date.now().toString(),
      ...form,
      is_active: true,
      total_users: 0,
      active_users: 0,
      balance: 0,
    };
    setMikrotiks([...mikrotiks, newMk]);
    setForm({ name: "", ip_address: "", username: "", password: "" });
    setDialogOpen(false);
    toast.success("Mikrotik ajouté avec succès");
  };

  const toggleActive = (id: string) => {
    setMikrotiks(mikrotiks.map(m => m.id === id ? { ...m, is_active: !m.is_active } : m));
    toast.success("Statut mis à jour");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mes Mikrotiks</h2>
          <p className="text-sm text-muted-foreground">{mikrotiks.length} appareil(s) configuré(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Mikrotik</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Zone A - Centre" />
              </div>
              <div className="space-y-2">
                <Label>Adresse IP</Label>
                <Input value={form.ip_address} onChange={e => setForm({ ...form, ip_address: e.target.value })} placeholder="192.168.1.1" />
              </div>
              <div className="space-y-2">
                <Label>Nom d'utilisateur</Label>
                <Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="admin" />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <Button onClick={handleAdd} className="w-full">Ajouter le Mikrotik</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mikrotiks.map((m) => (
          <div key={m.id} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Router className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{m.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.ip_address}</p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.is_active ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {m.is_active ? "Actif" : "Inactif"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted p-2.5">
                <p className="text-xs text-muted-foreground">Utilisateurs</p>
                <p className="font-semibold text-foreground">{m.active_users}/{m.total_users}</p>
              </div>
              <div className="rounded-lg bg-muted p-2.5">
                <p className="text-xs text-muted-foreground">Solde</p>
                <p className="font-semibold text-foreground">{m.balance.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleActive(m.id)}>
                <Power className="mr-1 h-3 w-3" /> {m.is_active ? "Désactiver" : "Activer"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
