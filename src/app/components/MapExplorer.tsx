import { useState } from "react";
import { mockCharacters } from "../data/mockData";
import { SubArea } from "../types";
import { Map, MapPin, Users, ChevronRight, Scroll, User } from "lucide-react";

export function MapExplorer() {
  const [selectedCharacterId, setSelectedCharacterId] = useState(mockCharacters[0].id);

  const character = mockCharacters.find((c) => c.id === selectedCharacterId)!;

  const [selectedMapId, setSelectedMapId] = useState(character.maps[0]?.id ?? null);
  const [selectedSubArea, setSelectedSubArea] = useState<SubArea | null>(
    character.maps[0]?.subAreas[0] ?? null
  );

  const selectedMap = character.maps.find((m) => m.id === selectedMapId) ?? null;

  const handleSelectCharacter = (charId: string) => {
    setSelectedCharacterId(charId);
    const char = mockCharacters.find((c) => c.id === charId)!;
    const firstMap = char.maps[0] ?? null;
    setSelectedMapId(firstMap?.id ?? null);
    setSelectedSubArea(firstMap?.subAreas[0] ?? null);
  };

  const handleSelectMap = (mapId: string) => {
    setSelectedMapId(mapId);
    const map = character.maps.find((m) => m.id === mapId);
    setSelectedSubArea(map?.subAreas[0] ?? null);
  };

  return (
    <div className="bg-slate-900/50 border-2 border-amber-700/30">
      {}
      <div className="border-b-2 border-amber-700/30 px-6 py-3 flex items-center gap-3 bg-slate-950/40">
        <User className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold mr-2">Personagem</span>
        <div className="flex gap-2">
          {mockCharacters.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCharacter(c.id)}
              className={`px-4 py-1.5 text-sm border transition-colors
                ${selectedCharacterId === c.id
                  ? "bg-amber-900/40 border-amber-500 text-amber-300"
                  : "bg-slate-800/50 border-amber-700/30 text-slate-400 hover:border-amber-600/50 hover:text-slate-200"
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="grid grid-cols-[200px_240px_1fr] min-h-[520px]">
        {}
        <div className="border-r-2 border-amber-700/30 bg-slate-950/60 flex flex-col">
          <div className="px-4 py-3 border-b border-amber-700/20 flex items-center gap-2">
            <Map className="w-4 h-4 text-amber-500" />
            <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Regiões</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {character.maps.length === 0 && (
              <div className="p-4 text-slate-600 text-sm italic">Sem mapas disponíveis.</div>
            )}
            {character.maps.map((map) => (
              <button
                key={map.id}
                onClick={() => handleSelectMap(map.id)}
                className={`w-full text-left px-4 py-4 border-b border-slate-800/60 flex items-center justify-between gap-2 transition-colors group
                  ${selectedMapId === map.id
                    ? "bg-amber-900/30 border-l-2 border-l-amber-500"
                    : "hover:bg-slate-800/40 border-l-2 border-l-transparent"
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
        <div className="border-r-2 border-amber-700/30 bg-slate-900/40 flex flex-col">
          <div className="px-4 py-3 border-b border-amber-700/20 flex items-center gap-2">
            <Scroll className="w-4 h-4 text-amber-500" />
            <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Subáreas</span>
          </div>
          {selectedMap ? (
            <>
              <div className="px-4 py-3 border-b border-slate-800/60">
                <p className="text-xs text-slate-400 leading-relaxed">{selectedMap.description}</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {selectedMap.subAreas.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubArea(sub)}
                    className={`w-full text-left px-4 py-4 border-b border-slate-800/60 transition-colors group
                      ${selectedSubArea?.id === sub.id
                        ? "bg-amber-900/20 border-l-2 border-l-amber-500"
                        : "hover:bg-slate-800/30 border-l-2 border-l-transparent"
                      }`}
                  >
                    <span className={`block text-sm font-medium mb-1 truncate ${selectedSubArea?.id === sub.id ? "text-amber-300" : "text-slate-300 group-hover:text-slate-100"}`}>
                      {sub.name}
                    </span>
                    <span className="block text-xs text-slate-500 line-clamp-2">{sub.description}</span>
                    {sub.npcs.length > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                        <Users className="w-3 h-3" />
                        <span>{sub.npcs.length} NPC{sub.npcs.length > 1 ? "s" : ""}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
              Selecione uma região
            </div>
          )}
        </div>

        {}
        <div className="bg-slate-900/20 flex flex-col">
          <div className="px-5 py-3 border-b border-amber-700/20 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">NPCs da Subárea</span>
          </div>

          {selectedSubArea ? (
            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-5">
                <h4 className="text-lg text-amber-300 font-serif mb-1">{selectedSubArea.name}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{selectedSubArea.description}</p>
              </div>

              {selectedSubArea.npcs.length > 0 ? (
                <div className="space-y-4">
                  {selectedSubArea.npcs.map((npc) => (
                    <div
                      key={npc.id}
                      className="bg-slate-800/50 border border-amber-700/20 p-4 hover:border-amber-600/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h5 className="text-amber-300 font-medium">{npc.name}</h5>
                        <span className="shrink-0 text-xs px-2 py-1 bg-slate-900/60 border border-slate-600 text-slate-400">
                          {npc.role}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{npc.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-600 text-sm italic">Nenhum NPC nesta subárea.</div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
              Selecione uma subárea
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
