import { useState, useEffect } from "react";
import { Item, Character } from "../types";
import { itemRepository, characterRepository } from "../repositories";
import { ShoppingCart, Coins, PackagePlus, PackageMinus } from "lucide-react";
import { BaseItemPricing, HeroDiscountDecorator, GuildTaxDecorator, IPricing } from "../patterns/PricingDecorator";

interface MarketProps {
  character: Character;
  onUpdateCharacter: (updated: Character) => void;
}

export function Market({ character, onUpdateCharacter }: MarketProps) {
  const [shopItems, setShopItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemRepository.getAll().then((items) => {
      setShopItems(items);
      setLoading(false);
    });
  }, []);

 
  const getDynamicPricing = (item: Item): IPricing => {
    let pricing: IPricing = new BaseItemPricing(item.price || 0, item.name);
    
   
    if (character.level > 10) {
      pricing = new HeroDiscountDecorator(pricing);
    } else {
     
      pricing = new GuildTaxDecorator(pricing);
    }

    return pricing;
  };

  const handleBuy = async (item: Item) => {
    const pricing = getDynamicPricing(item);
    const finalPrice = pricing.getPrice();
    
    const gold = character.gold || 0;
    if (gold < finalPrice) {
      alert("Ouro insuficiente para pagar " + finalPrice + " moedas!");
      return;
    }
    
    const newInventory = [...character.inventory];
    const existing = newInventory.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      newInventory.push({ ...item, quantity: 1 });
    }

    const updatedCharacter = {
      ...character,
      gold: gold - finalPrice,
      inventory: newInventory
    };

    try {
      const res = await characterRepository.update(character.id, updatedCharacter);
      onUpdateCharacter(res);
      alert(`Você comprou ${pricing.getDescription()} por ${finalPrice} ouro!`);
    } catch (e) {
      alert("Erro ao comprar item.");
    }
  };

  const handleSell = async (item: Item) => {
    const sellPrice = Math.floor((item.price || 10) / 2);
    const gold = character.gold || 0;
    
    const newInventory = [...character.inventory];
    const existingIdx = newInventory.findIndex(i => i.id === item.id);
    if (existingIdx === -1) return;
    
    if (newInventory[existingIdx].quantity > 1) {
      newInventory[existingIdx].quantity -= 1;
    } else {
      newInventory.splice(existingIdx, 1);
    }

    const updatedCharacter = {
      ...character,
      gold: gold + sellPrice,
      inventory: newInventory
    };

    try {
      const res = await characterRepository.update(character.id, updatedCharacter);
      onUpdateCharacter(res);
      alert(`Você vendeu ${item.name} por ${sellPrice} ouro!`);
    } catch (e) {
      alert("Erro ao vender item.");
    }
  };

  if (loading) return <div className="p-4 text-slate-400">Carregando mercado...</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {}
      <div className="bg-slate-800/50 border border-amber-700/20 p-5 rounded">
        <h3 className="text-amber-300 font-medium text-lg mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" /> Loja do Aventureiro
        </h3>
        <p className="text-xs text-slate-400 mb-3">Preços dinâmicos afetados por seus títulos e nível.</p>
        <div className="space-y-3">
          {shopItems.map(item => {
            const pricing = getDynamicPricing(item);
            return (
              <div key={item.id} className="flex flex-col bg-slate-900/60 p-3 border border-slate-700 rounded gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 flex flex-col items-end gap-0.5 text-sm">
                      <div className="flex items-center gap-1 font-bold">
                        {pricing.getPrice()} <Coins className="w-3 h-3" />
                      </div>
                    </span>
                    <button 
                      data-testid={`buy-${item.id}`}
                      onClick={() => handleBuy(item)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-amber-50 text-xs flex items-center gap-1 rounded transition-colors"
                    >
                      <PackagePlus className="w-3 h-3" /> Comprar
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-amber-600/70 text-right">
                  {pricing.getDescription()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="bg-slate-800/50 border border-amber-700/20 p-5 rounded">
        <h3 className="text-amber-300 font-medium text-lg mb-4 flex items-center gap-2">
          <PackageMinus className="w-5 h-5" /> Seu Inventário (Venda)
        </h3>
        <p className="text-xs text-slate-400 mb-3">Itens são vendidos pela metade do preço base.</p>
        <div className="space-y-3">
          {character.inventory.map((item, idx) => {
             const sellPrice = Math.floor((item.price || 10) / 2);
             return (
              <div key={`${item.id}-${idx}`} className="flex items-center justify-between bg-slate-900/60 p-3 border border-slate-700 rounded">
                <div>
                  <p className="text-slate-200 font-medium">{item.name} (x{item.quantity})</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 flex items-center gap-1 text-sm font-bold">
                    +{sellPrice} <Coins className="w-3 h-3" />
                  </span>
                  <button 
                    data-testid={`sell-${item.id}`}
                    onClick={() => handleSell(item)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs flex items-center gap-1 rounded transition-colors"
                  >
                    Vender
                  </button>
                </div>
              </div>
             )
          })}
          {character.inventory.length === 0 && (
            <p className="text-slate-500 text-sm">Inventário vazio.</p>
          )}
        </div>
      </div>
    </div>
  );
}
