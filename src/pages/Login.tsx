import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wifi, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Redirect based on role
      const user = JSON.parse(localStorage.getItem("wifi_user") || "{}");
      navigate(user.role === "admin" ? "/admin" : "/owner");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <Wifi className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground">WiFi Zone Manager</h2>
          <p className="mt-4 text-primary-foreground/70">
            Gérez vos points d'accès WiFi, suivez vos revenus et automatisez la vente de tickets.
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
              <Wifi className="h-6 w-6 text-primary lg:hidden" />
              <span className="text-xl font-bold text-foreground lg:hidden">WiFi Zone</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entrez vos identifiants pour accéder au tableau de bord
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
            <p className="font-medium">Comptes démo :</p>
            <p className="mt-1">Admin : admin@wifi.com / admin123</p>
            <p>Propriétaire : owner@wifi.com / owner123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
