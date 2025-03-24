"use client";

import { useGameStore } from "@/lib/store/game-store";
import { motion } from "framer-motion";
import { HomeIcon, ListTodo, Trophy, Terminal, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type GameSection = "main" | "tasks" | "leaders";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  const { userTeam } = useGameStore();
  const accentColor = userTeam === "dev" ? "bg-emerald-500" : "bg-rose-500";

  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg transition-all relative",
        active ? "text-white" : "text-slate-400 hover:text-white"
      )}
      onClick={onClick}
    >
      {active && (
        <motion.div
          className={`absolute inset-0 ${accentColor} rounded-lg opacity-20`}
          layoutId="activeTab"
          transition={{ duration: 0.2 }}
        />
      )}
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

interface GameNavigationProps {
  activeSection: GameSection;
  onSectionChange: (section: GameSection) => void;
}

export function GameNavigation({ activeSection, onSectionChange }: GameNavigationProps) {
  const { userTeam } = useGameStore();
  const accentColor = userTeam === "dev" ? "from-emerald-500 to-cyan-500" : "from-rose-500 to-orange-500";

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-sm border-t border-slate-800 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Indicator bar at the top */}
      <div className={`h-1 w-full bg-gradient-to-r ${accentColor}`} />

      <div className="flex justify-around items-center px-4">
        <NavItem
          icon={<HomeIcon className="h-5 w-5" />}
          label="Main"
          active={activeSection === "main"}
          onClick={() => onSectionChange("main")}
        />
        <NavItem
          icon={<ListTodo className="h-5 w-5" />}
          label="Tasks"
          active={activeSection === "tasks"}
          onClick={() => onSectionChange("tasks")}
        />
        <NavItem
          icon={<Trophy className="h-5 w-5" />}
          label="Leaders"
          active={activeSection === "leaders"}
          onClick={() => onSectionChange("leaders")}
        />
        <NavItem
          icon={userTeam === "dev" ? <Terminal className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          label={userTeam === "dev" ? "Dev" : "Byte"}
          active={false}
          onClick={() => {
            // Future tab for team-specific actions
          }}
        />
      </div>
    </motion.div>
  );
}
