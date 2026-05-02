import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Flame, BarChart2, ScrollText, LogOut, Shield } from "lucide-react";

/* JJK symbolic nav labels */
const navItems = [
  { href: "/dashboard", label: "Battlefield", icon: LayoutDashboard, jjk: "Today's Domain" },
  { href: "/habits", label: "Techniques", icon: Flame, jjk: "Cursed Methods" },
  { href: "/stats", label: "Records", icon: BarChart2, jjk: "Sorcerer Grade" },
  { href: "/settings", label: "Binding Vow", icon: ScrollText, jjk: "Soul Contract" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { charColor, charGlow, charGlowSoft, charImage, charName } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background hex-bg relative">

      {/* ── TOP NAVIGATION (sticky) ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(3, 10, 3, 0.92)",
          backdropFilter: "blur(28px)",
          borderBottomColor: `${charColor}18`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center h-14 gap-6">

          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${charColor}18`, border: `1px solid ${charColor}30`, boxShadow: `0 0 12px ${charGlowSoft}` }}
            >
              <Shield className="w-3.5 h-3.5" style={{ color: charColor }} />
            </div>
            <span
              className="font-display text-lg tracking-widest uppercase hidden sm:block"
              style={{ color: charColor, textShadow: `0 0 16px ${charGlow}` }}
            >
              ShadowHabits
            </span>
          </Link>

          {/* Divider */}
          <div className="h-6 w-px opacity-20" style={{ background: charColor }} />

          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = location === href || (href === "/dashboard" && location === "/");
              return (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all group"
                    style={isActive
                      ? { backgroundColor: `${charColor}14`, color: charColor }
                      : { color: "rgba(255,255,255,0.38)" }
                    }
                    data-testid={`nav-${label.toLowerCase()}`}
                  >
                    <Icon
                      className="w-3.5 h-3.5 transition-all"
                      style={isActive ? { filter: `drop-shadow(0 0 5px ${charGlow})` } : {}}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      {label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="top-nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ backgroundColor: charColor, boxShadow: `0 0 6px ${charGlow}` }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Character mini avatar */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg overflow-hidden border"
                style={{ borderColor: `${charColor}40`, boxShadow: `0 0 8px ${charGlowSoft}` }}
              >
                <img src={charImage} alt={charName} className="w-full h-full object-cover" />
              </div>
              {user?.name && (
                <span className="text-xs font-semibold hidden md:block" style={{ color: `${charColor}90` }}>
                  {user.name.split(" ")[0]}
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.color = charColor)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              data-testid="button-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient glow line under nav */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-60"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${charGlowSoft} 30%, ${charGlow} 50%, ${charGlowSoft} 70%, transparent 100%)` }}
        />
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* ── FOOTER STATUS BAR ── */}
      <footer
        className="border-t px-6 py-2"
        style={{
          background: "rgba(3, 10, 3, 0.85)",
          backdropFilter: "blur(20px)",
          borderTopColor: `${charColor}10`,
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs" style={{ color: `${charColor}50` }}>
            JUJUTSU SORCERER SYSTEM v1.0
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Channel your cursed energy wisely
          </p>
        </div>
      </footer>
    </div>
  );
}
