"use client";

import { useState, useEffect } from "react";
import { GameHeader } from "./game-header";
import { GameNavigation, type GameSection } from "./game-navigation";
import { MainSection } from "./sections/main-section";
import { TasksSection } from "./sections/tasks-section";
import { LeadersSection } from "./sections/leaders-section";
import { TeamSelection } from "./team-selection";
import { WelcomePopupManager } from "./welcome-popup";
import { useGameStore } from "@/lib/store/game-store";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";
import { DevAppsSection } from "./sections/dev-apps-section";
import { DevSecuritySection } from "./sections/dev-security-section";
import { DevCourtSection } from "./sections/dev-court-section";
import { ByteToolsSection } from "./sections/byte-tools-section";
import { HackableTargetsList } from "./hack-targets-list";
import { getHackableTargets } from "@/lib/game-data";

export function GameLayout() {
  const { userTeam, resetGame, byte, updateByteStats, updateBalance } = useGameStore();
  const [activeSection, setActiveSection] = useState<GameSection>("main");
  const [activeDevSection, setActiveDevSection] = useState<"apps" | "security" | "court">("apps");
  const [activeByteSection, setActiveByteSection] = useState<"hack" | "software">("software");
  const [showChangeTeamDialog, setShowChangeTeamDialog] = useState(false);
  const [showHackTargets, setShowHackTargets] = useState(false);

  // Initialize Telegram Web App on page load
  useEffect(() => {
    // Initialize Telegram Web App if available
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.ready();
      } catch (error) {
        console.error("Error initializing Telegram Web App:", error);
      }
    }
  }, []);

  const handleChangeTeam = () => {
    resetGame();
    setShowChangeTeamDialog(false);
    // Force reload to show team selection
    window.location.reload();
  };

  // Handle hack attempt results
  const handleHackAttempt = (
    target: ReturnType<typeof getHackableTargets>[number],
    succeeded: boolean,
    cost: number,
    stolenAmount: number
  ) => {
    if (succeeded) {
      updateByteStats({
        systemsHacked: byte.stats.systemsHacked + 1,
        appsHacked: byte.stats.appsHacked + 1,
        operationsCompleted: byte.stats.operationsCompleted + 1
      });
      updateBalance(stolenAmount);
    }
  };

  // Render appropriate content based on team and active section
  const renderContent = () => {
    // Main section with categories
    if (activeSection === "main") {
      // For Dev team, show the selected dev section
      if (userTeam === "dev") {
        if (activeDevSection === "apps") {
          return <DevAppsSection />;
        } else if (activeDevSection === "security") {
          return <DevSecuritySection />;
        } else if (activeDevSection === "court") {
          return <DevCourtSection />;
        }
      }
      // For Byte team, show the selected byte section
      else if (userTeam === "byte") {
        if (activeByteSection === "hack") {
          return (
            <>
              {showHackTargets && (
                <HackableTargetsList
                  onClose={() => setShowHackTargets(false)}
                  targets={getHackableTargets()}
                  onHackAttempt={handleHackAttempt}
                />
              )}
              <div className="flex h-screen items-center justify-center">
                <Button
                  onClick={() => setShowHackTargets(true)}
                  className="px-8 py-6 text-lg bg-rose-600 hover:bg-rose-700"
                >
                  Find Targets to Hack
                </Button>
              </div>
            </>
          );
        } else if (activeByteSection === "software") {
          return <ByteToolsSection />;
        }
      }
      // If no specific section, show main overview
      return <MainSection />;
    }

    // Tasks and leaderboards sections
    if (activeSection === "tasks") {
      return <TasksSection />;
    }
    if (activeSection === "leaders") {
      return <LeadersSection />;
    }

    // Fallback to main section
    return <MainSection />;
  };

  // Get the appropriate section based on URL parameters or team + section
  const getHeaderTitle = (): string => {
    if (activeSection === "tasks") return "Tasks";
    if (activeSection === "leaders") return "Leaderboards";

    if (userTeam === "dev") {
      if (activeDevSection === "apps") return "App Development";
      if (activeDevSection === "security") return "Security Center";
      if (activeDevSection === "court") return "Legal Department";
    } else if (userTeam === "byte") {
      if (activeByteSection === "hack") return "Hack Center";
      if (activeByteSection === "software") return "Software Development";
    }

    return "Main";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Display team selection if no team is selected */}
      {!userTeam && <TeamSelection />}

      {/* Display game interface if team is selected */}
      {userTeam && (
        <>
          {/* Welcome popup for offline earnings */}
          <WelcomePopupManager />

          {/* Header with stats */}
          <GameHeader onShowTeamChange={() => setShowChangeTeamDialog(true)} />

          {/* Dev team navigation */}
          {userTeam === "dev" && activeSection === "main" && (
            <div className="fixed top-[60px] left-0 w-full z-30 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
              <div className="flex justify-center gap-2 p-2">
                <Button
                  variant={activeDevSection === "apps" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveDevSection("apps")}
                  className={activeDevSection === "apps" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Apps
                </Button>
                <Button
                  variant={activeDevSection === "security" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveDevSection("security")}
                  className={activeDevSection === "security" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Security
                </Button>
                <Button
                  variant={activeDevSection === "court" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveDevSection("court")}
                  className={activeDevSection === "court" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Court
                </Button>
              </div>
            </div>
          )}

          {/* Byte team navigation */}
          {userTeam === "byte" && activeSection === "main" && (
            <div className="fixed top-[60px] left-0 w-full z-30 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
              <div className="flex justify-center gap-2 p-2">
                <Button
                  variant={activeByteSection === "hack" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveByteSection("hack")}
                  className={activeByteSection === "hack" ? "bg-rose-600 hover:bg-rose-700" : ""}
                >
                  Hack
                </Button>
                <Button
                  variant={activeByteSection === "software" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveByteSection("software")}
                  className={activeByteSection === "software" ? "bg-rose-600 hover:bg-rose-700" : ""}
                >
                  Software
                </Button>
              </div>
            </div>
          )}

          {/* Main content area */}
          {renderContent()}

          {/* Navigation bar */}
          <GameNavigation
            activeSection={activeSection}
            onSectionChange={(section) => setActiveSection(section)}
          />

          {/* Team change confirmation dialog */}
          <Dialog open={showChangeTeamDialog} onOpenChange={setShowChangeTeamDialog}>
            <DialogContent className="bg-slate-900 border-rose-500/30 border">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <span>Warning: Change Team</span>
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-slate-300">
                  Changing teams will reset <span className="font-semibold text-rose-400">ALL</span> your progress, including:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">•</span> Your balance and income
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">•</span> All your apps or hacking tools
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">•</span> All completed tasks and achievements
                  </li>
                </ul>
                <p className="mt-3 text-slate-300">
                  Are you sure you want to continue?
                </p>
              </div>
              <DialogFooter className="flex-col sm:flex-col gap-2">
                <Button
                  onClick={() => setShowChangeTeamDialog(false)}
                  className="w-full"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangeTeam}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  variant="destructive"
                >
                  Reset & Change Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
