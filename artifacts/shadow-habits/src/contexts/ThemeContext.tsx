import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Character = "infinity-mentor" | "dark-king" | "energy-hero" | "shadow-bearer" | "straw-doll" | "ratio-master";

interface ThemeContextType {
  character: Character;
  charName: string;
  charColor: string;
  charGlow: string;
  charGlowSoft: string;
  charImage: string;
}

const ThemeContext = createContext<ThemeContextType>({
  character: "infinity-mentor",
  charName: "Infinity Mentor",
  charColor: "#00C8FF",
  charGlow: "rgba(0,200,255,0.38)",
  charGlowSoft: "rgba(0,200,255,0.14)",
  charImage: "/src/assets/character-infinity.png",
});

const charData: Record<Character, Omit<ThemeContextType, "character">> = {
  "infinity-mentor": {
    charName: "Infinity Mentor",
    charColor: "#00C8FF",
    charGlow: "rgba(0,200,255,0.38)",
    charGlowSoft: "rgba(0,200,255,0.14)",
    charImage: "/src/assets/character-infinity.png",
  },
  "dark-king": {
    charName: "Dark King",
    charColor: "#FF2020",
    charGlow: "rgba(255,32,32,0.42)",
    charGlowSoft: "rgba(255,32,32,0.14)",
    charImage: "/src/assets/character-dark.png",
  },
  "energy-hero": {
    charName: "Energy Hero",
    charColor: "#FFA000",
    charGlow: "rgba(255,160,0,0.4)",
    charGlowSoft: "rgba(255,160,0,0.14)",
    charImage: "/src/assets/character-energy.png",
  },
  "shadow-bearer": {
    charName: "Shadow Bearer",
    charColor: "#A855F7",
    charGlow: "rgba(168,85,247,0.42)",
    charGlowSoft: "rgba(168,85,247,0.14)",
    charImage: "/src/assets/character-megumi.svg",
  },
  "straw-doll": {
    charName: "Straw Doll",
    charColor: "#EC4899",
    charGlow: "rgba(236,72,153,0.42)",
    charGlowSoft: "rgba(236,72,153,0.14)",
    charImage: "/src/assets/character-nobara.svg",
  },
  "ratio-master": {
    charName: "Ratio Master",
    charColor: "#D97706",
    charGlow: "rgba(217,119,6,0.42)",
    charGlowSoft: "rgba(217,119,6,0.14)",
    charImage: "/src/assets/character-nanami.svg",
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const character: Character = (user?.selectedCharacter as Character) || "infinity-mentor";

  useEffect(() => {
    document.body.setAttribute("data-character", character);
    return () => { document.body.removeAttribute("data-character"); };
  }, [character]);

  const value: ThemeContextType = { character, ...charData[character] };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
