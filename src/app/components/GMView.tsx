import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import * as Tabs from "@radix-ui/react-tabs";
import { useAuth } from "../context/AuthContext";
import { mockCharacters, mockUsers } from "../data/mockData";
import { CharacterPanel } from "./CharacterPanel";
import { AdminPanel } from "./AdminPanel";
import { Shield, LogOut, ArrowLeft, Database } from "lucide-react";
import { GMSidebar } from "./GMSidebar";

export function GMView() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCharacterId, setSelectedCharacterId] = useState(mockCharacters[0].id);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "gm") navigate("/entrar");
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "gm") return null;

  const handleLogout = () => {
    logout();
    navigate("/entrar");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {}
      <header className="bg-slate-900 border-b-2 border-amber-700/30 px-6 py-4 shrink-0">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Início
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              <h1 className="text-2xl font-serif text-amber-400">Painel do Mestre</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {}
      <div className="flex flex-1 overflow-hidden max-w-screen-2xl mx-auto w-full">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-serif text-amber-300 mb-1">Painel Geral</h2>
            <p className="text-slate-400 text-sm">Visão completa da campanha e banco de dados</p>
          </div>

          <Tabs.Root value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
            <Tabs.List className="flex gap-2 mb-6 border-b-2 border-slate-800 pb-2 overflow-x-auto">
              <Tabs.Trigger
                value="admin"
                className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors data-[state=active]:bg-amber-900/30 data-[state=active]:border-amber-500 whitespace-nowrap text-left"
              >
                <Database className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-amber-300">Administração</div>
                  <div className="text-xs text-slate-500">Controle de Cadastros</div>
                </div>
              </Tabs.Trigger>

              {mockCharacters.map((character) => {
                const owner = mockUsers.find((u) => u.characterIds.includes(character.id));
                return (
                  <Tabs.Trigger
                    key={character.id}
                    value={character.id}
                    className="px-6 py-3 bg-slate-800/50 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors data-[state=active]:bg-amber-900/30 data-[state=active]:border-amber-500 whitespace-nowrap text-left"
                  >
                    <div className="text-amber-300">{character.name}</div>
                    <div className="text-xs text-slate-500">
                      {character.class} · Nível {character.level}
                      {owner && <span className="ml-1 text-slate-600">· {owner.name}</span>}
                    </div>
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            <Tabs.Content value="admin">
              <AdminPanel />
            </Tabs.Content>

            {mockCharacters.map((character) => (
              <Tabs.Content key={character.id} value={character.id}>
                <CharacterPanel character={character} isGM={true} />
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </main>

        <GMSidebar selectedCharacterId={selectedCharacterId} />
      </div>
    </div>
  );
}
