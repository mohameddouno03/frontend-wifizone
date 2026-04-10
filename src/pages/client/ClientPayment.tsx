import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wifi, CheckCircle, Loader2 } from "lucide-react";

export default function ClientPayment() {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [receivePhone, setReceivePhone] = useState("");
  const [ticketCode, setTicketCode] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    // Simulate payment processing
    setTimeout(() => {
      const code = `WIFI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setTicketCode(code);
      setStep("success");
    }, 3000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Wifi className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">WiFi Zone</h1>
          <p className="mt-1 text-sm text-muted-foreground">Achetez votre ticket WiFi</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {step === "form" && (
            <form onSubmit={handlePayment} className="space-y-5">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                <p className="text-sm text-muted-foreground">Forfait WiFi</p>
                <p className="text-3xl font-bold text-primary">500 FCFA</p>
                <p className="text-xs text-muted-foreground">Accès illimité - 24h</p>
              </div>

              <div className="space-y-2">
                <Label>Numéro de paiement</Label>
                <Input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={paymentPhone}
                  onChange={e => setPaymentPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Le numéro depuis lequel le paiement sera effectué</p>
              </div>

              <div className="space-y-2">
                <Label>Numéro de réception du code</Label>
                <Input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={receivePhone}
                  onChange={e => setReceivePhone(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Vous recevrez le code WiFi par SMS sur ce numéro</p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Payer 500 FCFA
              </Button>
            </form>
          )}

          {step === "processing" && (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg font-medium text-foreground">Traitement en cours...</p>
              <p className="mt-1 text-sm text-muted-foreground">Veuillez confirmer le paiement sur votre téléphone</p>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Paiement réussi !</h3>
              <p className="mt-2 text-sm text-muted-foreground">Votre code WiFi a été envoyé par SMS</p>
              <div className="mt-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
                <p className="text-xs text-muted-foreground">Votre code WiFi</p>
                <p className="mt-2 font-mono text-3xl font-bold tracking-widest text-primary">{ticketCode}</p>
              </div>
              <Button variant="outline" className="mt-6" onClick={() => { setStep("form"); setPaymentPhone(""); setReceivePhone(""); }}>
                Acheter un autre ticket
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
