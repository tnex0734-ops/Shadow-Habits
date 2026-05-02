import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Character = "infinity-mentor" | "dark-king" | "energy-hero";

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
