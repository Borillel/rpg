import React, { useState, useEffect } from "react";
import { Dices, RotateCcw } from "lucide-react";

export type DiceRoll = {
  id: string;
  dice: string;
  result: number;
  timestamp: string;
  rollerName: string;
};

interface DiceRollerWidgetProps {
  rollerName: string;
  isGM?: boolean;
}

export const DiceRollerWidget = ({ rollerName, isGM }: DiceRollerWidgetProps) => {
  const [history, setHistory] = useState<DiceRoll[]>([]);

  const fetchRolls = async () => {
    try {
      const res = await fetch("http://localhost:3001/rolls?_sort=timestamp&_order=desc&_limit=20");
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error("Falha ao buscar rolagens", e);
    }
  };

  useEffect(() => {
    fetchRolls();
    const interval = setInterval(fetchRolls, 2000); 
    return () => clearInterval(interval);
  }, []);

  const rollDice = async (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    
    const newRoll = {
      id: crypto.randomUUID(),
      dice: `d${sides}`,
      result,
      timestamp: new Date().toISOString(),
      rollerName,
    };
    
    setHistory((prev) => [newRoll, ...prev].slice(0, 20));

    try {
      await fetch("http://localhost:3001/rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoll),
      });
    } catch (e) {
      console.error("Failed to post roll", e);
    }
  };

  const clearHistory = async () => {
    if (!isGM) return;
    try {
      setHistory([]);
    } catch (e) {
      console.error("Failed to clear", e);
    }
  };

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  return (
    <div className="bg-slate-900 border border-slate-700 p-4 w-full flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-amber-400 font-serif text-lg flex items-center gap-2">
          <Dices size={18} /> Ações e Rolagens
        </h3>
        {isGM && (
          <button onClick={clearHistory} className="text-slate-500 hover:text-red-400" title="Limpar UI">
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {diceTypes.map((sides) => (
          <button
            key={sides}
            onClick={() => rollDice(sides)}
            className="bg-slate-800 hover:bg-amber-600 transition-colors border border-slate-700 hover:border-amber-400 py-2 rounded flex flex-col items-center group"
          >
            <span className="font-bold text-slate-300 group-hover:text-white text-sm">d{sides}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-slate-500 text-xs italic text-center mt-4">Nenhuma rolagem registrada.</p>
        ) : (
          history.map((roll) => (
            <div key={roll.id} className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-amber-500 text-xs font-bold mr-2">{roll.rollerName}</span>
                <span className="text-slate-400 text-[10px]">{new Date(roll.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs uppercase bg-slate-800 px-1 rounded">{roll.dice}</span>
                <span className="text-amber-400 font-bold w-6 text-right">{roll.result}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
