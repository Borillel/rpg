import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import * as Tabs from "@radix-ui/react-tabs";
import { CharacterPanel } from "./CharacterPanel";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { characterRepository, userRepository } from "../repositories";
import { Character, UserProfile } from "../types";

export function UserArea() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [userChars, setUserChars] = useState<Character[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) navigate("/entrar");
    else if (currentUser.role === "gm") navigate("/mestre");
    else {
      Promise.all([characterRepository.getAll(), userRepository.getAll()]).then(([chars, usrs]) => {
        const myChars = chars.filter(c => currentUser.characterIds.includes(c.id));
        setUserChars(myChars);
        setUsers(usrs);
        if (myChars.length > 0) setSelectedCharacterId(myChars[0].id);
        setLoading(false);
      }).catch(err => {
        console.error("Erro ao carregar dados do banco:", err);
        alert("Erro: Não foi possível conectar ao banco de dados. Você rodou 'npm run dev:all'?");
        setLoading(false);
      });
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role === "gm") return null;

  const ownerName = users.find((u) => u.id === currentUser.id)?.name ?? "Jogador";

  const handleLogout = () => {
    logout();
    navigate("/entrar");
  };

  const handleCharacterUpdate = (updated: Character) => {
    setUserChars(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="bg-slate-900 border-b-2 border-amber-700/30 px-6 py-4 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Início
            </Link>
            <h1 className="text-2xl font-serif text-amber-400">Área Restrita do Jogador</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4" />
              <span className="text-sm">{ownerName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-500 hover:text-amber-400 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        <div className="mb-6">
          <h2 className="text-3xl mb-1 text-amber-300 font-serif">Personagens</h2>
          <p className="text-slate-400 text-sm">Gerencie seus heróis e aventuras</p>
        </div>

        {loading ? (
          <p className="text-slate-500">Carregando...</p>
        ) : userChars.length === 0 ? (
          <p className="text-slate-500 italic">Nenhum personagem associado a este perfil.</p>
        ) : (
          <Tabs.Root value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
            <Tabs.List className="flex gap-2 mb-6 border-b-2 border-slate-800 pb-2 overflow-x-auto">
              {userChars.map((character) => (
                <Tabs.Trigger
                  key={character.id}
                  value={character.id}
                  className="px-6 py-3 bg-slate-800/50 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors data-[state=active]:bg-amber-900/30 data-[state=active]:border-amber-500 whitespace-nowrap"
                >
                  <div className="text-left">
                    <div className="text-amber-300">{character.name}</div>
                    <div className="text-sm text-slate-400">{character.class} · Nível {character.level}</div>
                  </div>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {userChars.map((character) => (
              <Tabs.Content key={character.id} value={character.id}>
                <CharacterPanel character={character} onUpdateCharacter={handleCharacterUpdate} />
              </Tabs.Content>
            ))}
          </Tabs.Root>
        )}
      </main>
    </div>
  );
}
