"use client";

import { useGameStore } from "@/lib/store/game-store";
import { formatCurrency, showTelegramPopup } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  FileBadge,
  CheckCircle2,
  XCircle,
  History,
  Hourglass,
  BarChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Custom GavelIcon since it's not in Lucide
function GavelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m13 10 7-7" />
      <path d="M20 10 s1 1 1.5 1.5c.5.5 1.5 1.5 1.5 1.5v2h-3z" />
      <path d="m6 10 7-7" />
      <path d="M3 21h18v-2H3z" />
      <path d="M9.1 17.2 A2 2 0 0 1 10.5 16 L12.5 10 L7.5 5 L1.5 10 L7.5 12 L9.1 17.2" />
    </svg>
  );
}

interface CourtCase {
  id: string;
  hackerId: string;
  hackerName: string;
  stolenAmount: number;
  timestamp: number;
  status: 'pending' | 'in_progress' | 'won' | 'lost';
  progress?: number;
  recoveredAmount?: number;
}

export function DevCourtSection() {
  const { userBalance, updateBalance, dev, updateDevStats } = useGameStore();
  const [activeCases, setActiveCases] = useState<CourtCase[]>([
    {
      id: 'case-001',
      hackerId: 'hacker-123',
      hackerName: '@darkbyte',
      stolenAmount: 500,
      timestamp: Date.now() - 86400000, // 1 day ago
      status: 'in_progress',
      progress: 65
    },
    {
      id: 'case-002',
      hackerId: 'hacker-456',
      hackerName: '@codethief',
      stolenAmount: 1200,
      timestamp: Date.now() - 172800000, // 2 days ago
      status: 'pending',
    }
  ]);

  const [pastCases, setPastCases] = useState<CourtCase[]>([
    {
      id: 'case-003',
      hackerId: 'hacker-789',
      hackerName: '@h4ckz0r',
      stolenAmount: 300,
      timestamp: Date.now() - 345600000, // 4 days ago
      status: 'won',
      recoveredAmount: 250
    },
    {
      id: 'case-004',
      hackerId: 'hacker-101',
      hackerName: '@l33tcoder',
      stolenAmount: 800,
      timestamp: Date.now() - 518400000, // 6 days ago
      status: 'lost',
      recoveredAmount: 0
    }
  ]);

  const [selectedCase, setSelectedCase] = useState<CourtCase | null>(null);
  const [showCaseDialog, setShowCaseDialog] = useState(false);
  const [caseProgress, setCaseProgress] = useState(0);
  const [isProcessingCase, setIsProcessingCase] = useState(false);

  // Handle filing a new court case
  const handleNewCase = () => {
    // In a real app, we would load actual hack data or let user enter details
    // Show a dialog to enter or select hack details
    const newCase: CourtCase = {
      id: `case-${Date.now()}`,
      hackerId: `hacker-${Math.floor(Math.random() * 1000)}`,
      hackerName: `@hacker${Math.floor(Math.random() * 100)}`,
      stolenAmount: Math.floor(Math.random() * 1000) + 100,
      timestamp: Date.now(),
      status: 'pending'
    };

    setSelectedCase(newCase);
    setShowCaseDialog(true);
  };

  // Start a court case
  const startCourtCase = () => {
    if (!selectedCase) return;

    // Calculate filing cost (20% of the stolen amount)
    const filingCost = Math.round(selectedCase.stolenAmount * 0.2);

    if (userBalance < filingCost) {
      showTelegramPopup(
        "Insufficient Funds",
        `You need ${formatCurrency(filingCost)} to file this court case.`
      );
      return;
    }

    // Deduct filing cost
    updateBalance(-filingCost);

    // Start case progress
    setIsProcessingCase(true);

    // Calculate court case time (more money = longer case)
    const caseTimeMs = Math.min(15000, Math.max(5000, selectedCase.stolenAmount / 100 * 1000));
    const updateInterval = 100; // Update every 100ms
    const steps = caseTimeMs / updateInterval;
    let currentStep = 0;

    // Update progress
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.floor((currentStep / steps) * 100);
      setCaseProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        completeCourtCase();
      }
    }, updateInterval);
  };

  // Complete a court case
  const completeCourtCase = () => {
    if (!selectedCase) return;

    // Determine case outcome (80% chance of winning)
    const isWon = Math.random() < 0.8;

    // Calculate recovered amount (75-90% if won, 0 if lost)
    const recoveryPercent = isWon ? (Math.random() * 0.15) + 0.75 : 0;
    const recoveredAmount = Math.round(selectedCase.stolenAmount * recoveryPercent);

    // Add recovered amount to balance if won
    if (recoveredAmount > 0) {
      updateBalance(recoveredAmount);
    }

    // Update dev stats
    updateDevStats({
      courtCasesWon: isWon ? dev.stats.courtCasesWon + 1 : dev.stats.courtCasesWon,
      operationsCompleted: dev.stats.operationsCompleted + 1
    });

    // Update the case in the list
    const updatedCase: CourtCase = {
      ...selectedCase,
      status: isWon ? 'won' : 'lost',
      recoveredAmount: recoveredAmount
    };

    // Add to past cases
    setPastCases(prev => [updatedCase, ...prev]);

    // Show success message
    if (isWon) {
      showTelegramPopup(
        "Court Case Won!",
        `You have won your case against ${selectedCase.hackerName} and recovered ${formatCurrency(recoveredAmount)} of the stolen ${formatCurrency(selectedCase.stolenAmount)}.`
      );
    } else {
      showTelegramPopup(
        "Court Case Lost",
        `Unfortunately, you lost your case against ${selectedCase.hackerName}. The court ruled against you and no money was recovered.`
      );
    }

    // Reset state
    setIsProcessingCase(false);
    setCaseProgress(0);
    setShowCaseDialog(false);
    setSelectedCase(null);
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

  // Format timestamp to readable date
  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Calculate filing cost (20% of the stolen amount)
  const calculateFilingCost = (amount: number): number => {
    return Math.round(amount * 0.2);
  };

  return (
    <>
      <motion.div
        className="mt-16 mb-20 p-4 grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Court Overview */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GavelIcon className="h-5 w-5 text-emerald-500" /> Legal Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div>
                  <h3 className="font-medium">Court Stats</h3>
                  <p className="text-sm text-slate-400">Use the legal system to recover stolen assets</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg text-center min-w-[100px]">
                    <div className="text-xl font-bold text-emerald-400">{dev.stats.courtCasesWon}</div>
                    <div className="text-xs text-slate-400">Cases Won</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg text-center min-w-[100px]">
                    <div className="text-xl font-bold text-amber-400">{activeCases.length}</div>
                    <div className="text-xs text-slate-400">Active Cases</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-6 text-lg"
                  onClick={handleNewCase}
                >
                  <FileBadge className="mr-2 h-5 w-5" />
                  File New Case
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Cases */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hourglass className="h-5 w-5 text-emerald-500" /> Active Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeCases.length > 0 ? (
                <div className="space-y-4">
                  {activeCases.map((courtCase) => (
                    <div key={courtCase.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/40">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <span>vs. {courtCase.hackerName}</span>
                            {courtCase.status === 'pending' && (
                              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-0">Pending</Badge>
                            )}
                            {courtCase.status === 'in_progress' && (
                              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-0">In Progress</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-slate-400 mt-1">
                            Amount stolen: {formatCurrency(courtCase.stolenAmount)}
                          </p>
                        </div>
                        <div className="text-xs text-slate-400">
                          {formatTimeAgo(courtCase.timestamp)}
                        </div>
                      </div>

                      {courtCase.status === 'in_progress' && courtCase.progress !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Case progress</span>
                            <span>{courtCase.progress}%</span>
                          </div>
                          <Progress value={courtCase.progress} className="h-1.5" />
                        </div>
                      )}

                      {courtCase.status === 'pending' && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 w-full"
                            onClick={() => {
                              setSelectedCase(courtCase);
                              setShowCaseDialog(true);
                            }}
                          >
                            Process Case ({formatCurrency(calculateFilingCost(courtCase.stolenAmount))})
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <div className="mb-2">No active cases</div>
                  <p className="text-sm">When someone hacks your apps, you can file a case here to recover your losses.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Past Cases */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5 text-emerald-500" /> Case History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pastCases.length > 0 ? (
                <div className="space-y-4">
                  {pastCases.map((courtCase) => (
                    <div key={courtCase.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/40">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <span>vs. {courtCase.hackerName}</span>
                            {courtCase.status === 'won' && (
                              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-0">Won</Badge>
                            )}
                            {courtCase.status === 'lost' && (
                              <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-0">Lost</Badge>
                            )}
                          </h4>
                          <div className="text-sm flex flex-col mt-1">
                            <span className="text-slate-400">
                              Amount stolen: {formatCurrency(courtCase.stolenAmount)}
                            </span>
                            <span className={`${courtCase.status === 'won' ? 'text-emerald-400' : 'text-slate-400'}`}>
                              Amount recovered: {formatCurrency(courtCase.recoveredAmount || 0)}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          {formatTimeAgo(courtCase.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <div className="mb-2">No case history</div>
                  <p className="text-sm">Completed cases will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Court case dialog */}
      <Dialog open={showCaseDialog} onOpenChange={setShowCaseDialog}>
        <DialogContent className="bg-slate-900 border-emerald-500/30 border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GavelIcon className="h-5 w-5 text-emerald-500" />
              <span>Court Case Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedCase && (
            <div className="py-4">
              <div className="bg-slate-800/70 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Case against {selectedCase.hackerName}</h3>
                  <div className="text-xs text-slate-400">
                    {formatTimeAgo(selectedCase.timestamp)}
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount stolen:</span>
                    <span>{formatCurrency(selectedCase.stolenAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Filing fee (20%):</span>
                    <span>{formatCurrency(calculateFilingCost(selectedCase.stolenAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Potential recovery:</span>
                    <span className="text-emerald-400">
                      {formatCurrency(Math.round(selectedCase.stolenAmount * 0.85))} (85%)
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  <div className="flex items-start gap-2 mb-2">
                    <InfoIcon />
                    <p>Filing a court case requires a fee of 20% of the stolen amount, but can recover up to 90% of your losses if successful.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5" />
                    <p>Court cases take time to resolve, and there's a small chance the case may be unsuccessful.</p>
                  </div>
                </div>
              </div>

              {isProcessingCase ? (
                <div className="space-y-4 mt-4">
                  <div className="relative">
                    <Progress value={caseProgress} className="h-2 bg-slate-700" />
                    <div className="text-center text-xs mt-2 text-slate-400">
                      {caseProgress}% complete
                    </div>
                  </div>
                  <div className="text-center text-slate-300">
                    Case in progress...
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  <div className="text-center mb-2">
                    Filing cost: <span className={userBalance >= calculateFilingCost(selectedCase.stolenAmount) ? 'text-emerald-400' : 'text-rose-400'}>
                      {formatCurrency(calculateFilingCost(selectedCase.stolenAmount))}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 text-center mb-2">
                    Your balance: {formatCurrency(userBalance)}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-col gap-2">
            {!isProcessingCase && selectedCase && (
              <>
                <Button
                  onClick={startCourtCase}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={userBalance < calculateFilingCost(selectedCase.stolenAmount)}
                >
                  File Court Case
                </Button>
                <Button
                  onClick={() => setShowCaseDialog(false)}
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

// Helper components
function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mt-0.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
