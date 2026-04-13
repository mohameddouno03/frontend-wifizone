import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wifi, AlertCircle, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(username, password);
      navigate(user.role === "admin" ? "/admin" : "/owner");
    } catch (err: any) {
      setError(err.message || "Nom d'utilisateur ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500 opacity-30 blur-3xl" />
        <div className="absolute top-60 -left-40 h-80 w-80 rounded-full bg-blue-500 opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 right-60 h-80 w-80 rounded-full bg-indigo-500 opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
              <Wifi className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">WiFi Zone</h1>
            <p className="mt-2 text-sm text-gray-400">Gérez vos points d'accès WiFi</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold text-white">Connexion</h2>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Entrer votre nom"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-white/10 bg-white/5 pl-10 pr-10 text-white placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? "Connexion..." : "Se connecter"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}