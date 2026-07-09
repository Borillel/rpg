export interface GameEvent {
  id: string;
  title: string;
  type: "missão" | "encontro" | "descoberta" | "comercial";
  status: "ativo" | "concluído" | "pendente";
  description: string;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  rarity: string;
  quantity: number;
  description: string;
  price?: number;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface SubArea {
  id: string;
  name: string;
  description: string;
  npcs: NPC[];
}

export interface MapScript {
  terrain: string;
  climate: string;
  size: string;
  features: string[];
  encounters: string[];
  atmosphere: string;
  generationNotes: string;
}

export interface MapToken {
  id: string;
  mapId: string;
  characterId?: string;
  name?: string;
  isEnemy?: boolean;
  x: number;
  y: number;
}

export interface Map {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  subAreas: SubArea[];
  script: MapScript;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  gold?: number;
  inventory: Item[];
  maps: Map[];
  events: GameEvent[];
}

export interface UserProfile {
  id: string;
  name: string;
  role: "player" | "gm";
  characterIds: string[];
  avatar: string;
}
