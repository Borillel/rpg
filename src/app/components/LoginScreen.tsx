import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { mockUsers } from "../data/mockData";
import { ArrowLeft, Eye, EyeOff, Shield, Sword } from "lucide-react";

const MOCK_PASSWORD = "rpg123";

export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedUserId) {
      setError("Escolha um perfil para continuar.");
      return;
    }
    if (password !== MOCK_PASSWORD) {
      setError("Senha incorreta. Tente novamente.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === selectedUserId)!;
      login(user);
      navigate(user.role === "gm" ? "/mestre" : "/area-usuario");
    }, 600);
  };

  const players = mockUsers.filter((u) => u.role === "player");
  const gm = mockUsers.find((u) => u.role === "gm")!;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {}
      <header className="bg-slate-900 border-b-2 border-amber-700/30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Início
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 border-2 border-amber-700/50 mb-4">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <h1 className="text-3xl font-serif text-amber-300 mb-1">Entrar na Mesa</h1>
            <p className="text-slate-500 text-sm">Identifique-se para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {}
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-600 font-semibold mb-3">
                Perfil
              </label>
              <div className="space-y-2">
                {}
                <div className="flex items-center gap-1 text-xs text-slate-600 uppercase tracking-wider mb-1">
                  <Sword className="w-3 h-3" /> Jogadores
                </div>
                {players.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { setSelectedUserId(u.id); setError(""); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-2 transition-colors text-left
                      ${selectedUserId === u.id
                        ? "border-amber-500 bg-amber-900/25 text-amber-300"
                        : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50"
                      }`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center text-sm font-serif border shrink-0
                      ${selectedUserId === u.id ? "border-amber-500 bg-amber-900/40 text-amber-300" : "border-slate-600 bg-slate-800 text-slate-400"}`}>
                      {u.avatar}
                    </div>
                    <span className="font-medium">{u.name}</span>
                    {selectedUserId === u.id && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </button>
                ))}

                {}
                <div className="flex items-center gap-1 text-xs text-slate-600 uppercase tracking-wider mt-3 mb-1">
                  <Shield className="w-3 h-3" /> Mestre
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedUserId(gm.id); setError(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-2 transition-colors text-left
                    ${selectedUserId === gm.id
                      ? "border-amber-500 bg-amber-900/25 text-amber-300"
                      : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50"
                    }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center text-sm font-serif border shrink-0
                    ${selectedUserId === gm.id ? "border-amber-500 bg-amber-900/40 text-amber-300" : "border-slate-600 bg-slate-800 text-slate-400"}`}>
                    {gm.avatar}
                  </div>
                  <span className="font-medium">{gm.name}</span>
                  {selectedUserId === gm.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {}
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-600 font-semibold mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••"
                  className="w-full bg-slate-900 border-2 border-slate-700 focus:border-amber-600 outline-none px-4 py-3 pr-12 text-slate-200 placeholder-slate-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-1">Senha de demonstração: <span className="text-slate-500 font-mono">rpg123</span></p>
            </div>

            {}
            {error && (
              <div className="px-4 py-3 bg-red-900/20 border border-red-700/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            {}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-semibold tracking-wide transition-colors border-2 border-amber-500"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
