import { motion, AnimatePresence } from "framer-motion";
import { useUpdateCharacter } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, LogOut, ScrollText, Shield, Zap } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCompanionMessageQueryKey } from "@workspace/api-client-react";

const characters = [
  {
    id: "sukuna" as const,
    name: "Sukuna",
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
    id: "itadori" as const,
    name: "Itadori Yuji",
    tagline: "The Vessel",
    jjkRole: "Tokyo Jujutsu High — Grade 1",
    description: "Unbreakable heart and limitless stamina. He fights for everyone, never gives up, never stops moving.",
    color: "#FFA000",
    glow: "rgba(255,160,0,0.4)",
    image: "/src/assets/character-energy.png",
    abilities: ["Divergent Fist", "Black Flash", "Cursed Blows"],
    bindingVow: "I will protect my streak and never surrender to laziness.",
  },
  {
    id: "megumi" as const,
    name: "Megumi Fushiguro",
    tagline: "Ten Shadows",
    jjkRole: "Tokyo Jujutsu High — Grade 2",
    description: "Cold and calculated. Commands ten divine shikigami from shadows — precision over raw power.",
    color: "#A855F7",
    glow: "rgba(168,85,247,0.42)",
    image: "/src/assets/character-megumi.svg",
    abilities: ["Ten Shadows", "Divine Dogs", "Max Elephant"],
    bindingVow: "I will move with precision and let no distraction enter my domain.",
  },
  {
    id: "nobara" as const,
    name: "Nobara Kugisaki",
    tagline: "The Hammer",
    jjkRole: "Tokyo Jujutsu High — Semi-Grade 1",
    description: "Fierce, fearless, and unyielding. Channels cursed energy through nails and straw dolls to crush her targets.",
    color: "#EC4899",
    glow: "rgba(236,72,153,0.42)",
    image: "/src/assets/character-nobara.svg",
    abilities: ["Straw Doll Technique", "Resonance", "Hairpin"],
    bindingVow: "I will face every challenge head-on — no retreat, no excuses.",
  },
  {
    id: "toji" as const,
    name: "Toji Fushiguro",
    tagline: "Sorcerer Killer",
    jjkRole: "Zenin Clan — Former Assassin",
    description: "Zero cursed energy, maximum lethality. He dismantled entire clans on pure physical capability alone.",
    color: "#64748B",
    glow: "rgba(100,116,139,0.42)",
    image: "/src/assets/character-toji.svg",
    abilities: ["Heavenly Restriction", "Inventory Curse", "Chain Weapon"],
    bindingVow: "I will outwork everyone through raw discipline — no technique required.",
  },
  {
    id: "nanami" as const,
    name: "Kento Nanami",
    tagline: "7:3 Ratio",
    jjkRole: "Jujutsu High — Grade 1 Sorcerer",
    description: "Disciplined and relentless. Strikes at the exact 7:3 weak point of any obstacle — work is not glamorous, but it gets done.",
    color: "#D97706",
    glow: "rgba(217,119,6,0.42)",
    image: "/src/assets/character-nanami.svg",
    abilities: ["Ratio Technique", "Overtime", "Collapse"],
    bindingVow: "I will work methodically every day, because overtime yields results.",
  },
  {
    id: "maki" as const,
    name: "Maki Zenin",
    tagline: "Heavenly Restriction",
    jjkRole: "Tokyo Jujutsu High — Special Grade",
    description: "No cursed energy, no shortcuts. Pure physical perfection and iron will — she outworks everyone through discipline alone.",
    color: "#CBD5E1",
    glow: "rgba(203,213,225,0.38)",
    image: "/src/assets/character-maki.svg",
    abilities: ["Heavenly Restriction", "Panda Staff", "Dragon Bone"],
    bindingVow: "I will prove myself through effort alone — no excuses, no shortcuts.",
  },
  {
    id: "inumaki" as const,
    name: "Toge Inumaki",
    tagline: "Cursed Speech",
    jjkRole: "Tokyo Jujutsu High — Semi-Grade 1",
    description: "Every word carries weight. He says little, but when he speaks — the world listens. Quality over quantity, always.",
    color: "#10B981",
    glow: "rgba(16,185,129,0.42)",
    image: "/src/assets/character-inumaki.svg",
    abilities: ["Cursed Speech", "Blast Away", "Twist"],
    bindingVow: "I will choose quality over quantity and let my results speak for themselves.",
  },
  {
    id: "yuta" as const,
    name: "Yuta Okkotsu",
    tagline: "Special Grade",
    jjkRole: "Tokyo Jujutsu High — Special Grade",
    description: "Quiet and reserved, but carries the most overwhelming cursed energy in a generation. Rika's love fuels everything.",
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.42)",
    image: "/src/assets/character-yuta.svg",
    abilities: ["Rika's Curse", "Mimicry", "Tenfold Amplification"],
    bindingVow: "I will carry every habit forward — for myself and for those I love.",
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
    <div className="h-full overflow-y-auto no-scrollbar px-6 pt-5 pb-6">
      <div className="space-y-5 max-w-2xl mx-auto">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ScrollText className="w-4 h-4" style={{ color: charColor }} />
            <p className="font-display text-xs tracking-widest uppercase" style={{ color: `${charColor}80` }}>Soul Contract</p>
          </div>
          <h1 className="text-2xl font-bold text-white">Choose Your Companion</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Select the sorcerer who will push you to your limits.
          </p>
        </div>

        {/* Profile */}
        <div
          className="rounded-2xl border p-5 relative overflow-hidden"
          style={{ background: "rgba(6,12,24,0.75)", borderColor: `${charColor}20`, backdropFilter: "blur(20px)" }}
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
          <div className="relative z-10 mt-4 px-4 py-3 rounded-xl border" style={{ backgroundColor: `${charColor}08`, borderColor: `${charColor}25` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `${charColor}70` }}>Binding Vow</p>
            <p className="text-sm italic" style={{ color: "rgba(255,255,255,0.7)" }}>"{currentChar.bindingVow}"</p>
          </div>
        </div>

        {/* Character selector */}
        <div>
          <h2 className="font-display text-xs tracking-widest uppercase mb-3" style={{ color: `${charColor}70` }}>
            All Sorcerers · {characters.length} available
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
                    background: isSelected ? `${char.color}08` : "rgba(6,12,24,0.65)",
                    borderColor: isSelected ? `${char.color}40` : "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(20px)",
                    boxShadow: isSelected ? `0 0 24px ${char.color}15` : undefined,
                  }}
                  data-testid={`select-character-${char.id}`}
                >
                  <div className="p-4 flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0"
                      style={{
                        borderColor: isSelected ? char.color : "rgba(255,255,255,0.08)",
                        boxShadow: isSelected ? `0 0 16px ${char.glow}` : "none",
                      }}
                    >
                      <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm" style={{ color: isSelected ? char.color : "rgba(255,255,255,0.85)" }}>
                          {char.name}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider"
                          style={{ background: `${char.color}15`, color: `${char.color}90` }}>
                          {char.tagline}
                        </span>
                      </div>
                      <p className="text-[10px] mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {char.jjkRole}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{char.description}</p>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {char.abilities.map(a => (
                                <span key={a} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                  style={{ background: `${char.color}18`, color: char.color, border: `1px solid ${char.color}25` }}>
                                  {a}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {isPending ? (
                        <Zap className="w-4 h-4 animate-spin" style={{ color: char.color }} />
                      ) : isSelected ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: char.color, boxShadow: `0 0 10px ${char.glow}` }}>
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/10" />
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Sign out */}
        <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl w-full transition-all"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ff6b6b"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,50,50,0.06)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}
