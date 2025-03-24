"use client";

import { useGameStore } from "@/lib/store/game-store";
import { byteTools } from "@/lib/game-data";
import { formatCurrency, showTelegramPopup } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowUpCircle,
  Clock,
  Code,
  Terminal,
  Skull,
  Lock,
  NetworkIcon,
  ShieldAlert,
  SearchCode,
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

export function ByteToolsSection() {
  const { userBalance, updateBalance, byte, addByteTool, updateByteStats } = useGameStore();
  const [selectedTool, setSelectedTool] = useState<typeof byteTools[0] | null>(null);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isBuildingTool, setIsBuildingTool] = useState(false);

  // Determine which tools are available based on byte level
  const byteLevel = Math.min(5, Math.ceil(byte.tools.length / 2) || 1);
  const availableTools = byteTools.filter(tool => (tool.requiredLevel || 0) <= byteLevel);

  // Show tool details and start building
  const showToolDetails = (tool: typeof byteTools[0]) => {
    setSelectedTool(tool);
  };

  // Handle tool building
  const startBuildingTool = () => {
    if (!selectedTool) return;
    if (userBalance < selectedTool.cost) {
      showTelegramPopup(
        "Insufficient Funds",
        `You need ${formatCurrency(selectedTool.cost)} to develop this hacking tool.`
      );
      return;
    }

    // Deduct cost
    updateBalance(-selectedTool.cost);

    // Start building progress
    setIsBuildingTool(true);

    // Calculate build time in seconds (more expensive tools take longer)
    const buildTimeMs = Math.min(10000, Math.max(2000, selectedTool.cost / 100 * 1000));
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

  // Complete the tool building
  const completeBuild = () => {
    if (!selectedTool) return;

    // Add tool to inventory
    addByteTool({
      name: selectedTool.name,
      income: selectedTool.income
    });

    // Update stats
    updateByteStats({
      softwareCreated: byte.stats.softwareCreated + 1,
      operationsCompleted: byte.stats.operationsCompleted + 1
    });

    // Show success message
    showTelegramPopup(
      "Hack Tool Development Complete!",
      `Your new ${selectedTool.name} is now generating ${formatCurrency(selectedTool.income)}/hr and improves your hack success rate!`
    );

    // Reset dialog
    setIsBuildingTool(false);
    setBuildProgress(0);
    setSelectedTool(null);
  };

  // Cancel building and close dialog
  const cancelBuild = () => {
    setSelectedTool(null);
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

  // Get tool icon based on name/type
  const getToolIcon = (toolName: string) => {
    if (toolName.includes("Password")) return <ShieldAlert className="h-5 w-5" />;
    if (toolName.includes("Malware")) return <Skull className="h-5 w-5" />;
    if (toolName.includes("Botnet")) return <NetworkIcon className="h-5 w-5" />;
    if (toolName.includes("Zero-Day")) return <Code className="h-5 w-5" />;
    if (toolName.includes("Backdoor")) return <Terminal className="h-5 w-5" />;
    if (toolName.includes("Quantum")) return <SearchCode className="h-5 w-5" />;
    return <Terminal className="h-5 w-5" />;
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
        {/* Header section with current tools */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-orange-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-orange-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Terminal className="h-5 w-5 text-rose-500" /> Your Hack Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              {byte.tools.length > 0 ? (
                <div className="space-y-3">
                  {byte.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        {getToolIcon(tool.name)}
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <ArrowUpCircle className="h-3 w-3 text-rose-400" />
                            Generating income
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-0">
                        +{formatCurrency(tool.income)}/hr
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">No hacking tools developed yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Available tools section */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-orange-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-orange-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5 text-rose-500" /> Develop New Tool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {availableTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-slate-800/40 rounded-lg border border-slate-700/50 p-3 cursor-pointer hover:bg-slate-800/60 transition-colors"
                    onClick={() => showToolDetails(tool)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getToolIcon(tool.name)}
                        <span className="font-medium">{tool.name}</span>
                      </div>
                      {tool.cost > 0 ? (
                        <Badge variant="outline" className={`${userBalance >= tool.cost ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700/50 text-slate-400'} border-0`}>
                          {formatCurrency(tool.cost)}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-0">
                          Free
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{tool.description}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <ArrowUpCircle className="h-3 w-3 text-rose-400" />
                        {formatCurrency(tool.income)}/hr
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatBuildTime(tool.cost)}
                      </div>
                    </div>
                  </div>
                ))}

                {byteTools
                  .filter(tool => (tool.requiredLevel || 0) > byteLevel)
                  .map((tool) => (
                    <div
                      key={tool.id}
                      className="bg-slate-800/20 rounded-lg border border-slate-700/30 p-3 opacity-70"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Lock className="h-5 w-5 text-slate-500" />
                          <span className="font-medium">{tool.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-slate-700/30 text-slate-500 border-0">
                          Lvl {tool.requiredLevel}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{tool.description}</p>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <ArrowUpCircle className="h-3 w-3" />
                          {formatCurrency(tool.income)}/hr
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Level {tool.requiredLevel} required
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tool development dialog */}
      <Dialog open={!!selectedTool} onOpenChange={(open) => !open && cancelBuild()}>
        <DialogContent className="bg-slate-900 border-rose-500/30 border">
          {selectedTool && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getToolIcon(selectedTool.name)}
                  <span>{selectedTool.name}</span>
                </DialogTitle>
                <DialogDescription>
                  {selectedTool.description}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="flex justify-between mb-2 text-sm">
                  <div className="flex items-center gap-1">
                    <ArrowUpCircle className="h-4 w-4 text-rose-400" />
                    Income: {formatCurrency(selectedTool.income)}/hr
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-slate-400" />
                    Time: {formatBuildTime(selectedTool.cost)}
                  </div>
                </div>

                {selectedTool.hackBoost && (
                  <div className="flex items-center gap-1 mb-2 text-sm">
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                    Hack Success: +{(selectedTool.hackBoost * 100).toFixed(0)}%
                  </div>
                )}

                {isBuildingTool ? (
                  <div className="space-y-4 mt-4">
                    <div className="relative">
                      <Progress value={buildProgress} className="h-2 bg-slate-700" />
                      <div className="text-center text-xs mt-2 text-slate-400">
                        {buildProgress}% complete
                      </div>
                    </div>
                    <div className="text-center text-slate-300">
                      Tool development in progress...
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="text-center mb-2">
                      Cost: <span className={userBalance >= selectedTool.cost ? 'text-emerald-400' : 'text-rose-400'}>
                        {formatCurrency(selectedTool.cost)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 text-center mb-2">
                      Your balance: {formatCurrency(userBalance)}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-col gap-2">
                {!isBuildingTool && (
                  <>
                    <Button
                      onClick={() => startBuildingTool()}
                      className="w-full bg-rose-600 hover:bg-rose-700"
                      disabled={userBalance < selectedTool.cost}
                    >
                      Develop Tool
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
