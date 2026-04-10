import { useState } from "react";
import { mockMikrotiks, mockWithdrawals, mockDeposits } from "@/lib/mock-data";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, ArrowDownCircle, TrendingUp, Clock } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function OwnerFinances() {
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  const totalBalance = mockMikrotiks.reduce((s, m) => s + m.balance, 0);
  const totalWithdrawn = withdrawals.filter(w => w.status === "completed").reduce((s, w) => s + w.net_amount, 0);
  const fees = Math.round(Number(amount) * 0.2);
  const netAmount = Number(amount) - fees;

  const handleWithdraw = () => {
    if (!amount || !phone || Number(amount) <= 0) return;
    const w = {
      id: Date.now().toString(),
      amount: Number(amount),
      fees,
      net_amount: netAmount,
      phone_number: phone,
      status: "completed" as const,
      created_at: new Date().toISOString().split("T")[0],
    };
    setWithdrawals([w, ...withdrawals]);
    setAmount("");
    setPhone("");
    setDialogOpen(false);
    toast.success(`Retrait de ${netAmount.toLocaleString()} FCFA effectué`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Finances</h2>
          <p className="text-sm text-muted-foreground">Suivi des revenus et retraits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><ArrowDownCircle className="mr-2 h-4 w-4" /> Retrait</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Effectuer un retrait</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Montant (FCFA)</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50000" />
              </div>
              <div className="space-y-2">
                <Label>Numéro de réception</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="6XXXXXXXX" />
              </div>
              {amount && Number(amount) > 0 && (
                <div className="rounded-lg bg-muted p-4 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Montant</span><span className="font-medium text-foreground">{Number(amount).toLocaleString()} FCFA</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground">Frais (20%)</span><span className="font-medium text-destructive">-{fees.toLocaleString()} FCFA</span></div>
                  <div className="mt-2 border-t border-border pt-2 flex justify-between"><span className="font-medium text-foreground">Net à recevoir</span><span className="font-bold text-success">{netAmount.toLocaleString()} FCFA</span></div>
                </div>
              )}
              <Button onClick={handleWithdraw} className="w-full">Confirmer le retrait</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Solde global" value={`${totalBalance.toLocaleString()} FCFA`} icon={DollarSign} variant="primary" />
        <StatCard title="Total retiré" value={`${totalWithdrawn.toLocaleString()} FCFA`} icon={TrendingUp} variant="success" />
        <StatCard title="Retraits" value={withdrawals.length} icon={Clock} variant="default" />
      </div>

      {/* Solde par Mikrotik */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Solde par Mikrotik</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockMikrotiks.map(m => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <span className="font-medium text-foreground">{m.name}</span>
              <span className="font-bold text-primary">{m.balance.toLocaleString()} FCFA</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deposits */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Dépôts récents</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Client</th>
              <th className="pb-3 font-medium">Montant</th>
              <th className="pb-3 font-medium">Mikrotik</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockDeposits.map(d => (
              <tr key={d.id} className="text-foreground">
                <td className="py-3">{d.client_phone}</td>
                <td className="py-3 font-medium">{d.amount.toLocaleString()} FCFA</td>
                <td className="py-3 text-muted-foreground">{d.mikrotik_name}</td>
                <td className="py-3 text-muted-foreground">{d.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Withdrawal history */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Historique des retraits</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Montant</th>
              <th className="pb-3 font-medium">Frais</th>
              <th className="pb-3 font-medium">Net reçu</th>
              <th className="pb-3 font-medium">Numéro</th>
              <th className="pb-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {withdrawals.map(w => (
              <tr key={w.id} className="text-foreground">
                <td className="py-3 text-muted-foreground">{w.created_at}</td>
                <td className="py-3">{w.amount.toLocaleString()} FCFA</td>
                <td className="py-3 text-destructive">-{w.fees.toLocaleString()}</td>
                <td className="py-3 font-medium text-success">{w.net_amount.toLocaleString()}</td>
                <td className="py-3 text-muted-foreground">{w.phone_number}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${w.status === "completed" ? "bg-success/10 text-success" : w.status === "pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                    {w.status === "completed" ? "Effectué" : w.status === "pending" ? "En cours" : "Échoué"}
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
