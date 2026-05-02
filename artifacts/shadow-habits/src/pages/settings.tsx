import { motion, AnimatePresence } from "framer-motion";
import { useUpdateCharacter } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, LogOut, ScrollText, Shield, Flame, Zap } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCompanionMessageQueryKey } from "@workspace/api-client-react";

const characters = [
  {
    id: "infinity-mentor" as const,
    name: "Infinity Mentor",
    tagline: "The Honored One",
    jjkRole: "Special Grade Sorcerer",
    description: "Calm, limitless, and assured. His Infinity technique shields him from all harm — and from doubt.",
    color: "#AAFF00",
    glow: "rgba(170,255,0,0.38)",
    image: "/src/assets/character-infinity.png",
    abilities: ["Limitless ∞", "Hollow Purple", "Infinite Void Domain"],
    bindingVow: "I will strive for perfection and see all possibilities clearly.",
  },
  {
    id: "dark-king" as const,
    name: "Dark King",
    tagline: "King of Curses",
    jjkRole: "Cursed Spirit — Special Grade",
    description: "No mercy, no weakness. The King of Curses demands total dominance in everything you pursue.",
    color: "#FF2020",
    glow: "rgba(255,32,32,0.42)",
    image: "/src/assets/character-dark.png",
    abilities: ["Malevolent Shrine", "Dismantle", "Cleave"],
    bindingVow: "I will crush every obstacle without hesitation or retreat.",
  },
  {
    id: "energy-hero" as const,
    name: "Energy Hero",
    tagline: "The Vessel",
    jjkRole: "Tokyo Jujutsu High — Grade 1",
    description: "Unbreakable heart and limitless stamina. He fights for everyone, never gives up, never stops moving.",
    color: "#FFA000",
    glow: "rgba(255,160,0,0.4)",
    image: "/src/assets/character-energy.png",
    abilities: ["Divergent Fist", "Black Flash", "Cursed Blows"],
    bindingVow: "I will protect my streak and never surrender to laziness.",
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

  const currentChar = characters.find(c => c.id === user?.selectedCharacter) || characters[0];

  return (
    <div className="space-y-5 max-w-2xl mx-auto">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ScrollText className="w-4 h-4" style={{ color: charColor }} />
          <p className="font-display text-xs tracking-widest uppercase" style={{ color: `${charColor}80` }}>Soul Contract</p>
        </div>
        <h1 className="text-2xl font-bold text-white">Binding Vow</h1>
        <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          A Binding Vow is a self-imposed rule that strengthens your resolve. Choose wisely.
        </p>
      </div>

      {/* Profile */}
      <div
        className="rounded-2xl border p-5 relative overflow-hidden"
        style={{ background: "rgba(6,18,6,0.75)", borderColor: `${charColor}20`, backdropFilter: "blur(20px)" }}
      >
        <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(ellipse at 90% 50%, ${charColor}40, transparent 65%)` }} />
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0"
            style={{ borderColor: charColor, boxShadow: `0 0 20px ${charGlow}` }}
          >
            <img src={currentChar.image} alt={currentChar.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-white text-lg">{user?.name}</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${charColor}18`, color: charColor, border: `1px solid ${charColor}30` }}
              >
                {currentChar.name}
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{currentChar.jjkRole}</span>
            </div>
          </div>
        </div>

        {/* Current Binding Vow */}
        <div className="relative z-10 mt-4 px-4 py-3 rounded-xl border" style={{ backgroundColor: `${charColor}08`, borderColor: `${charColor}25` }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `${charColor}70` }}>Current Binding Vow</p>
          <p className="text-sm italic" style={{ color: "rgba(255,255,255,0.7)" }}>"{currentChar.bindingVow}"</p>
        </div>
      </div>

      {/* Companion selector */}
      <div>
        <h2 className="font-display text-xs tracking-widest uppercase mb-3" style={{ color: `${charColor}70` }}>
          Choose Your Sorcerer Companion
        </h2>
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
                className="w-full rounded-2xl border text-left overflow-hidden transition-all"
                style={{
                  background: isSelected ? `${char.color}08` : "rgba(6,18,6,0.65)",
                  borderColor: isSelected ? `${char.color}40` : `${char.color}0a`,
                  backdropFilter: "blur(20px)",
                  boxShadow: isSelected ? `0 0 24px ${char.color}15` : undefined,
                }}
                data-testid={`select-character-${char.id}`}
              >
                <div className="p-4 flex items-start gap-4">
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
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm" style={isSelected ? { color: char.color } : { color: "rgba(255,255,255,0.8)" }}>
                        {char.name}
                      </p>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{char.tagline}</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: char.jjkRole === currentChar.jjkRole && isSelected ? char.color + "80" : "rgba(255,255,255,0.3)" }}>
                      {char.jjkRole}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{char.description}</p>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-2 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {char.abilities.map(a => (
                              <span key={a} className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                                style={{ backgroundColor: `${char.color}15`, color: char.color, border: `1px solid ${char.color}25` }}>
                                {a}
                              </span>
                            ))}
                          </div>
                          <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: `${char.color}0a`, border: `1px solid ${char.color}20` }}>
                            <p className="text-xs italic" style={{ color: `${char.color}90` }}>"{char.bindingVow}"</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {isPending ? (
                      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: `${char.color}40`, borderTopColor: char.color }} />
                    ) : isSelected ? (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: char.color }}
                      >
                        <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.12)" }} />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* About */}
      <div className="rounded-2xl border p-5" style={{ background: "rgba(6,18,6,0.65)", borderColor: `${charColor}12`, backdropFilter: "blur(20px)" }}>
        <h2 className="font-display text-xs tracking-widest uppercase mb-3" style={{ color: `${charColor}60` }}>System</h2>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${charColor}15` }}>
            <Shield className="w-4 h-4" style={{ color: charColor }} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">ShadowHabits</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Jujutsu Sorcerer System v1.0 · Channel your cursed energy daily</p>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <motion.button
        onClick={logout}
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all"
        style={{ borderColor: "rgba(255,30,30,0.25)", color: "#ff6b6b" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,30,30,0.08)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
        data-testid="button-logout-settings"
      >
        <LogOut className="w-4 h-4" /> Release the Domain
      </motion.button>
    </div>
  );
}
