import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Character = "sukuna" | "itadori" | "megumi" | "nobara" | "nanami" | "maki" | "inumaki" | "toji" | "yuta" | "gojo";

interface ThemeContextType {
  character: Character;
  charName: string;
  charColor: string;
  charGlow: string;
  charGlowSoft: string;
  charImage: string;
}

const idAlias: Record<string, Character> = {
  "infinity-mentor": "gojo",
  "dark-king": "sukuna",
  "energy-hero": "itadori",
  "shadow-bearer": "megumi",
  "straw-doll": "nobara",
  "ratio-master": "nanami",
  "iron-body": "maki",
  "cursed-voice": "inumaki",
  "best-friend": "yuta",
};

const charData: Record<Character, Omit<ThemeContextType, "character">> = {
  sukuna: { charName: "Sukuna", charColor: "#FF2020", charGlow: "rgba(255,32,32,0.42)", charGlowSoft: "rgba(255,32,32,0.14)", charImage: "/src/assets/character-dark.png" },
  itadori: { charName: "Itadori", charColor: "#FFA000", charGlow: "rgba(255,160,0,0.4)", charGlowSoft: "rgba(255,160,0,0.14)", charImage: "/src/assets/character-energy.png" },
  megumi: { charName: "Megumi", charColor: "#8B5CF6", charGlow: "rgba(139,92,246,0.42)", charGlowSoft: "rgba(139,92,246,0.14)", charImage: "/src/assets/character-megumi.svg" },
  nobara: { charName: "Nobara", charColor: "#F472B6", charGlow: "rgba(244,114,182,0.42)", charGlowSoft: "rgba(244,114,182,0.14)", charImage: "/src/assets/character-nobara.svg" },
  nanami: { charName: "Nanami", charColor: "#D97706", charGlow: "rgba(217,119,6,0.42)", charGlowSoft: "rgba(217,119,6,0.14)", charImage: "/src/assets/character-nanami.svg" },
  maki: { charName: "Maki Zenin", charColor: "#CBD5E1", charGlow: "rgba(203,213,225,0.38)", charGlowSoft: "rgba(203,213,225,0.12)", charImage: "/src/assets/character-maki.svg" },
  inumaki: { charName: "Toge Inumaki", charColor: "#10B981", charGlow: "rgba(16,185,129,0.42)", charGlowSoft: "rgba(16,185,129,0.14)", charImage: "/src/assets/character-inumaki.svg" },
  toji: { charName: "Toji Fushiguro", charColor: "#64748B", charGlow: "rgba(100,116,139,0.42)", charGlowSoft: "rgba(100,116,139,0.14)", charImage: "/src/assets/character-toji.svg" },
  yuta: { charName: "Yuta Okkotsu", charColor: "#7C3AED", charGlow: "rgba(124,58,237,0.42)", charGlowSoft: "rgba(124,58,237,0.14)", charImage: "/src/assets/character-yuta.svg" },
  gojo: { charName: "Gojo Satoru", charColor: "#22D3EE", charGlow: "rgba(34,211,238,0.42)", charGlowSoft: "rgba(34,211,238,0.14)", charImage: "/src/assets/character-gojo.svg" },
};

const defaultChar: Character = "itadori";

const ThemeContext = createContext<ThemeContextType>({ character: defaultChar, ...charData[defaultChar] });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const raw = user?.selectedCharacter ?? defaultChar;
  const character: Character = (idAlias[raw] ?? (charData[raw as Character] ? raw : defaultChar)) as Character;

  useEffect(() => {
    document.body.setAttribute("data-character", character);
    return () => { document.body.removeAttribute("data-character"); };
  }, [character]);

  return <ThemeContext.Provider value={{ character, ...charData[character] }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
