import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Character = "infinity-mentor" | "dark-king" | "energy-hero";

interface ThemeContextType {
  character: Character;
  charName: string;
  charColor: string;
  charGlow: string;
  charImage: string;
}

const ThemeContext = createContext<ThemeContextType>({
  character: "infinity-mentor",
  charName: "Infinity Mentor",
  charColor: "#0ea5e9",
  charGlow: "rgba(14,165,233,0.4)",
  charImage: "/src/assets/character-infinity.png",
});

const charData: Record<Character, Omit<ThemeContextType, "character">> = {
  "infinity-mentor": {
    charName: "Infinity Mentor",
    charColor: "#0ea5e9",
    charGlow: "rgba(14,165,233,0.4)",
    charImage: "/src/assets/character-infinity.png",
  },
  "dark-king": {
    charName: "Dark King",
    charColor: "#dc2626",
    charGlow: "rgba(220,38,38,0.45)",
    charImage: "/src/assets/character-dark.png",
  },
  "energy-hero": {
    charName: "Energy Hero",
    charColor: "#ea580c",
    charGlow: "rgba(234,88,12,0.4)",
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
