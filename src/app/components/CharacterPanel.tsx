import { useState, useRef, useCallback, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Character, Item, MapToken, SubAreaPin } from "../types";
import {
  User,
  Users,
  Shield,
  Swords,
  Backpack,
  Map,
  MapPin,
  ChevronRight,
  Plus,
  Upload,
  Wand2,
  X,
  Check,
  FlaskConical,
  Wrench,
  ImageIcon,
  GripVertical,
  Trash2,
  FlaskRound,
  Dices,
  Ghost,
  ShieldAlert,
  ShoppingCart
} from "lucide-react";
import { DiceRollerWidget } from "./DiceRoller";
import { Market } from "./Market";
import { mockCharacters, mockUsers } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const MAX_INVENTORY = 12;

const TEST_ITEMS: Omit<Item, "id">[] = [
  { name: "Poção de Mana", type: "Consumível", rarity: "Comum", quantity: 2, description: "Restaura 50 pontos de mana instantaneamente." },
  { name: "Runa de Proteção", type: "Artefato", rarity: "Incomum", quantity: 1, description: "Grava uma runa de proteção temporária na armadura." },
  { name: "Elmo de Aço Sombrio", type: "Armadura", rarity: "Raro", quantity: 1, description: "Elmo forjado com aço extraído de minas amaldiçoadas." },
  { name: "Anel do Arquimago", type: "Artefato", rarity: "Épico", quantity: 1, description: "Amplifica feitiços arcanos em 30%." },
  { name: "Colar da Imortalidade", type: "Artefato", rarity: "Lendário", quantity: 1, description: "Quem o porta uma vez por dia pode retornar da morte." },
  { name: "Fragmento do Caos", type: "Artefato", rarity: "Mítico", quantity: 1, description: "Um pedaço da realidade que não deveria existir." },
];

interface SubAreaPin {
  id: string;
  name: string;
  x: number;
  y: number;
  image: string | null;
}

interface CharacterPanelProps {
  character: Character;
  isGM?: boolean;
  onUpdateCharacter?: (updated: Character) => void;
}

const rarityMeta: Record<string, { card: string; badge: string; label: string }> = {
  "Incomum":  { card: "border-emerald-600 bg-emerald-950/60",  badge: "bg-emerald-900/60 border-emerald-500 text-emerald-300",  label: "Incomum"  },
  "Raro":     { card: "border-blue-600 bg-blue-950/60",        badge: "bg-blue-900/60 border-blue-500 text-blue-300",            label: "Raro"     },
  "Épico":    { card: "border-purple-600 bg-purple-950/60",    badge: "bg-purple-900/60 border-purple-500 text-purple-300",      label: "Épico"    },
  "Lendário": { card: "border-orange-500 bg-orange-950/60",    badge: "bg-orange-900/60 border-orange-400 text-orange-300",      label: "Lendário" },
  "Mítico":   { card: "border-rose-500 bg-rose-950/60",        badge: "bg-rose-900/60 border-rose-400 text-rose-300",            label: "Mítico"   },
};
const defaultMeta = { card: "border-slate-700 bg-slate-800/40", badge: "bg-slate-800 border-slate-600 text-slate-400", label: "" };

const getRarityMeta = (rarity: string) => rarityMeta[rarity] ?? defaultMeta;

const itemTypeIcon = (type: string) => {
  switch (type) {
    case "Arma":      return <Swords className="w-4 h-4" />;
    case "Armadura":  return <Shield className="w-4 h-4" />;
    case "Consumível":return <FlaskConical className="w-4 h-4" />;
    case "Escudo":    return <Shield className="w-4 h-4" />;
    default:          return <Wrench className="w-4 h-4" />;
  }
};

