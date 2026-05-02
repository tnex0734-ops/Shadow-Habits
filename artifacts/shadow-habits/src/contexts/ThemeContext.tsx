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
  charColor: "#AAFF00",
  charGlow: "rgba(170,255,0,0.38)",
  charGlowSoft: "rgba(170,255,0,0.15)",
  charImage: "/src/assets/character-infinity.png",
});

const charData: Record<Character, Omit<ThemeContextType, "character">> = {
  "infinity-mentor": {
    charName: "Infinity Mentor",
    charColor: "#AAFF00",
    charGlow: "rgba(170,255,0,0.38)",
    charGlowSoft: "rgba(170,255,0,0.15)",
    charImage: "/src/assets/character-infinity.png",
  },
  "dark-king": {
    charName: "Dark King",
    charColor: "#FF1E1E",
    charGlow: "rgba(255,30,30,0.42)",
    charGlowSoft: "rgba(255,30,30,0.15)",
    charImage: "/src/assets/character-dark.png",
  },
  "energy-hero": {
    charName: "Energy Hero",
    charColor: "#FFA500",
    charGlow: "rgba(255,165,0,0.4)",
    charGlowSoft: "rgba(255,165,0,0.15)",
    charImage: "/src/assets/character-energy.png",
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const character: Character = (user?.selectedCharacter as Character) || "infinity-mentor";

  useEffect(() => {
    document.body.setAttribute("data-character", character);
    return () => {
      document.body.removeAttribute("data-character");
    };
  }, [character]);

  const value: ThemeContextType = {
    character,
    ...charData[character],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
