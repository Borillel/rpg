import { useState, useEffect } from "react";
import { UserProfile, Character, Item } from "../types";
import { userRepository, characterRepository, itemRepository } from "../repositories";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"users" | "characters" | "items">("items");

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      <h2 className="text-2xl font-serif text-amber-400 mb-6">Painel de Administração (CRUDs) - Mestre</h2>
      <div className="flex gap-4 border-b border-slate-700 mb-6">
        <button 
          onClick={() => setActiveTab("items")}
          className={`pb-2 ${activeTab === "items" ? "border-b-2 border-amber-500 text-amber-300" : "text-slate-400 hover:text-slate-200"}`}
        >
          Itens
        </button>
        <button 
          onClick={() => setActiveTab("characters")}
          className={`pb-2 ${activeTab === "characters" ? "border-b-2 border-amber-500 text-amber-300" : "text-slate-400 hover:text-slate-200"}`}
        >
          Personagens
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          className={`pb-2 ${activeTab === "users" ? "border-b-2 border-amber-500 text-amber-300" : "text-slate-400 hover:text-slate-200"}`}
        >
          Usuários
        </button>
      </div>

      {activeTab === "items" && <ItemsCRUD />}
      {activeTab === "characters" && <CharactersCRUD />}
      {activeTab === "users" && <UsersCRUD />}
    </div>
  );
}

function ItemsCRUD() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(10);

  const fetchItems = () => itemRepository.getAll().then(setItems);
  useEffect(() => { fetchItems(); }, []);

  const handleCreate = async () => {
    if (!name) return;
    await itemRepository.create({ 
      id: crypto.randomUUID(), 
      name, 
      price, 
      type: "Consumível", 
      rarity: "Comum", 
      quantity: 1, 
      description: "Novo item adicionado pelo GM." 
    });
    setName("");
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await itemRepository.delete(id);
    fetchItems();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input 
          placeholder="Nome do Item" 
          value={name} onChange={e => setName(e.target.value)}
          className="px-3 py-1 bg-slate-800 border border-slate-600 rounded"
        />
        <input 
          type="number" placeholder="Preço" 
          value={price} onChange={e => setPrice(Number(e.target.value))}
          className="px-3 py-1 bg-slate-800 border border-slate-600 rounded w-24"
        />
        <button onClick={handleCreate} className="px-4 py-1 bg-amber-600 hover:bg-amber-500 text-amber-50 rounded">
          Adicionar
        </button>
      </div>

      <table className="w-full text-left border-collapse border border-slate-700">
        <thead>
          <tr className="bg-slate-800">
            <th className="p-2 border border-slate-700">ID</th>
            <th className="p-2 border border-slate-700">Nome</th>
            <th className="p-2 border border-slate-700">Preço</th>
            <th className="p-2 border border-slate-700 w-24">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="hover:bg-slate-800/50">
              <td className="p-2 border border-slate-700 text-xs text-slate-400">{item.id}</td>
              <td className="p-2 border border-slate-700">{item.name}</td>
              <td className="p-2 border border-slate-700">{item.price} ouro</td>
              <td className="p-2 border border-slate-700">
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 text-sm">
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CharactersCRUD() {
  const [chars, setChars] = useState<Character[]>([]);
  useEffect(() => { characterRepository.getAll().then(setChars); }, []);

  return (
    <div>
      <p className="text-slate-400 mb-4">Apenas modo de visualização implementado para demonstração.</p>
      <table className="w-full text-left border-collapse border border-slate-700">
        <thead>
          <tr className="bg-slate-800">
            <th className="p-2 border border-slate-700">Nome</th>
            <th className="p-2 border border-slate-700">Classe</th>
            <th className="p-2 border border-slate-700">Nível</th>
            <th className="p-2 border border-slate-700">Ouro</th>
          </tr>
        </thead>
        <tbody>
          {chars.map(c => (
            <tr key={c.id} className="hover:bg-slate-800/50">
              <td className="p-2 border border-slate-700">{c.name}</td>
              <td className="p-2 border border-slate-700">{c.class}</td>
              <td className="p-2 border border-slate-700">{c.level}</td>
              <td className="p-2 border border-slate-700">{c.gold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersCRUD() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  useEffect(() => { userRepository.getAll().then(setUsers); }, []);

  return (
    <div>
      <p className="text-slate-400 mb-4">Apenas modo de visualização implementado para demonstração.</p>
      <table className="w-full text-left border-collapse border border-slate-700">
        <thead>
          <tr className="bg-slate-800">
            <th className="p-2 border border-slate-700">Nome</th>
            <th className="p-2 border border-slate-700">Role</th>
            <th className="p-2 border border-slate-700">Personagens</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-slate-800/50">
              <td className="p-2 border border-slate-700">{u.name}</td>
              <td className="p-2 border border-slate-700">{u.role}</td>
              <td className="p-2 border border-slate-700">{u.characterIds.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
