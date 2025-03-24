"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { useGameStore } from "@/lib/store/game-store";
import { Button } from "@/components/ui/button";
import { Coins, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomePopupProps {
  earnings: number;
  onClose: () => void;
}

export function WelcomePopup({ earnings, onClose }: WelcomePopupProps) {
  const { userTeam } = useGameStore();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const accentColor = userTeam === "dev" ? "from-emerald-500 to-cyan-500" : "from-rose-500 to-orange-500";
  const shadowColor = userTeam === "dev" ? "shadow-emerald-500/10" : "shadow-rose-500/10";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className={`bg-slate-900 border-0 shadow-xl ${shadowColor} overflow-hidden`}>
              <div className={`h-2 w-full bg-gradient-to-r ${accentColor}`} />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">Welcome Back!</CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  While you were away, your {userTeam === "dev" ? "apps" : "hacking tools"} have been working:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center flex-col my-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${accentColor} flex items-center justify-center mb-4`}>
                    <Coins className="h-8 w-8 text-white" />
                  </div>
                  <motion.div
                    className="text-3xl font-bold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  >
                    {formatCurrency(earnings)}
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full py-6 text-lg font-semibold bg-gradient-to-r ${accentColor} hover:opacity-90 text-white border-0`}
                  onClick={handleClose}
                >
                  Claim Rewards
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WelcomePopupManager() {
  const [showPopup, setShowPopup] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const { calculateOfflineEarnings, userTeam } = useGameStore();

  useEffect(() => {
    // Only show if user has a team
    if (userTeam) {
      const offlineEarnings = calculateOfflineEarnings();

      // Only show if there are substantial earnings (more than $0.01)
      if (offlineEarnings > 0.01) {
        setEarnings(offlineEarnings);
        setShowPopup(true);
      }
    }
  }, [userTeam, calculateOfflineEarnings]);

  return (
    <>
      {showPopup && <WelcomePopup earnings={earnings} onClose={() => setShowPopup(false)} />}
    </>
  );
}
