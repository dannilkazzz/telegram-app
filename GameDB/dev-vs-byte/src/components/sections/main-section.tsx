"use client";

import { useGameStore } from "@/lib/store/game-store";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { showTelegramPopup } from "@/lib/utils";
import { getHackableTargets } from "@/lib/game-data";
import { useState, useEffect } from "react";
import { HackableTargetsList } from "../hack-targets-list";
import { AlertCircle } from "lucide-react";

export function MainSection() {
  const { userTeam, dev, byte, updateByteStats, updateBalance } = useGameStore();
  const [showHackTargets, setShowHackTargets] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add a useEffect to handle loading state and catch errors
  useEffect(() => {
    try {
      // Simulate a loading delay to ensure store is ready
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      // Check store state
      if (!userTeam) {
        console.warn("No team selected yet");
      }

      return () => clearTimeout(timer);
    } catch (e) {
      console.error("Error in MainSection:", e);
      setError("Failed to load game data. Please reload the page.");
      setIsLoading(false);
    }
  }, [userTeam]);

  // Safely determine categories based on team
  const getCategories = () => {
    try {
      if (!userTeam) return [];
      return userTeam === "dev" ? dev.categories : byte.categories;
    } catch (e) {
      console.error("Error getting categories:", e);
      return [];
    }
  };

  const categories = getCategories();

  const handleCategoryClick = (categoryName: string) => {
    try {
      if (categoryName === "Hack" && userTeam === "byte") {
        setShowHackTargets(true);
      } else {
        showTelegramPopup(
          "Coming Soon",
          `${categoryName} functionality will be available in the next update!`
        );
      }
    } catch (error) {
      console.error("Error handling category click:", error);
      alert(`${categoryName} functionality will be available soon!`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const accentBorder = userTeam === "dev" ? "border-emerald-500/40" : "border-rose-500/40";
  const accentBg = userTeam === "dev" ? "from-emerald-500/10 to-cyan-500/10" : "from-rose-500/10 to-orange-500/10";

  // If there's an error, display error message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-rose-400">Something went wrong</h3>
        <p className="text-slate-400 max-w-md mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // If loading, display loading message
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-slate-500 border-t-blue-500 rounded-full"></div>
        <span className="ml-3 text-slate-400">Loading game data...</span>
      </div>
    );
  }

  // If no team is selected, show message
  if (!userTeam) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h3 className="text-xl font-semibold mb-4">Please select a team to continue</h3>
        <p className="text-slate-400 max-w-md">
          Choose either DEV team to build apps or BYTE team to hack systems.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-2 gap-4 mt-16 mb-20 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <motion.div key={category.name} variants={itemVariants}>
            <Card
              className={`bg-gradient-to-br ${accentBg} border-2 ${accentBorder} p-4 flex flex-col items-center justify-center text-center h-32 cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </Card>
          </motion.div>
        ))}

        {/* Dev Team Main Content */}
        {userTeam === "dev" && (
          <>
            <motion.div variants={itemVariants} className="col-span-2">
              <Card className={`p-4 border-2 ${accentBorder} bg-gradient-to-br ${accentBg}`}>
                <h3 className="text-lg font-semibold mb-2">Your Apps</h3>
                {dev.apps.length > 0 ? (
                  <ul className="space-y-2">
                    {dev.apps.map((app, index) => (
                      <li key={index} className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span>{app.name}</span>
                        <span className="text-emerald-400">${app.income}/hr</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400">You don't have any apps yet.</p>
                )}
              </Card>
            </motion.div>
          </>
        )}

        {/* Byte Team Main Content */}
        {userTeam === "byte" && (
          <>
            <motion.div variants={itemVariants} className="col-span-2">
              <Card className={`p-4 border-2 ${accentBorder} bg-gradient-to-br ${accentBg}`}>
                <h3 className="text-lg font-semibold mb-2">Your Hacking Tools</h3>
                {byte.tools.length > 0 ? (
                  <ul className="space-y-2">
                    {byte.tools.map((tool, index) => (
                      <li key={index} className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span>{tool.name}</span>
                        <span className="text-rose-400">${tool.income}/hr</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400">You don't have any hacking tools yet.</p>
                )}
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Hack targets list dialog */}
      {showHackTargets && (
        <HackableTargetsList
          onClose={() => setShowHackTargets(false)}
          targets={getHackableTargets()}
          onHackAttempt={(target, succeeded, cost, stolenAmount) => {
            if (succeeded) {
              updateByteStats({
                systemsHacked: byte.stats.systemsHacked + 1,
                appsHacked: byte.stats.appsHacked + 1,
                operationsCompleted: byte.stats.operationsCompleted + 1
              });
              updateBalance(stolenAmount);
            }
          }}
        />
      )}
    </>
  );
}
