import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Flame, BarChart2, User, LogOut,
  Shield, Settings, HelpCircle, ChevronDown,
} from "lucide-react";

const mainNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/habits",    label: "Habits",    icon: Flame },
  { href: "/stats",     label: "Stats",     icon: BarChart2 },
  { href: "/settings",  label: "Character", icon: User },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { charColor, charGlow, charGlowSoft, charImage, charName } = useTheme();
  const { user, logout } = useAuth();

  const firstName = user?.name?.split(" ")[0] ?? "Sorcerer";

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "hsl(var(--background))" }}>

      {/* ══════════════════════════════
          LEFT SIDEBAR
      ══════════════════════════════ */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col h-full border-r"
        style={{
          background: "rgba(3, 9, 18, 0.97)",
          borderColor: `${charColor}12`,
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${charColor}30, ${charColor}10)`,
              border: `1px solid ${charColor}40`,
              boxShadow: `0 0 16px ${charGlowSoft}`,
            }}
          >
            <Shield className="w-4 h-4" style={{ color: charColor }} />
          </div>
          <div>
            <p className="font-display text-base tracking-widest uppercase leading-none" style={{ color: charColor }}>
              Shadow
            </p>
            <p className="font-display text-base tracking-widest uppercase leading-none text-white/60">
              Habits
            </p>
          </div>
        </div>

        {/* ── MAIN MENU ── */}
        <div className="px-4 flex-1 flex flex-col gap-1 overflow-hidden">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2 px-2" style={{ color: "rgba(255,255,255,0.25)" }}>
            Main Menu
          </p>

          {mainNav.map(({ href, label, icon: Icon }) => {
            const isActive = location === href || (href === "/dashboard" && location === "/");
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none"
                  style={isActive
                    ? {
                        background: `linear-gradient(90deg, ${charColor}16, ${charColor}08)`,
                        border: `1px solid ${charColor}20`,
                      }
                    : {
                        border: "1px solid transparent",
                      }
                  }
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                      style={{ backgroundColor: charColor, boxShadow: `0 0 8px ${charGlow}` }}
                    />
                  )}

                  {/* Icon box */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={isActive
                      ? { backgroundColor: `${charColor}20`, boxShadow: `0 0 10px ${charGlowSoft}` }
                      : { backgroundColor: "rgba(255,255,255,0.05)" }
                    }
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ color: isActive ? charColor : "rgba(255,255,255,0.4)" }}
                    />
                  </div>

                  <span
                    className="text-sm font-medium"
                    style={{ color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.45)" }}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* ── PREFERENCE ── */}
          <div className="mt-4">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2 px-2" style={{ color: "rgba(255,255,255,0.25)" }}>
              Preference
            </p>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border border-transparent group"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,50,50,0.07)";
                (e.currentTarget as HTMLElement).style.color = "#ff6b6b";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,50,50,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              }}
              data-testid="button-logout"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <LogOut className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* User card at bottom */}
        <div className="p-4 border-t flex-shrink-0" style={{ borderColor: `${charColor}10` }}>
          <Link href="/settings">
            <div
              className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border border-transparent"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${charColor}20`; (e.currentTarget as HTMLElement).style.backgroundColor = `${charColor}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
            >
              <div
                className="w-8 h-8 rounded-xl overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: `${charColor}60`, boxShadow: `0 0 10px ${charGlowSoft}` }}
              >
                <img src={charImage} alt={charName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 truncate leading-tight">{firstName}</p>
                <p className="text-xs truncate leading-tight" style={{ color: `${charColor}80` }}>{charName}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
            </div>
          </Link>
        </div>
      </aside>

      {/* ══════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top mini-header */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 h-14 border-b"
          style={{
            background: "rgba(3, 9, 18, 0.6)",
            backdropFilter: "blur(20px)",
            borderColor: `${charColor}10`,
          }}
        >
          {/* Page title — dynamic from location */}
          <h2 className="text-sm font-semibold text-white/70">
            {mainNav.find(n => n.href === location || (n.href === "/dashboard" && location === "/"))?.label ?? "ShadowHabits"}
          </h2>

          {/* Right: character tag + switch button */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
              style={{ backgroundColor: `${charColor}10`, borderColor: `${charColor}25` }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: charColor, boxShadow: `0 0 6px ${charColor}` }} />
              <span className="text-xs font-semibold" style={{ color: charColor }}>{charName}</span>
            </div>
            <Link href="/settings">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all"
                style={{
                  background: `linear-gradient(135deg, ${charColor}22, ${charColor}10)`,
                  borderColor: `${charColor}35`,
                  color: charColor,
                  boxShadow: `0 0 12px ${charColor}18`,
                }}
              >
                <Settings className="w-3 h-3" />
                Switch Character
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Scrollable page content */}
        <main className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
