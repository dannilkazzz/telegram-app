"use client";

import { useGameStore } from "@/lib/store/game-store";
import { formatCurrency, showTelegramPopup } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Shield,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Bell,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function DevSecuritySection() {
  const { userBalance, updateBalance, dev, updateDevStats } = useGameStore();
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Calculate current security level
  const securityLevel = dev.stats.securityLevel;

  // Calculate upgrade cost - increases exponentially with level
  const calculateUpgradeCost = (level: number): number => {
    return Math.round(500 * Math.pow(2, level - 1));
  };

  const upgradeCost = calculateUpgradeCost(securityLevel);

  // Security level effectiveness descriptions
  const securityDescriptions = [
    "No security. Easy target for hackers.",
    "Basic security. Basic protection against novice hackers.",
    "Standard security. Good protection against average hackers.",
    "Advanced security. Strong protection against skilled hackers.",
    "Enterprise security. Very strong protection against advanced hackers.",
    "Military-grade security. Nearly impenetrable to all but the most elite hackers."
  ];

  // Get the current security description
  const currentSecurityDescription = securityDescriptions[Math.min(securityLevel, 5)];

  // Get the next security description if available
  const nextSecurityDescription = securityLevel < 5 ? securityDescriptions[securityLevel + 1] : null;

  // Calculate security effectiveness
  const securityEffectiveness = Math.min(0.9, 0.2 + (securityLevel * 0.15));

  // Handle security upgrade
  const startSecurityUpgrade = () => {
    if (userBalance < upgradeCost) {
      showTelegramPopup(
        "Insufficient Funds",
        `You need ${formatCurrency(upgradeCost)} to upgrade your security.`
      );
      return;
    }

    // Deduct cost
    updateBalance(-upgradeCost);

    // Start upgrade progress
    setIsUpgrading(true);

    // Calculate upgrade time in seconds (higher levels take longer)
    const upgradeTimeMs = Math.min(10000, Math.max(3000, securityLevel * 1500));
    const updateInterval = 100; // Update every 100ms
    const steps = upgradeTimeMs / updateInterval;
    let currentStep = 0;

    // Update progress
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.floor((currentStep / steps) * 100);
      setUpgradeProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        completeUpgrade();
      }
    }, updateInterval);
  };

  // Complete the security upgrade
  const completeUpgrade = () => {
    // Increase security level
    updateDevStats({
      securityLevel: securityLevel + 1,
      operationsCompleted: dev.stats.operationsCompleted + 1
    });

    // Show success message
    showTelegramPopup(
      "Security Upgrade Complete!",
      `Your security has been upgraded to Level ${securityLevel + 1}. Your apps are now better protected against hackers.`
    );

    // Reset dialog
    setIsUpgrading(false);
    setUpgradeProgress(0);
    setShowUpgradeDialog(false);
  };

  // Animation variants
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

  // Get security icon based on level
  const getSecurityIcon = (level: number) => {
    if (level <= 1) return <Shield className="h-5 w-5" />;
    if (level <= 3) return <ShieldAlert className="h-5 w-5" />;
    return <ShieldCheck className="h-5 w-5" />;
  };

  return (
    <>
      <motion.div
        className="mt-16 mb-20 p-4 grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Current security status */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-emerald-500" /> Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    {getSecurityIcon(securityLevel)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Level {securityLevel}</h3>
                    <p className="text-sm text-slate-400">{currentSecurityDescription}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-slate-800 text-emerald-400 border-0 px-3 py-1.5 text-sm"
                >
                  Protection: {(securityEffectiveness * 100).toFixed(0)}%
                </Badge>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Security Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${securityLevel >= 1 ? 'text-emerald-500' : 'text-slate-500'}`} />
                    Basic Firewall
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${securityLevel >= 2 ? 'text-emerald-500' : 'text-slate-500'}`} />
                    Intrusion Detection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${securityLevel >= 3 ? 'text-emerald-500' : 'text-slate-500'}`} />
                    Advanced Encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${securityLevel >= 4 ? 'text-emerald-500' : 'text-slate-500'}`} />
                    Real-time Monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${securityLevel >= 5 ? 'text-emerald-500' : 'text-slate-500'}`} />
                    AI-powered Threat Detection
                  </li>
                </ul>
              </div>

              {securityLevel < 5 && (
                <div className="mt-6">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setShowUpgradeDialog(true)}
                  >
                    Upgrade Security
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                  <p className="text-xs text-center text-slate-400 mt-2">
                    Next Level: {formatCurrency(upgradeCost)}
                  </p>
                </div>
              )}

              {securityLevel >= 5 && (
                <div className="mt-6 bg-slate-800/50 p-3 rounded-lg border border-emerald-500/30 text-center">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm">Maximum security level reached!</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Your apps are protected by the best security available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security features and alerts */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-emerald-500" /> Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {securityLevel <= 1 ? (
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-rose-200">Warning: Low Security</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Your current security level makes your apps vulnerable to hackers. Consider upgrading your security as soon as possible.
                    </p>
                  </div>
                </div>
              ) : securityLevel >= 4 ? (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-200">Strong Security</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Your apps are well-protected against most hacking attempts. Only the most sophisticated hackers will be able to breach your security.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-200">Moderate Security</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Your security provides decent protection, but advanced hackers may still be able to breach it. Consider upgrading further for better protection.
                    </p>
                  </div>
                </div>
              )}

              <h4 className="text-sm font-medium mb-2">Recent Activity:</h4>
              {securityLevel > 1 ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>System scan completed</span>
                    </div>
                    <span className="text-xs text-slate-400">2h ago</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-500" />
                      <span>Security updates installed</span>
                    </div>
                    <span className="text-xs text-slate-400">1d ago</span>
                  </div>
                  {securityLevel >= 3 && (
                    <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-500" />
                        <span>Blocked suspicious login attempt</span>
                      </div>
                      <span className="text-xs text-slate-400">3d ago</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  No security activity logs available. Upgrade your security to enable activity monitoring.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Security upgrade dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-slate-900 border-emerald-500/30 border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              <span>Upgrade Security</span>
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col items-center mb-4">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800">
                  <span className="text-lg font-bold">{securityLevel}</span>
                </div>
                <ArrowUpRight className="h-6 w-6 text-emerald-500" />
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <span className="text-lg font-bold text-white">{securityLevel + 1}</span>
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-slate-400">Current: {currentSecurityDescription}</p>
                <p className="text-sm text-emerald-400 mt-1">Next: {nextSecurityDescription}</p>
              </div>

              <div className="w-full bg-slate-800 h-1 mb-4 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  style={{ width: `${(securityLevel / 5) * 100}%` }}
                />
              </div>
            </div>

            {isUpgrading ? (
              <div className="space-y-4 mt-4">
                <div className="relative">
                  <Progress value={upgradeProgress} className="h-2 bg-slate-700" />
                  <div className="text-center text-xs mt-2 text-slate-400">
                    {upgradeProgress}% complete
                  </div>
                </div>
                <div className="text-center text-slate-300">
                  Security upgrade in progress...
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <div className="text-center mb-2">
                  Cost: <span className={userBalance >= upgradeCost ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatCurrency(upgradeCost)}
                  </span>
                </div>
                <div className="text-xs text-slate-400 text-center mb-2">
                  Your balance: {formatCurrency(userBalance)}
                </div>

                <p className="text-xs text-center text-slate-400 mb-2">
                  Upgrading your security will make your apps more resistant to hacking attempts,
                  reducing the chance of lost income from successful hacks.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            {!isUpgrading && (
              <>
                <Button
                  onClick={startSecurityUpgrade}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={userBalance < upgradeCost}
                >
                  Upgrade to Level {securityLevel + 1}
                </Button>
                <Button
                  onClick={() => setShowUpgradeDialog(false)}
                  className="w-full"
                  variant="outline"
                >
                  Cancel
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
