import { GameEvent, Item, NPC, SubArea, MapScript, Map, Character, UserProfile } from "../types";

export const mockUsers: UserProfile[] = [
  {
    id: "u1",
    name: "Thorin",
    role: "player",
    characterIds: ["1"],
    avatar: "T",
  },
  {
    id: "u2",
    name: "Selene",
    role: "player",
    characterIds: ["2"],
    avatar: "S",
  },
  {
    id: "u3",
    name: "Oryn",
    role: "player",
    characterIds: ["3"],
    avatar: "O",
  },
  {
    id: "gm",
    name: "Mestre",
    role: "gm",
    characterIds: [],
    avatar: "M",
  },
];

export const mockCharacters: Character[] = [
  {
    id: "1",
    name: "Aldric o Bravo",
    class: "Guerreiro",
    level: 15,
    inventory: [
      {
        id: "i1",
        name: "Espada Flamejante",
        type: "Arma",
        rarity: "Lendário",
        quantity: 1,
        description: "Uma espada antiga forjada nas chamas do dragão ancestral. Causa dano de fogo adicional."
      },
      {
        id: "i2",
        name: "Armadura de Placas Reforçada",
        type: "Armadura",
        rarity: "Raro",
        quantity: 1,
        description: "Armadura pesada que oferece proteção superior contra ataques físicos."
      },
      {
        id: "i3",
        name: "Poção de Cura Grande",
        type: "Consumível",
        rarity: "Comum",
        quantity: 5,
        description: "Restaura 100 pontos de vida instantaneamente."
      },
      {
        id: "i4",
        name: "Escudo do Guardião",
        type: "Escudo",
        rarity: "Épico",
        quantity: 1,
        description: "Escudo encantado que pode bloquear até ataques mágicos."
      },
      {
        id: "i12",
        name: "Pedra de Amolar Rúnica",
        type: "Consumível",
        rarity: "Incomum",
        quantity: 3,
        description: "Afiam armas com traços de magia rúnica, concedendo bônus temporário de dano por uma batalha."
      },
    ],
    maps: [
      {
        id: "m1",
        name: "Floresta Sombria",
        description: "Uma floresta densa e misteriosa, lar de criaturas antigas e segredos esquecidos.",
        imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600",
        script: {
          terrain: "Florestal denso",
          climate: "Temperado úmido",
          size: "Grande (12×12 zonas)",
          features: ["Rios sinuosos", "Árvores milenares", "Ruínas cobertas de musgo", "Tocas de criaturas"],
          encounters: ["Lobos sombrios (GD 3)", "Espíritos da floresta (GD 5)", "Bandidos emboscadores (GD 4)", "Golem de madeira (GD 7)"],
          atmosphere: "Sombrio e opressivo. Luz solar filtrada pela copa espessa. Sons constantes de folhas e galhos quebrando.",
          generationNotes: "Gere o mapa em camadas: primeiro o rio principal (diagonal NO→SE), depois trilhas secundárias ramificando a partir dele. Posicione as ruínas no quadrante NE com névoa permanente. A clareira do druida ocupa o centro do mapa e serve como ponto de referência seguro.",
        },
        subAreas: [
          {
            id: "sa1",
            name: "Clareira do Druida",
            description: "Uma clareira pacífica onde os druidas realizam seus rituais.",
            npcs: [
              {
                id: "npc1",
                name: "Druida Eldara",
                role: "Vendedora de Poções",
                description: "Uma druida sábia que conhece os segredos das plantas curativas. Oferece poções raras em troca de ingredientes da floresta."
              },
              {
                id: "npc2",
                name: "Caçador Grim",
                role: "Instrutor de Rastreamento",
                description: "Um caçador veterano que pode ensinar técnicas de rastreamento e sobrevivência na floresta."
              }
            ]
          },
          {
            id: "sa2",
            name: "Ruínas Antigas",
            description: "Restos de uma civilização esquecida, repleta de armadilhas e tesouros.",
            npcs: [
              {
                id: "npc3",
                name: "Espírito Guardião",
                role: "Guardião das Ruínas",
                description: "Um espírito ancestral que protege as ruínas. Pode revelar segredos aos dignos."
              }
            ]
          }
        ]
      },
      {
        id: "m2",
        name: "Montanhas Gélidas",
        description: "Picos nevados onde o frio é implacável e monstros de gelo vagam livremente.",
        imageUrl: "https://images.unsplash.com/photo-1517596565103-34e2c0e86202?auto=format&fit=crop&q=80&w=1600",
        script: {
          terrain: "Montanhoso nevado",
          climate: "Ártico severo",
          size: "Médio (8×8 zonas)",
          features: ["Picos cobertos de neve", "Cavernas de gelo", "Passagens estreitas", "Geleiras instáveis"],
          encounters: ["Gigantes do gelo (GD 9)", "Trolls árticos (GD 6)", "Banshees congelantes (GD 8)", "Ursos polares (GD 5)"],
          atmosphere: "Silêncio ensurdecedor quebrado apenas pelo vento uivante. Visibilidade reduzida por nevasca. Temperatura extremamente baixa penaliza movimento.",
          generationNotes: "Parta de um passo de montanha central (E-O) como via principal. Preencha os quadrantes com elevação crescente do sul ao norte. Coloque a Vila de Gelo no vale protegido ao sul. Marque zonas de avalanche nos declives íngremes.",
        },
        subAreas: [
          {
            id: "sa3",
            name: "Vila de Gelo",
            description: "Um pequeno assentamento de resistentes que sobrevivem ao frio extremo.",
            npcs: [
              {
                id: "npc4",
                name: "Ferreiro Bjorn",
                role: "Mestre Ferreiro",
                description: "Especialista em forjar armas de gelo. Suas criações são conhecidas em todo o reino."
              },
              {
                id: "npc5",
                name: "Xamã Freya",
                role: "Curandeira",
                description: "Uma xamã que domina magias de cura e proteção contra o frio."
              }
            ]
          }
        ]
      }
    ],
    events: [
      {
        id: "e1",
        title: "Defesa do Vilarejo",
        type: "missão",
        status: "ativo",
        description: "Aldeões pedem proteção contra um bando de orcs que ataca à noite. Recompensa: 500 moedas de ouro."
      },
      {
        id: "e2",
        title: "Encontro com o Dragão",
        type: "encontro",
        status: "concluído",
        description: "Aldric enfrentou e derrotou o dragão jovem Pyrax nas montanhas ao leste."
      },
      {
        id: "e3",
        title: "Artefato Perdido",
        type: "descoberta",
        status: "pendente",
        description: "Rumores de um artefato antigo enterrado sob as ruínas da Floresta Sombria."
      }
    ]
  },
  {
    id: "2",
    name: "Lyra das Sombras",
    class: "Ladina",
    level: 12,
    inventory: [
      {
        id: "i5",
        name: "Adagas Gêmeas",
        type: "Arma",
        rarity: "Raro",
        quantity: 2,
        description: "Par de adagas perfeitamente balanceadas para ataques rápidos e precisos."
      },
      {
        id: "i6",
        name: "Capa da Invisibilidade",
        type: "Armadura",
        rarity: "Lendário",
        quantity: 1,
        description: "Permite ao usuário ficar invisível por curtos períodos de tempo."
      },
      {
        id: "i7",
        name: "Kit de Arrombamento",
        type: "Ferramenta",
        rarity: "Comum",
        quantity: 1,
        description: "Conjunto completo de ferramentas para abrir fechaduras."
      },
      {
        id: "i13",
        name: "Lâmina do Fim dos Tempos",
        type: "Arma",
        rarity: "Ultimato",
        quantity: 1,
        description: "Forjada no colapso de uma estrela moribunda por entidades além da compreensão mortal. Corta não apenas carne e osso, mas o próprio destino — cada golpe apaga uma possibilidade do futuro da vítima para sempre."
      },
    ],
    maps: [
      {
        id: "m3",
        name: "Cidade Subterrânea",
        description: "Uma vasta rede de túneis e câmaras sob a cidade principal.",
        imageUrl: "https://images.unsplash.com/photo-1518357019504-8111bb1ce4c0?auto=format&fit=crop&q=80&w=1600",
        script: {
          terrain: "Subterrâneo urbano",
          climate: "Abafado e úmido",
          size: "Enorme (16×10 zonas)",
          features: ["Túneis ramificados", "Câmaras secretas", "Aquedutos antigos", "Armadilhas mecânicas"],
          encounters: ["Ratos gigantes (GD 2)", "Ladrões da guilda (GD 4)", "Golem de pedra guardião (GD 8)", "Assassino élfico (GD 6)"],
          atmosphere: "Barulho distante de goteiras e passos. Tochas escassas projetam sombras longas. Cheiro de mofo e esgoto.",
          generationNotes: "Crie uma malha irregular de túneis com 3 níveis de profundidade. Nível 1: passagens principais iluminadas. Nível 2: túneis de contrabando. Nível 3: câmaras secretas da guilda. Conecte os níveis por alçapões escondidos e escadas em espiral.",
        },
        subAreas: [
          {
            id: "sa4",
            name: "Mercado Negro",
            description: "Local onde comerciantes desonestos vendem mercadorias ilícitas.",
            npcs: [
              {
                id: "npc6",
                name: "Mercador Sombrio",
                role: "Comerciante",
                description: "Vende itens raros e ilegais. Não faz perguntas sobre a origem do dinheiro."
              },
              {
                id: "npc7",
                name: "Informante Ratos",
                role: "Vendedor de Informações",
                description: "Conhece todos os segredos da cidade. Por um preço, compartilha informações valiosas."
              }
            ]
          }
        ]
      }
    ],
    events: [
      {
        id: "e4",
        title: "Roubo no Palácio",
        type: "missão",
        status: "ativo",
        description: "Infiltrar o palácio real e recuperar documentos roubados pela guilda rival."
      },
      {
        id: "e5",
        title: "Negócio Arriscado",
        type: "comercial",
        status: "pendente",
        description: "O Mercador Sombrio oferece um item misterioso por um preço exorbitante."
      }
    ]
  },
  {
    id: "3",
    name: "Mago Theron",
    class: "Mago",
    level: 18,
    inventory: [
      {
        id: "i8",
        name: "Cajado do Arquimago",
        type: "Arma",
        rarity: "Lendário",
        quantity: 1,
        description: "Cajado antigo que amplifica o poder de feitiços arcanos."
      },
      {
        id: "i9",
        name: "Grimório de Magias Antigas",
        type: "Livro",
        rarity: "Épico",
        quantity: 1,
        description: "Contém feitiços poderosos e conhecimento arcano perdido."
      },
      {
        id: "i10",
        name: "Manto Estelar",
        type: "Armadura",
        rarity: "Épico",
        quantity: 1,
        description: "Manto imbuído com energia cósmica que aumenta resistência mágica."
      },
      {
        id: "i11",
        name: "Orbe da Criação",
        type: "Artefato",
        rarity: "Mítico",
        quantity: 1,
        description: "Um fragmento do tecido da realidade condensado em forma esférica. Permite ao portador reescrever as leis da magia por breves instantes. Único em toda a existência."
      },
    ],
    maps: [
      {
        id: "m4",
        name: "Torre Arcana",
        description: "Uma torre misteriosa que se estende além das nuvens, lar de magos poderosos.",
        script: {
          terrain: "Estrutura arcana vertical",
          climate: "Controlado por magia",
          size: "12 andares (4×4 por andar)",
          features: ["Escadas flutuantes", "Portais interandares", "Campos de força", "Laboratórios mágicos"],
          encounters: ["Construtos arcanos (GD 7)", "Elementais invocados (GD 6)", "Lich menor (GD 12)", "Familiar corrompido (GD 4)"],
          atmosphere: "Zumbido constante de energia mágica. Ar carregado de ozona. Objetos flutuam aleatoriamente. A realidade parece levemente distorcida.",
          generationNotes: "Organize cada andar como um grid 4×4 com propósito único: andares 1-3 (entrada e laboratórios), andares 4-7 (câmaras de estudo e biblioteca), andares 8-10 (área restrita), andares 11-12 (câmara do Arquimago). A progressão vertical exige chaves mágicas para cada segmento.",
        },
        subAreas: [
          {
            id: "sa5",
            name: "Biblioteca Proibida",
            description: "Contém conhecimento arcano perigoso e protegido por feitiços.",
            npcs: [
              {
                id: "npc8",
                name: "Bibliotecária Mystara",
                role: "Guardiã do Conhecimento",
                description: "Protege os livros mais perigosos da biblioteca. Pode conceder acesso aos dignos."
              }
            ]
          },
          {
            id: "sa6",
            name: "Câmara de Invocação",
            description: "Local onde rituais de invocação são realizados.",
            npcs: [
              {
                id: "npc9",
                name: "Mestre Invocador Zephyr",
                role: "Professor de Invocação",
                description: "Ensina as artes da invocação de criaturas elementais e espíritos."
              }
            ]
          }
        ]
      }
    ],
    events: [
      {
        id: "e6",
        title: "Pesquisa Proibida",
        type: "descoberta",
        status: "ativo",
        description: "Theron encontrou referências a um feitiço banido que poderia restaurar os mortos."
      },
      {
        id: "e7",
        title: "Duelo de Magos",
        type: "encontro",
        status: "concluído",
        description: "Theron derrotou o mago renegado Vexar em duelo arcano na praça da cidade."
      },
      {
        id: "e8",
        title: "Encomenda de Pergaminho",
        type: "comercial",
        status: "pendente",
        description: "A Bibliotecária Mystara solicita pergaminhos raros do leste em troca de acesso à seção proibida."
      }
    ]
  }
];