function MapCanvas({ map, isGM }: { map: NonNullable<Character["maps"][0]>; isGM: boolean }) {
  const { currentUser } = useAuth();
  const [mapImage, setMapImage] = useState<string | null>(map.imageUrl || null);
  const [pins, setPins] = useState<SubAreaPin[]>([]);
  const [tokens, setTokens] = useState<MapToken[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [editingPin, setEditingPin] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [zoom, setZoom] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const mapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; type: "pin" | "token"; startX: number; startY: number } | null>(null);

 
  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3001/tokens?mapId=${map.id}`);
      if (res.ok) {
        const data = await res.json();
        setTokens(data);
      }
    } catch (e) {
      console.error("Falha ao buscar tokens", e);
    }
  }, [map.id]);

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 2000);
    return () => clearInterval(interval);
  }, [fetchTokens]);

  const updateTokenPosition = async (id: string, x: number, y: number) => {
    try {
      await fetch(`http://localhost:3001/tokens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y }),
      });
    } catch (e) {
      console.error("Falha ao atualizar token", e);
    }
  };

  const addTokensForParty = async () => {
    for (const char of mockCharacters) {
      const exists = tokens.some(t => t.characterId === char.id);
      if (!exists) {
        const newToken: MapToken = {
          id: crypto.randomUUID(),
          mapId: map.id,
          characterId: char.id,
          x: 50 + (Math.random() * 10 - 5),
          y: 50 + (Math.random() * 10 - 5),
        };
        await fetch("http://localhost:3001/tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newToken),
        });
      }
    }
    fetchTokens();
  };

  const joinMap = async () => {
    if (!currentUser) return;
    const myCharacters = mockCharacters.filter(c => currentUser.characterIds.includes(c.id));
    for (const char of myCharacters) {
      const exists = tokens.some(t => t.characterId === char.id);
      if (!exists) {
        const newToken: MapToken = {
          id: crypto.randomUUID(),
          mapId: map.id,
          characterId: char.id,
          x: 50 + (Math.random() * 10 - 5),
          y: 50 + (Math.random() * 10 - 5),
        };
        await fetch("http://localhost:3001/tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newToken),
        });
      }
    }
    fetchTokens();
  };

  const addNPC = async (isEnemy: boolean) => {
    const name = prompt(`Qual o nome do ${isEnemy ? 'inimigo' : 'aliado'}?`);
    if (!name) return;
    
    const newToken: MapToken = {
      id: crypto.randomUUID(),
      mapId: map.id,
      name,
      isEnemy,
      x: 50 + (Math.random() * 10 - 5),
      y: 50 + (Math.random() * 10 - 5),
    };
    await fetch("http://localhost:3001/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newToken),
    });
    fetchTokens();
  };

 
  const myChars = currentUser ? mockCharacters.filter(c => currentUser.characterIds.includes(c.id)) : [];
  const hasMissingTokens = myChars.length > 0 && myChars.some(c => !tokens.some(t => t.characterId === c.id));
 

  const handleMapFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMapImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!addMode || !isGM || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = crypto.randomUUID();
    setPins((p) => [...p, { id, name: "Nova subárea", x, y, image: null }]);
    setEditingPin(id);
    setDraftName("Nova subárea");
    setAddMode(false);
  }, [addMode]);

  const handlePinMouseDown = (e: React.MouseEvent, id: string, type: "pin" | "token") => {
    e.stopPropagation();
    dragging.current = { id, type, startX: e.clientX, startY: e.clientY };

    const onMove = (mv: MouseEvent) => {
      if (!dragging.current || !mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      const dx = ((mv.clientX - dragging.current.startX) / rect.width) * 100;
      const dy = ((mv.clientY - dragging.current.startY) / rect.height) * 100;
      dragging.current.startX = mv.clientX;
      dragging.current.startY = mv.clientY;
      
      if (dragging.current.type === "pin") {
        setPins((prev) => prev.map((p) =>
          p.id === id
            ? { ...p, x: Math.max(0, Math.min(100, p.x + dx)), y: Math.max(0, Math.min(100, p.y + dy)) }
            : p
        ));
      } else {
        setTokens((prev) => prev.map((t) =>
          t.id === id
            ? { ...t, x: Math.max(0, Math.min(100, t.x + dx)), y: Math.max(0, Math.min(100, t.y + dy)) }
            : t
        ));
      }
    };
    
    const onUp = () => {
      if (dragging.current?.type === "token") {
        const token = tokens.find(t => t.id === dragging.current?.id);
        if (token) {
          updateTokenPosition(token.id, token.x, token.y);
        }
      }
      dragging.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handlePinImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPins((prev) => prev.map((p) => p.id === id ? { ...p, image: url } : p));
    e.target.value = "";
  };

  const confirmEdit = (id: string) => {
    setPins((prev) => prev.map((p) => p.id === id ? { ...p, name: draftName || p.name } : p));
    setEditingPin(null);
  };

  const removePin = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    if (selectedPin === id) setSelectedPin(null);
    if (editingPin === id) setEditingPin(null);
  };

  const activePin = pins.find((p) => p.id === selectedPin) ?? null;

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-950/40 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-wider mr-auto">{map.name}</span>
        {mapImage && zoom > 1 && (
          <button
            onClick={() => setZoom(1)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-600/50 hover:text-amber-300 transition-colors"
          >
            {zoom.toFixed(2)}× · Resetar zoom
          </button>
        )}
        {!isGM && hasMissingTokens && (
          <button
            onClick={joinMap}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-600 border border-amber-500 text-amber-50 hover:bg-amber-500 transition-colors mr-2"
          >
            <User className="w-3.5 h-3.5" />
            Entrar no Mapa
          </button>
        )}
        {mapImage && isGM && (
          <>
            <button
              onClick={addTokensForParty}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-600/50 hover:text-amber-300 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              Evocar Grupo
            </button>
            <button
              onClick={() => addNPC(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-emerald-400 hover:border-emerald-600/50 hover:text-emerald-300 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              NPC Aliado
            </button>
            <button
              onClick={() => addNPC(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-red-400 hover:border-red-600/50 hover:text-red-300 transition-colors mr-2"
            >
              <Ghost className="w-3.5 h-3.5" />
              Inimigo
            </button>
          </>
        )}
        {mapImage && isGM && (
          <button
            onClick={() => { setAddMode((v) => !v); setSelectedPin(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors
              ${addMode
                ? "bg-amber-900/40 border-amber-500 text-amber-300"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-600/50 hover:text-amber-300"
              }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {addMode ? "Clique no mapa..." : "Adicionar subárea"}
          </button>
        )}
        {isGM && (
          <>
            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-600/50 hover:text-amber-300 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              {mapImage ? "Trocar mapa" : "Carregar mapa"}
              <input type="file" accept="image/*" className="hidden" onChange={handleMapFile} />
            </label>
            <button
              disabled
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-300 opacity-30 cursor-not-allowed"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Gerar
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 min-h-0">
        
        {mapImage ? (
          <div
            ref={mapRef}
            onClick={handleMapClick}
            className={`relative flex-1 overflow-hidden bg-slate-950/60 select-none
              ${addMode ? "cursor-crosshair" : "cursor-default"}`}
          >
            <img
              src={mapImage}
              alt={map.name}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                transition: "transform 0.25s ease",
              }}
              className="w-full h-full object-contain pointer-events-none"
            />

            {}
            {pins.map((pin) => (
              <div
                key={pin.id}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-full group"
              >
                {}
                <div
                  onMouseDown={isGM ? (e) => handlePinMouseDown(e, pin.id, "pin") : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    const next = pin.id === selectedPin ? null : pin.id;
                    setSelectedPin(next);
                    setEditingPin(null);
                    if (next) {
                      setZoom(2.5);
                      setZoomOrigin({ x: pin.x, y: pin.y });
                    } else {
                      setZoom(1);
                    }
                  }}
                  className={`flex flex-col items-center ${isGM ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                >
                  {}
                  <div className={`w-9 h-9 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-lg transition-all
                    ${selectedPin === pin.id ? "border-amber-400 scale-110" : "border-amber-700/60 hover:border-amber-500"}`}
                  >
                    {pin.image
                      ? <img src={pin.image} className="w-full h-full object-cover" alt={pin.name} />
                      : <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-amber-400" />
                        </div>
                    }
                  </div>
                  {}
                  <div className="w-0.5 h-2 bg-amber-500/70" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
                </div>

                {}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
                  <span className="text-xs bg-slate-900/90 border border-slate-700 text-amber-300 px-1.5 py-0.5">
                    {pin.name}
                  </span>
                </div>
              </div>
            ))}

            {}
            {tokens.map((token) => {
             
              const isNPC = !token.characterId && !!token.name;
              
              let charName = "";
              let canMove = isGM;
              let borderClass = "border-indigo-400";
              let textClass = "text-indigo-300";

              if (isNPC) {
                charName = token.name!;
                borderClass = token.isEnemy ? "border-red-500" : "border-emerald-500";
                textClass = token.isEnemy ? "text-red-300" : "text-emerald-300";
              } else {
                const char = mockCharacters.find((c) => c.id === token.characterId);
                if (!char) return null;
                charName = char.name;
                const owner = mockUsers.find((u) => u.characterIds.includes(char.id));
                if (isGM || currentUser?.id === owner?.id) {
                  canMove = true;
                }
              }

              return (
                <div
                  key={token.id}
                  style={{ left: `${token.x}%`, top: `${token.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                >
                  <div
                    onMouseDown={canMove ? (e) => handlePinMouseDown(e, token.id, "token") : undefined}
                    className={`w-10 h-10 rounded-full border-2 ${borderClass} bg-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110
                      ${canMove ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                  >
                    <span className={`text-sm font-bold ${textClass}`}>{charName.charAt(0)}</span>
                  </div>
                  {}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={`text-xs bg-slate-900/90 border border-slate-700 ${textClass} px-1.5 py-0.5 rounded`}>
                      {charName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <label className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-950/30 border-2 border-dashed border-slate-700/60 hover:border-amber-700/40 transition-colors cursor-pointer m-4">
            <Map className="w-10 h-10 text-slate-700" />
            <div className="text-center">
              <p className="text-slate-500 text-sm">Nenhum mapa carregado</p>
              <p className="text-slate-600 text-xs mt-1">Clique para carregar uma imagem</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleMapFile} />
          </label>
        )}
        {activePin && (
          <div className="w-56 shrink-0 border-l border-amber-700/20 bg-slate-900/70 flex flex-col">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold">Subárea</span>
              <button onClick={() => setSelectedPin(null)} className="text-slate-600 hover:text-slate-300 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {}
              <div className="relative">
                {activePin.image
                  ? <img src={activePin.image} className="w-full aspect-video object-cover border border-slate-700" alt={activePin.name} />
                  : <div className="w-full aspect-video bg-slate-800/60 border border-slate-700 flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                      <span className="text-xs text-slate-600">Sem imagem</span>
                    </div>
                }
                {isGM && (
                  <label className="absolute bottom-1 right-1 flex items-center gap-1 px-2 py-1 text-xs bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-600/50 transition-colors cursor-pointer">
                    <Upload className="w-3 h-3" />
                    Imagem
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePinImage(activePin.id, e)} />
                  </label>
                )}
              </div>

              {isGM ? (
                editingPin === activePin.id ? (
                  <div className="space-y-2">
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(activePin.id); if (e.key === "Escape") setEditingPin(null); }}
                      className="w-full bg-slate-800 border border-amber-600/50 text-slate-200 text-sm px-2 py-1.5 outline-none"
                    />
                    <button
                      onClick={() => confirmEdit(activePin.id)}
                      className="w-full py-1 text-xs bg-amber-900/40 border border-amber-600/50 text-amber-300 hover:bg-amber-900/60 transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingPin(activePin.id); setDraftName(activePin.name); }}
                    className="w-full text-left px-2 py-1.5 border border-slate-700 text-slate-200 text-sm hover:border-amber-600/50 transition-colors flex items-center gap-2"
                  >
                    <GripVertical className="w-3 h-3 text-slate-600 shrink-0" />
                    {activePin.name}
                  </button>
                )
              ) : (
                <p className="px-2 py-1.5 text-slate-200 text-sm font-medium">{activePin.name}</p>
              )}

              {}
              {isGM && (
                <button
                  onClick={() => removePin(activePin.id)}
                  className="w-full py-1.5 text-xs border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-3 h-3" />
                  Remover ponto
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function MapExplorer({ character, isGM }: { character: Character; isGM: boolean }) {
  const maps = character.maps || [];
  const [selectedMapId, setSelectedMapId] = useState(maps[0]?.id ?? null);

  const selectedMap = maps.find((m) => m.id === selectedMapId) ?? null;

  if (maps.length === 0) {
    return <p className="text-slate-600 italic text-sm">Nenhum mapa disponível.</p>;
  }

  return (
    <div className="grid grid-cols-[180px_1fr] border-2 border-amber-700/30 min-h-[500px]">
      {}
      <div className="border-r-2 border-amber-700/30 bg-slate-950/60 flex flex-col">
        <div className="px-4 py-3 border-b border-amber-700/20 flex items-center gap-2">
          <Map className="w-4 h-4 text-amber-500" />
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Regiões</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {maps.map((map) => (
            <button
              key={map.id}
              onClick={() => setSelectedMapId(map.id)}
              className={`w-full text-left px-4 py-4 border-b border-slate-800/60 flex items-center justify-between gap-2 transition-colors group border-l-2
                ${selectedMapId === map.id
                  ? "border-l-amber-500 bg-amber-900/30"
                  : "border-l-transparent hover:bg-slate-800/40"
                }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className={`w-4 h-4 shrink-0 ${selectedMapId === map.id ? "text-amber-400" : "text-slate-500 group-hover:text-amber-600"}`} />
                <span className={`text-sm font-medium truncate ${selectedMapId === map.id ? "text-amber-300" : "text-slate-300"}`}>
                  {map.name}
                </span>
              </div>
              <ChevronRight className={`w-3 h-3 shrink-0 ${selectedMapId === map.id ? "text-amber-500" : "text-slate-600"}`} />
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {selectedMap
          ? <MapCanvas key={selectedMap.id} map={selectedMap} isGM={isGM} />
          : <div className="flex items-center justify-center text-slate-600 text-sm">Selecione uma região</div>
        }
      </div>
    </div>
  );
}


function KnownNPCs({ character }: { character: Character }) {
  const allNpcs = (character.maps || []).flatMap((m) =>
    (m.subAreas || []).flatMap((sa) =>
      (sa.npcs || []).map((npc) => ({ ...npc, mapName: m.name, subAreaName: sa.name }))
    )
  );

  if (allNpcs.length === 0) {
    return <p className="text-slate-600 italic text-sm">Nenhum NPC conhecido.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {allNpcs.map((npc) => (
        <div key={npc.id} className="bg-slate-800/50 border border-amber-700/20 p-5 hover:border-amber-600/40 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-amber-300 font-medium text-lg">{npc.name}</h4>
            <span className="shrink-0 text-xs px-2 py-1 bg-slate-900/60 border border-slate-600 text-slate-400">{npc.role}</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">{npc.description}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3 h-3" />
            <span>{npc.mapName} › {npc.subAreaName}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CharacterPanel({ character, isGM = false, onUpdateCharacter }: CharacterPanelProps) {
  const [activeTab, setActiveTab] = useState("map");
  const [inventory, setInventory] = useState<Item[]>([...(character.inventory || [])]);
  const [testIdx, setTestIdx] = useState(0);
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    setInventory([...(character.inventory || [])]);
  }, [character.inventory]);

  const isFull = inventory.length >= MAX_INVENTORY;

  const discard = (id: string) => setInventory((prev) => prev.filter((i) => i.id !== id));

  const addTestItem = () => {
    if (isFull) return;
    const base = TEST_ITEMS[testIdx % TEST_ITEMS.length];
    setInventory((prev) => [...prev, { ...base, id: crypto.randomUUID() }]);
    setTestIdx((n) => n + 1);
  };

  const onDragStart = (index: number) => { dragIndex.current = index; };
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(index);
  };
  const onDrop = (index: number) => {
    if (dragIndex.current === null || dragIndex.current === index) { setDragOver(null); return; }
    setInventory((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex.current!, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndex.current = null;
    setDragOver(null);
  };

  return (
    <div className="bg-slate-900/50 border-2 border-amber-700/30">
      {}
      <div className="p-6 border-b-2 border-slate-800">
        {}
        <div className="flex items-start justify-between gap-6 mb-5">
          <div>
            <h2 className="text-3xl text-amber-300 font-serif mb-2">{character.name}</h2>
            <div className="flex gap-6 text-slate-300">
              <span><span className="text-amber-400 text-sm uppercase tracking-wider">Classe</span><br />{character.class}</span>
              <span><span className="text-amber-400 text-sm uppercase tracking-wider">Nível</span><br />{character.level}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-2 justify-end mb-2">
              <div className="flex items-center gap-1 mr-4 bg-amber-900/30 px-2 py-1 border border-amber-700/50 rounded text-amber-400">
                <span className="text-xs font-bold">{character.gold || 0}</span>
                <span className="text-xs uppercase tracking-widest">Ouro</span>
              </div>
              <Backpack className="w-4 h-4 text-amber-600" />
              <span className={`text-xs font-semibold uppercase tracking-widest ${isFull ? "text-red-400" : "text-amber-600"}`}>
                {inventory.length}/{MAX_INVENTORY}
              </span>
              {isGM && (
                <button
                  onClick={addTestItem}
                  disabled={isFull}
                  title="Adicionar item de teste"
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-600/50 hover:text-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FlaskRound className="w-3.5 h-3.5" />
                  Teste
                </button>
              )}
            </div>
            {}
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-amber-500"}`}
                style={{ width: `${(inventory.length / MAX_INVENTORY) * 100}%` }}
              />
            </div>
            {isFull && <p className="text-xs text-red-400 mt-1">Mochila cheia</p>}
          </div>
        </div>

        {}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {inventory.map((item, index) => {
            const meta = getRarityMeta(item.rarity);
            const isUltimato = item.rarity === "Ultimato";
            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={() => onDrop(index)}
                onDragEnd={() => setDragOver(null)}
                className={`p-4 border-2 transition-all cursor-grab active:cursor-grabbing group relative
                  ${dragOver === index ? "scale-[1.02] brightness-125" : "hover:brightness-110"}
                  ${isUltimato ? "rarity-ultimato-card border-transparent" : meta.card}`}
              >
                {}
                <button
                  onClick={() => discard(item.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-900/80 border border-red-900/50 text-red-400 hover:bg-red-900/30"
                  title="Descartar"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="flex items-start justify-between gap-2 mb-2 pr-6">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="opacity-60 shrink-0">{itemTypeIcon(item.type)}</span>
                    {isUltimato
                      ? <h3 className="rarity-ultimato-text font-medium leading-tight truncate">{item.name}</h3>
                      : <h3 className="text-slate-100 font-medium leading-tight truncate">{item.name}</h3>
                    }
                  </div>
                  <span className="text-xs px-1.5 py-0.5 bg-slate-900/60 border border-slate-700 text-slate-400 shrink-0">
                    ×{item.quantity}
                  </span>
                </div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-xs px-1.5 py-0.5 bg-slate-900/60 border border-slate-600 text-slate-400">{item.type}</span>
                  {isUltimato
                    ? <span className="rarity-ultimato-text text-xs px-1.5 py-0.5 font-semibold">{item.rarity}</span>
                    : <span className={`text-xs px-1.5 py-0.5 border font-semibold ${meta.badge}`}>{item.rarity}</span>
                  }
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
              </div>
            );
          })}

          {}
          {Array.from({ length: MAX_INVENTORY - inventory.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              onDragOver={(e) => onDragOver(e, inventory.length + i)}
              onDrop={() => onDrop(inventory.length)}
              className={`p-4 border-2 border-dashed border-slate-800/60 min-h-[80px] transition-colors
                ${dragOver === inventory.length + i ? "border-amber-700/50 bg-amber-900/10" : ""}`}
            />
          ))}
        </div>
      </div>

      {}
      <div className="p-6">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-2 mb-5 border-b-2 border-slate-800 pb-2">
            <Tabs.Trigger
              value="map"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors data-[state=active]:bg-amber-900/30 data-[state=active]:border-amber-500 text-sm"
            >
              <Map className="w-4 h-4" />
              Mapa
            </Tabs.Trigger>
            <Tabs.Trigger
              value="npcs"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors data-[state=active]:bg-amber-900/30 data-[state=active]:border-amber-500 text-sm"
            >
              <Users className="w-4 h-4" />
              NPCs Conhecidos
            </Tabs.Trigger>
            <Tabs.Trigger
              value="rolls"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors data-[state=active]:bg-amber-900/30 data-[state=active]:border-amber-500 text-sm"
            >
              <Dices className="w-4 h-4" />
              Rolagens
            </Tabs.Trigger>
            <Tabs.Trigger
              value="market"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors data-[state=active]:bg-amber-900/30 data-[state=active]:border-amber-500 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Mercado
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="map" className="outline-none">
            <MapExplorer character={character} isGM={isGM} />
          </Tabs.Content>
          <Tabs.Content value="npcs" className="outline-none">
            <KnownNPCs character={character} />
          </Tabs.Content>
          <Tabs.Content value="rolls" className="outline-none">
            <DiceRollerWidget rollerName={character.name} isGM={isGM} />
          </Tabs.Content>
          <Tabs.Content value="market" className="outline-none">
            {onUpdateCharacter ? (
              <Market character={character} onUpdateCharacter={onUpdateCharacter} />
            ) : (
              <p className="text-slate-500 text-sm">O mercado não está disponível para o Mestre aqui.</p>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
