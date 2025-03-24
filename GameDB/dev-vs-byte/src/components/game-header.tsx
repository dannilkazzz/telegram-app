"use client";

import { Button } from "./ui/button";
import { useGameStore } from "@/lib/store/game-store";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart3,
  Clock,
  Coins,
  Banknote,
  Plus,
  UserRoundCog,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "./ui/badge";

interface GameHeaderProps {
  onShowTeamChange: () => void;
}

export function GameHeader({ onShowTeamChange }: GameHeaderProps) {
  const { userTeam, userBalance, passiveIncome, updateBalance } = useGameStore();
  const [showStatsDetail, setShowStatsDetail] = useState(false);

  // Team-based styling
  const accentColor = userTeam === "dev" ? "from-emerald-500 to-cyan-500" : "from-rose-500 to-orange-500";
  const accentSolid = userTeam === "dev" ? "bg-emerald-500" : "bg-rose-500";
  const accentText = userTeam === "dev" ? "text-emerald-500" : "text-rose-500";

  // Handle money purchase
  const handlePurchaseMoney = () => {
    // Instead of using the complex Telegram popup, we'll use a simple alert
    if (window.confirm("Do you want to buy 10,000$ for 160 Stars?")) {
      updateBalance(10000);
      alert("Success! 10,000$ has been added to your balance");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-40">
      {/* Colored accent bar at the very top */}
      <div className={`h-1 w-full bg-gradient-to-r ${accentColor}`} />

      {/* Main stats bar */}
      <motion.div
        className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 py-3 px-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center">
          {/* Balance section */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-1 bg-slate-800 border-0">
              <Coins className="h-3 w-3 mr-1" />
              <span className="font-mono">{formatCurrency(userBalance)}</span>
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className={`h-7 w-7 rounded-full ${accentSolid} text-white flex items-center justify-center hover:opacity-90`}
              onClick={handlePurchaseMoney}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Team indicator and settings */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`uppercase font-bold px-2 py-1 ${accentText} bg-transparent`}
            >
              {userTeam} TEAM
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-sm"
              onClick={onShowTeamChange}
            >
              <UserRoundCog className="h-4 w-4 mr-1" />
              Change
            </Button>
          </div>

          {/* Income section */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-slate-300 px-2"
              onClick={() => setShowStatsDetail(!showStatsDetail)}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-mono">{formatCurrency(passiveIncome)}</span>/hr
            </Button>
          </div>
        </div>

        {/* Expanded stats section */}
        {showStatsDetail && (
          <motion.div
            className="mt-2 px-2 pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Per Min: {formatCurrency(passiveIncome / 60)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Banknote className="h-3 w-3" />
              <span>Per Day: {formatCurrency(passiveIncome * 24)}</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export function ChangeTeamDialog() {
  const { resetGame } = useGameStore();
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetGame();
    setOpen(false);
    // Reload the page to get back to team selection
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-rose-500 text-rose-500 hover:bg-rose-500/10">
          Change Team
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-rose-500 flex items-center gap-2">
            <span className="text-lg">⚠️ Warning</span>
          </DialogTitle>
          <DialogDescription className="pt-2">
            Changing team will reset ALL your progress! Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex gap-2 sm:justify-center">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReset}
            className="bg-rose-500 hover:bg-rose-600"
          >
            Reset & Change Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
