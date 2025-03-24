"use client";

import { useGameStore } from "@/lib/store/game-store";
import { devApps } from "@/lib/game-data";
import { formatCurrency, showTelegramPopup } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowUpCircle,
  Clock,
  Code,
  Cpu,
  Diamond,
  Lock,
  Smartphone,
  ServerIcon,
  LaptopIcon,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export function DevAppsSection() {
  const { userBalance, updateBalance, dev, addDevApp, updateDevStats } = useGameStore();
  const [selectedApp, setSelectedApp] = useState<typeof devApps[0] | null>(null);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isBuildingApp, setIsBuildingApp] = useState(false);

  // Determine which apps are available based on dev level
  const devLevel = Math.min(5, Math.ceil(dev.apps.length / 2) || 1);
  const availableApps = devApps.filter(app => (app.requiredLevel || 0) <= devLevel);

  // Show app details and start building
  const showAppDetails = (app: typeof devApps[0]) => {
    setSelectedApp(app);
  };

  // Handle app building
  const startBuildingApp = () => {
    if (!selectedApp) return;
    if (userBalance < selectedApp.cost) {
      showTelegramPopup(
        "Insufficient Funds",
        `You need ${formatCurrency(selectedApp.cost)} to develop this app.`
      );
      return;
    }

    // Deduct cost
    updateBalance(-selectedApp.cost);

    // Start building progress
    setIsBuildingApp(true);

    // Calculate build time in seconds (more expensive apps take longer)
    const buildTimeMs = Math.min(10000, Math.max(2000, selectedApp.cost / 100 * 1000));
    const updateInterval = 100; // Update every 100ms
    const steps = buildTimeMs / updateInterval;
    let currentStep = 0;

    // Update progress
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.floor((currentStep / steps) * 100);
      setBuildProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        completeBuild();
      }
    }, updateInterval);
  };

  // Complete the app building
  const completeBuild = () => {
    if (!selectedApp) return;

    // Add app to inventory
    addDevApp({
      name: selectedApp.name,
      income: selectedApp.income
    });

    // Update stats
    updateDevStats({
      appsCreated: dev.stats.appsCreated + 1,
      operationsCompleted: dev.stats.operationsCompleted + 1
    });

    // Show success message
    showTelegramPopup(
      "App Development Complete!",
      `Your new ${selectedApp.name} is now generating ${formatCurrency(selectedApp.income)}/hr`
    );

    // Reset dialog
    setIsBuildingApp(false);
    setBuildProgress(0);
    setSelectedApp(null);
  };

  // Cancel building and close dialog
  const cancelBuild = () => {
    setSelectedApp(null);
    setBuildProgress(0);
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

  // Get app icon based on name/type
  const getAppIcon = (appName: string) => {
    if (appName.includes("Mobile")) return <Smartphone className="h-5 w-5" />;
    if (appName.includes("Commerce")) return <Diamond className="h-5 w-5" />;
    if (appName.includes("Social")) return <LaptopIcon className="h-5 w-5" />;
    if (appName.includes("Game")) return <Cpu className="h-5 w-5" />;
    if (appName.includes("Enterprise")) return <ServerIcon className="h-5 w-5" />;
    if (appName.includes("AI")) return <Code className="h-5 w-5" />;
    return <Code className="h-5 w-5" />;
  };

  const formatBuildTime = (cost: number): string => {
    const seconds = Math.min(10, Math.max(2, cost / 100));
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <>
      <motion.div
        className="mt-16 mb-20 p-4 grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section with current apps */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5 text-emerald-500" /> Your App Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dev.apps.length > 0 ? (
                <div className="space-y-3">
                  {dev.apps.map((app, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        {getAppIcon(app.name)}
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <ArrowUpCircle className="h-3 w-3 text-emerald-400" />
                            Generating income
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-0">
                        +{formatCurrency(app.income)}/hr
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">No apps developed yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Available apps section */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="h-5 w-5 text-emerald-500" /> Develop New App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {availableApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-800/40 rounded-lg border border-slate-700/50 p-3 cursor-pointer hover:bg-slate-800/60 transition-colors"
                    onClick={() => showAppDetails(app)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getAppIcon(app.name)}
                        <span className="font-medium">{app.name}</span>
                      </div>
                      {app.cost > 0 ? (
                        <Badge variant="outline" className={`${userBalance >= app.cost ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'} border-0`}>
                          {formatCurrency(app.cost)}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-0">
                          Free
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{app.description}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <ArrowUpCircle className="h-3 w-3 text-emerald-400" />
                        {formatCurrency(app.income)}/hr
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatBuildTime(app.cost)}
                      </div>
                    </div>
                  </div>
                ))}

                {devApps
                  .filter(app => (app.requiredLevel || 0) > devLevel)
                  .map((app) => (
                    <div
                      key={app.id}
                      className="bg-slate-800/20 rounded-lg border border-slate-700/30 p-3 opacity-70"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Lock className="h-5 w-5 text-slate-500" />
                          <span className="font-medium">{app.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-slate-700/30 text-slate-500 border-0">
                          Lvl {app.requiredLevel}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{app.description}</p>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <ArrowUpCircle className="h-3 w-3" />
                          {formatCurrency(app.income)}/hr
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Level {app.requiredLevel} required
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* App development dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && cancelBuild()}>
        <DialogContent className="bg-slate-900 border-emerald-500/30 border">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getAppIcon(selectedApp.name)}
                  <span>{selectedApp.name}</span>
                </DialogTitle>
                <DialogDescription>
                  {selectedApp.description}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="flex justify-between mb-2 text-sm">
                  <div className="flex items-center gap-1">
                    <ArrowUpCircle className="h-4 w-4 text-emerald-400" />
                    Income: {formatCurrency(selectedApp.income)}/hr
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-slate-400" />
                    Time: {formatBuildTime(selectedApp.cost)}
                  </div>
                </div>

                {isBuildingApp ? (
                  <div className="space-y-4 mt-4">
                    <div className="relative">
                      <Progress value={buildProgress} className="h-2 bg-slate-700" />
                      <div className="text-center text-xs mt-2 text-slate-400">
                        {buildProgress}% complete
                      </div>
                    </div>
                    <div className="text-center text-slate-300">
                      Development in progress...
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="text-center mb-2">
                      Cost: <span className={userBalance >= selectedApp.cost ? 'text-emerald-400' : 'text-rose-400'}>
                        {formatCurrency(selectedApp.cost)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 text-center mb-2">
                      Your balance: {formatCurrency(userBalance)}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-col gap-2">
                {!isBuildingApp && (
                  <>
                    <Button
                      onClick={() => startBuildingApp()}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={userBalance < selectedApp.cost}
                    >
                      Develop App
                    </Button>
                    <Button
                      onClick={cancelBuild}
                      className="w-full"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
