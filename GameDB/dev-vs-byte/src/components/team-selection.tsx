"use client";

import { useGameStore } from "@/lib/store/game-store";
import { motion } from "framer-motion";
import { Terminal, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

export function TeamSelection() {
  const { selectTeam, calculateOfflineEarnings } = useGameStore();

  useEffect(() => {
    // Function to safely clear localStorage
    const clearStorage = () => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dev-byte-game-storage');
          console.log('Local storage cleared to force team selection');
        }
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    };

    // Clear storage on component mount
    clearStorage();

    // Calculate offline earnings on initial load (this will still run but won't affect anything with cleared storage)
    try {
      const earnings = calculateOfflineEarnings();
      console.log("Offline earnings:", earnings);
    } catch (error) {
      console.error('Error calculating offline earnings:', error);
    }
  }, [calculateOfflineEarnings]);

  const handleTeamSelect = (team: "dev" | "byte") => {
    try {
      selectTeam(team);
      console.log(`Selected team: ${team}`);
    } catch (error) {
      console.error('Error selecting team:', error);
      // Fallback manual approach
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      <motion.div
        className="relative flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-950 to-indigo-950 transition-all duration-300 ease-in-out cursor-pointer hover:opacity-90"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={() => handleTeamSelect("dev")}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <div className="absolute inset-0 bg-[url('/images/dev-bg.jpg')] bg-cover bg-center opacity-10" />
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <Terminal size={48} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-br from-emerald-400 to-cyan-300 bg-clip-text text-transparent">DEV</h2>
          <p className="text-xl mb-4 text-slate-300">Create Apps & Mine Money</p>
          <ul className="text-left text-slate-300 space-y-2 mt-4">
            <li className="flex items-center">
              <span className="mr-2">✅</span> Build profitable applications
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Improve your security systems
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Defend against attacks in court
            </li>
          </ul>
          <motion.button
            className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium text-lg shadow-lg shadow-emerald-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join DEV Team
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-950 to-rose-950 transition-all duration-300 ease-in-out cursor-pointer hover:opacity-90"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={() => handleTeamSelect("byte")}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <div className="absolute inset-0 bg-[url('/images/byte-bg.jpg')] bg-cover bg-center opacity-10" />
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/20">
            <ShieldCheck size={48} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-br from-rose-400 to-orange-300 bg-clip-text text-transparent">BYTE</h2>
          <p className="text-xl mb-4 text-slate-300">Hack & Exploit</p>
          <ul className="text-left text-slate-300 space-y-2 mt-4">
            <li className="flex items-center">
              <span className="mr-2">✅</span> Hack applications for profit
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Create advanced hacking tools
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Stay one step ahead of security
            </li>
          </ul>
          <motion.button
            className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium text-lg shadow-lg shadow-rose-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join BYTE Team
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
