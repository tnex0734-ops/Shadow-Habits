import { motion, AnimatePresence } from "framer-motion";
import { useUpdateCharacter } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Zap, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCompanionMessageQueryKey } from "@workspace/api-client-react";

const characters = [
  {
    id: "infinity-mentor" as const,
    name: "Infinity Mentor",
    tagline: "The Honored One",
    description: "Calm, limitless, and assured. He sees everything — including your potential.",
    color: "#0ea5e9",
    glow: "rgba(14,165,233,0.4)",
    image: "/src/assets/character-infinity.png",
    abilities: ["Limitless domain", "Blue aura mastery", "Infinite patience"],
  },
  {
    id: "dark-king" as const,
    name: "Dark King",
    tagline: "King of Curses",
    description: "Ruthless. Powerful. Demands your absolute best — nothing less.",
    color: "#dc2626",
    glow: "rgba(220,38,38,0.45)",
    image: "/src/assets/character-dark.png",
    abilities: ["Cursed technique mastery", "Malevolent shrine", "Thousand slashes"],
  },
  {
    id: "energy-hero" as const,
    name: "Energy Hero",
    tagline: "The Vessel",
    description: "Boundless energy and unbreakable heart. Cheers you on every single day.",
    color: "#ea580c",
    glow: "rgba(234,88,12,0.4)",
    image: "/src/assets/character-energy.png",
    abilities: ["Divergent fist", "Limitless stamina", "Black flash"],
  },
];

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { charColor, charGlow } = useTheme();
  const queryClient = useQueryClient();

  const updateCharMutation = useUpdateCharacter({
    mutation: {
      onSuccess: (data) => {
        updateUser(data);
        queryClient.invalidateQueries({ queryKey: getGetCompanionMessageQueryKey() });
      },
    },
  });

  const currentChar = characters.find((c) => c.id === user?.selectedCharacter) || characters[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Customize your shadow experience</p>
      </div>

      {/* Profile card */}
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden border-2"
            style={{ borderColor: charColor, boxShadow: `0 0 16px ${charGlow}` }}
          >
            <img src={currentChar.image} alt={currentChar.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: `${charColor}20`, color: charColor }}>
              {currentChar.name}
            </p>
          </div>
        </div>
      </div>

      {/* Character selector */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Choose Companion</h2>
        <div className="space-y-3">
          {characters.map((char) => {
            const isSelected = user?.selectedCharacter === char.id;
            const isPending = updateCharMutation.isPending && updateCharMutation.variables?.data?.selectedCharacter === char.id;

            return (
              <motion.button
                key={char.id}
                type="button"
                onClick={() => !isSelected && updateCharMutation.mutate({ data: { selectedCharacter: char.id } })}
                whileHover={!isSelected ? { scale: 1.01 } : {}}
                whileTap={!isSelected ? { scale: 0.99 } : {}}
                className="w-full glass-card rounded-xl border transition-all text-left overflow-hidden"
                style={
                  isSelected
                    ? { borderColor: char.color, boxShadow: `0 0 16px ${char.glow}` }
                    : { borderColor: "rgba(255,255,255,0.08)" }
                }
                data-testid={`select-character-${char.id}`}
              >
                <div className="p-4 flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0"
                    style={{
                      borderColor: isSelected ? char.color : "rgba(255,255,255,0.1)",
                      boxShadow: isSelected ? `0 0 16px ${char.glow}` : "none",
                    }}
                  >
                    <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm" style={isSelected ? { color: char.color } : {}}>
                        {char.name}
                      </p>
                      <span className="text-xs text-muted-foreground">{char.tagline}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{char.description}</p>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 flex flex-wrap gap-1"
                        >
                          {char.abilities.map((a) => (
                            <span
                              key={a}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${char.color}20`, color: char.color }}
                            >
                              {a}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex-shrink-0">
                    {isPending ? (
                      <div className="w-5 h-5 border-2 rounded-full border-primary/40 border-t-primary animate-spin" />
                    ) : isSelected ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: char.color }}>
                        <Check className="w-3.5 h-3.5 text-black" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-white/20" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* App info */}
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</h2>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4" style={{ color: charColor }} />
          <span className="font-semibold text-foreground">ShadowHabits</span>
          <span className="text-xs text-muted-foreground">v1.0</span>
        </div>
        <p className="text-xs text-muted-foreground">A visually immersive anime-themed habit tracker. Channel your cursed energy into disciplined daily practice.</p>
      </div>

      {/* Logout */}
      <motion.button
        onClick={logout}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
        data-testid="button-logout-settings"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </motion.button>
    </div>
  );
}
