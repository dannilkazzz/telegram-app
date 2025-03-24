"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HackableTarget } from "@/lib/game-data";
import { formatCurrency } from "@/lib/utils";
import { useGameStore } from "@/lib/store/game-store";
import { Progress } from "./ui/progress";
import { X, AlertTriangle, ShieldCheck, Target, Skull } from "lucide-react";
import { Button } from "./ui/button";

interface HackableTargetsListProps {
  targets: HackableTarget[];
  onClose: () => void;
  onHackAttempt: (
    target: HackableTarget,
    succeeded: boolean,
    cost: number,
    stolenAmount: number
  ) => void;
}

export function HackableTargetsList({
  targets,
  onClose,
  onHackAttempt,
}: HackableTargetsListProps) {
  const { userBalance, updateBalance } = useGameStore();
  const [isHacking, setIsHacking] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<HackableTarget | null>(null);
  const [hackProgress, setHackProgress] = useState(0);
  const [hackResult, setHackResult] = useState<{
    success: boolean;
    amount: number;
    message: string;
  } | null>(null);

  // Sort targets by security level for better presentation
  const sortedTargets = [...targets].sort((a, b) => {
    return a.security - b.security;
  });

  // Handle starting a hack attempt
  const startHack = (target: HackableTarget) => {
    // Hack cost is based on target's security level
    const hackCost = target.security * 10;

    // Check if user has enough money for the hack
    if (userBalance < hackCost) {
      setHackResult({
        success: false,
        amount: 0,
        message: "Not enough money to attempt this hack!"
      });
      return;
    }

    // Set the current target and start hacking process
    setCurrentTarget(target);
    setIsHacking(true);
    setHackProgress(0);

    // Deduct the cost from balance
    updateBalance(-hackCost);

    // Calculate hack duration based on security - between 1-5 seconds
    const hackDuration = Math.min(Math.max(target.security, 1), 5) * 1000;
    const steps = 20; // Number of progress updates
    const intervalTime = hackDuration / steps;
    let currentStep = 0;

    // Animate the hack progress
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.floor((currentStep / steps) * 100);
      setHackProgress(newProgress);

      // When hack is complete
      if (currentStep >= steps) {
        clearInterval(progressInterval);

        // Calculate success probability based on security level
        // Higher security = lower chance of success
        const successProbability = Math.max(0.05, 1 - (target.security * 0.15));
        const hackSuccess = Math.random() <= successProbability;

        // Calculate stolen amount if successful
        let stolenAmount = 0;
        if (hackSuccess) {
          // Steal between 10-30% of the target's balance
          const stealPercentage = 0.1 + (Math.random() * 0.2);
          stolenAmount = Math.floor(target.balance * stealPercentage);
        }

        // Set the hack result for display
        setHackResult({
          success: hackSuccess,
          amount: stolenAmount,
          message: hackSuccess
            ? `Success! You hacked ${target.name} and stole ${formatCurrency(stolenAmount)}!`
            : `Hack failed! The security system blocked your attack.`
        });

        // Report back to parent component
        onHackAttempt(target, hackSuccess, hackCost, stolenAmount);

        // End the hacking process
        setTimeout(() => {
          setIsHacking(false);
        }, 1500);
      }
    }, intervalTime);
  };

  // Handle closing the result and returning to the target list
  const closeResult = () => {
    setHackResult(null);
    setCurrentTarget(null);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-lg border border-slate-800 shadow-lg overflow-hidden">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
          <h2 className="text-xl font-semibold flex items-center">
            <Target className="h-5 w-5 mr-2 text-rose-500" />
            Hack Targets
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main content */}
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <AnimatePresence mode="wait">
            {/* Target list */}
            {!isHacking && !hackResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 p-2"
              >
                <p className="text-sm text-slate-400 mb-3">
                  Select a target to hack. Higher security means lower success rate but bigger rewards.
                </p>

                {sortedTargets.map((target) => {
                  // Calculate cost to hack based on security level
                  const hackCost = target.security * 10;
                  // Determine if user can afford the hack
                  const canAfford = userBalance >= hackCost;

                  return (
                    <motion.div
                      key={target.name}
                      className={`border border-slate-800 rounded-lg p-3 bg-slate-850 hover:bg-slate-800/50 transition-colors ${
                        !canAfford ? 'opacity-50' : ''
                      }`}
                      whileHover={{ scale: canAfford ? 1.02 : 1 }}
                      whileTap={{ scale: canAfford ? 0.98 : 1 }}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{target.name}</h3>
                          <p className="text-xs text-slate-400">{target.owner}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-rose-500 font-mono text-sm">
                            {formatCurrency(target.balance)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {formatCurrency(target.income)}/hr
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-1 text-blue-400" />
                          <div className="text-xs flex items-center">
                            Security:
                            <span className="ml-1 font-medium">
                              {Array(target.security).fill("★").join("")}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={!canAfford}
                          onClick={() => startHack(target)}
                          className="text-xs py-1 h-7 bg-rose-600 hover:bg-rose-700"
                        >
                          Hack [{formatCurrency(hackCost)}]
                        </Button>
                      </div>

                      {!canAfford && (
                        <div className="mt-1 text-xs text-rose-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Not enough funds for this hack
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Hacking in progress */}
            {isHacking && currentTarget && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 flex flex-col items-center"
              >
                <h3 className="font-bold text-lg mb-2">Hacking {currentTarget.name}...</h3>
                <div className="mb-6 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-5xl text-rose-500 my-6"
                  >
                    <Skull className="h-16 w-16" />
                  </motion.div>
                </div>
                <div className="w-full mb-2">
                  <Progress value={hackProgress} className="h-2" />
                </div>
                <p className="text-sm text-slate-400">
                  Breaking through security layers...
                </p>
              </motion.div>
            )}

            {/* Hack result */}
            {hackResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-6 flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  hackResult.success ? 'bg-green-500/20 text-green-500' : 'bg-rose-500/20 text-rose-500'
                }`}>
                  {hackResult.success ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    >
                      <ShieldCheck className="h-8 w-8" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    >
                      <AlertTriangle className="h-8 w-8" />
                    </motion.div>
                  )}
                </div>

                <h3 className={`text-xl font-bold mb-2 ${
                  hackResult.success ? 'text-green-500' : 'text-rose-500'
                }`}>
                  {hackResult.success ? 'Hack Successful!' : 'Hack Failed!'}
                </h3>

                <p className="text-center text-slate-300 mb-4">
                  {hackResult.message}
                </p>

                {hackResult.success && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-mono text-green-500 font-bold mb-6"
                  >
                    +{formatCurrency(hackResult.amount)}
                  </motion.div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={closeResult}
                    className="mr-2"
                  >
                    Find Another Target
                  </Button>
                  <Button
                    variant="default"
                    onClick={onClose}
                    className="bg-slate-700 hover:bg-slate-600"
                  >
                    Exit
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
