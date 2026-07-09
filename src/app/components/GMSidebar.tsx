import * as Accordion from "@radix-ui/react-accordion";
import { Users, Map, MapPin, ChevronDown, CalendarDays, Dices, Swords, Star, Compass, ShoppingBag } from "lucide-react";
import { mockCharacters, mockUsers } from "../data/mockData";
import { GameEvent } from "../types";
import { DiceRollerWidget } from "./DiceRoller";

const statusColors: Record<GameEvent["status"], string> = {
  ativo: "text-green-400 border-green-700/50 bg-green-900/20",
  concluído: "text-slate-400 border-slate-600 bg-slate-800/30",
  pendente: "text-amber-400 border-amber-700/50 bg-amber-900/20",
};

const eventTypeIcon: Record<GameEvent["type"], React.ReactNode> = {
  missão: <Swords className="w-3 h-3" />,
  encontro: <Star className="w-3 h-3" />,
  descoberta: <Compass className="w-3 h-3" />,
  comercial: <ShoppingBag className="w-3 h-3" />,
};

export function GMSidebar({ selectedCharacterId }: { selectedCharacterId: string }) {
  const allNpcs = mockCharacters.flatMap((char) =>
    char.maps.flatMap((m) =>
      m.subAreas.flatMap((sa) =>
        sa.npcs.map((npc) => ({
          ...npc,
          characterName: char.name,
          mapName: m.name,
          subAreaName: sa.name,
        }))
      )
    )
  );

  const character = mockCharacters.find((c) => c.id === selectedCharacterId);
  const allEvents = mockCharacters.flatMap((char) =>
    char.events.map((ev) => ({ ...ev, characterName: char.name }))
  );

  return (
    <aside className="w-80 shrink-0 bg-slate-900/60 border-l-2 border-amber-700/20 overflow-y-auto">
      <Accordion.Root type="multiple" defaultValue={["rolls", "players", "npcs", "events"]}>

        <Accordion.Item value="rolls" className="border-b border-slate-800">
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors group">
              <div className="flex items-center gap-2 text-amber-500">
                <Dices className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-semibold">Ações em Tempo Real</span>
              </div>
              <ChevronDown className="w-4 h-4 text-amber-600 transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4 pt-2 space-y-2 h-[350px]">
             <DiceRollerWidget rollerName="Mestre" isGM={true} />
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="players" className="border-b border-slate-800">
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors group">
              <div className="flex items-center gap-2 text-amber-500">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-semibold">Jogadores</span>
              </div>
              <ChevronDown className="w-4 h-4 text-amber-600 transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 pb-4 pt-2 space-y-2">
            {mockUsers.filter((u) => u.role === "player").map((user) => {
              const chars = mockCharacters.filter((c) => user.characterIds.includes(c.id));
              return (
                <div key={user.id} className="px-3 py-3 bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-slate-700 border border-amber-700/40 flex items-center justify-center text-xs font-serif text-amber-300">
                      {user.avatar}
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{user.name}</span>
                  </div>
                  {chars.map((c) => (
                    <div key={c.id} className="text-xs text-slate-400 ml-9">
                      {c.name} · {c.class} Nível {c.level}
                    </div>
                  ))}
                </div>
              );
            })}
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="npcs" className="border-b border-slate-800">
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors group">
              <div className="flex items-center gap-2 text-amber-500">
                <Map className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-semibold">Todos os NPCs</span>
              </div>
              <ChevronDown className="w-4 h-4 text-amber-600 transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 pb-4 pt-2 space-y-2">
            {allNpcs.map((npc) => (
              <div key={npc.id} className="px-3 py-2 bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm text-amber-300 font-medium">{npc.name}</span>
                  <span className="shrink-0 text-xs px-1.5 py-0.5 bg-slate-900/60 border border-slate-600 text-slate-400">
                    {npc.role}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <MapPin className="w-3 h-3" />
                  <span>{npc.characterName} · {npc.mapName} › {npc.subAreaName}</span>
                </div>
              </div>
            ))}
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="events">
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors group">
              <div className="flex items-center gap-2 text-amber-500">
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-semibold">Todos os Eventos</span>
              </div>
              <ChevronDown className="w-4 h-4 text-amber-600 transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 pb-4 pt-2 space-y-2">
            {allEvents.map((ev) => (
              <div key={ev.id} className="px-3 py-3 bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-1 mb-1">
                  <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 border rounded-sm ${statusColors[ev.status]}`}>
                    {eventTypeIcon[ev.type]}
                    {ev.type}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 border rounded-sm ${statusColors[ev.status]}`}>
                    {ev.status}
                  </span>
                </div>
                <div className="text-sm text-amber-300 font-medium mb-1">{ev.title}</div>
                <div className="text-xs text-slate-500 mb-1">{ev.characterName}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{ev.description}</p>
              </div>
            ))}
          </Accordion.Content>
        </Accordion.Item>

      </Accordion.Root>
    </aside>
  );
}
