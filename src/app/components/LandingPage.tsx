import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sword, Shield, Scroll, Users } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbWVkaWV2YWwlMjBjYXN0bGV8ZW58MXx8fHwxNzgxODA2Mjk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Castelo medieval fantasy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-6xl md:text-8xl mb-6 font-serif text-amber-400">
            Realms of Destiny
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-300">
            Embarque em uma jornada épica através de reinos místicos, enfrente criaturas lendárias
            e forje seu próprio destino
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/entrar"
              className="inline-block bg-amber-600 hover:bg-amber-500 text-slate-950 px-12 py-4 text-lg transition-colors border-2 border-amber-400 shadow-lg shadow-amber-600/50 font-bold"
            >
              Entrar na Aventura
            </Link>
          </div>
        </div>
      </div>

      {}
      <div className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-16 text-amber-400 font-serif">
            Recursos do Reino
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/50 p-8 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors">
              <Sword className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl mb-3 text-amber-300">Personagens Únicos</h3>
              <p className="text-slate-400">
                Crie e gerencie múltiplos personagens, cada um com suas próprias habilidades e história.
              </p>
            </div>

            <div className="bg-slate-800/50 p-8 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors">
              <Shield className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl mb-3 text-amber-300">Inventário Completo</h3>
              <p className="text-slate-400">
                Gerencie armas, armaduras, poções e itens raros coletados em suas aventuras.
              </p>
            </div>

            <div className="bg-slate-800/50 p-8 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors">
              <Scroll className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl mb-3 text-amber-300">Mapas Expansivos</h3>
              <p className="text-slate-400">
                Explore vastos territórios, cada um com suas próprias subáreas e segredos para descobrir.
              </p>
            </div>

            <div className="bg-slate-800/50 p-8 border-2 border-amber-700/30 hover:border-amber-600/50 transition-colors">
              <Users className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl mb-3 text-amber-300">NPCs Detalhados</h3>
              <p className="text-slate-400">
                Interaja com personagens não-jogáveis únicos, cada um com sua própria história e propósito.
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-16 text-amber-400 font-serif">
            Crie Sua História
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1731937817165-1fed94fc03b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZm9yZXN0JTIwbWFnaWNhbHxlbnwxfHx8fDE3ODE4MDYyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Floresta mágica"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent flex items-end p-6">
                <h3 className="text-xl text-amber-300">Florestas Místicas</h3>
              </div>
            </div>

            <div className="relative overflow-hidden group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1508925831690-f33f79533e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdW5nZW9uJTIwZmFudGFzeSUyMGRhcmt8ZW58MXx8fHwxNzgxODA2Mjk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dungeon sombria"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent flex items-end p-6">
                <h3 className="text-xl text-amber-300">Masmorras Perigosas</h3>
              </div>
            </div>

            <div className="relative overflow-hidden group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1773432661163-351c473345e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHRhdmVybiUyMGludGVyaW9yfGVufDF8fHx8MTc4MTgwNjI5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Taverna medieval"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent flex items-end p-6">
                <h3 className="text-xl text-amber-300">Tavernas Acolhedoras</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <footer className="bg-slate-950 py-12 px-4 border-t border-amber-900/30">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p className="mb-4">© 2026 Realms of Destiny. Todos os direitos reservados.</p>
          <p className="text-sm">Embarque em sua jornada épica hoje mesmo.</p>
        </div>
      </footer>
    </div>
  );
}
