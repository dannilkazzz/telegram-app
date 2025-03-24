"use client";

import { useGameStore } from "@/lib/store/game-store";
import { formatCurrency, showTelegramPopup } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { tasksData } from "@/lib/game-data";
import { CheckCircle, Clock, TimerIcon } from "lucide-react";
import { Task } from "@/lib/game-data";

export function TasksSection() {
  const { userTeam, userBalance, updateBalance } = useGameStore();

  // Define container animation
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

  // Handle task completion
  const completeTask = (taskId: string, reward: number) => {
    updateBalance(reward);
    showTelegramPopup(
      "Task Completed!",
      `You've earned ${formatCurrency(reward)} for completing this task.`
    );
  };

  // Get the appropriate tasks based on user team
  const getTeamTasks = (): Task[] => {
    if (!userTeam) return [];

    // Get team-specific limited tasks
    const limitedTasks = tasksData.limited[userTeam as keyof typeof tasksData.limited] || [];

    // Get team-specific daily tasks
    const dailyTasks = tasksData.daily[userTeam as keyof typeof tasksData.daily] || [];

    // Get common daily tasks
    const commonDailyTasks = tasksData.daily.common || [];

    // Get team-specific regular tasks
    const regularTasks = tasksData.regular[userTeam as keyof typeof tasksData.regular] || [];

    // Get common regular tasks
    const commonRegularTasks = tasksData.regular.common || [];

    return [
      ...limitedTasks,
      ...dailyTasks,
      ...commonDailyTasks,
      ...regularTasks,
      ...commonRegularTasks
    ];
  };

  const tasks = getTeamTasks();
  const accentColor = userTeam === "dev" ? "border-emerald-500/40" : "border-rose-500/40";
  const accentBg = userTeam === "dev" ? "from-emerald-500/10 to-cyan-500/10" : "from-rose-500/10 to-orange-500/10";
  const buttonStyle = userTeam === "dev" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700";

  const dailyTasks = tasks.filter(task => 'time' in task && task.time === "Daily");
  const limitedTasks = tasks.filter(task => !('time' in task) && task.id.includes("limited"));
  const milestoneTasks = tasks.filter(task => !('time' in task) && !task.id.includes("limited"));

  return (
    <motion.div
      className="mt-16 mb-20 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className={`bg-gradient-to-br ${accentBg} border-2 ${accentColor} mb-4 overflow-hidden`}>
          <div className={`h-1.5 w-full bg-gradient-to-r ${userTeam === "dev" ? "from-emerald-500 to-cyan-500" : "from-rose-500 to-orange-500"}`} />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyTasks.map(task => (
                <div key={task.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-xs text-slate-400">{task.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-0">
                      <Clock className="h-3 w-3 mr-1" /> Daily
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="outline" className="bg-emerald-500/10 border-0 text-emerald-400">
                      +{formatCurrency(task.reward)}
                    </Badge>
                    <Button
                      onClick={() => completeTask(task.id, task.reward)}
                      size="sm"
                      className={buttonStyle}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
              {dailyTasks.length === 0 && (
                <div className="text-center py-4 text-slate-400">No daily tasks available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className={`bg-gradient-to-br ${accentBg} border-2 ${accentColor} mb-4 overflow-hidden`}>
          <div className={`h-1.5 w-full bg-gradient-to-r ${userTeam === "dev" ? "from-emerald-500 to-cyan-500" : "from-rose-500 to-orange-500"}`} />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Limited Time Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {limitedTasks.map(task => (
                <div key={task.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-xs text-slate-400">{task.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-0">
                      <TimerIcon className="h-3 w-3 mr-1" /> Limited
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="outline" className="bg-emerald-500/10 border-0 text-emerald-400">
                      +{formatCurrency(task.reward)}
                    </Badge>
                    <Button
                      onClick={() => completeTask(task.id, task.reward)}
                      size="sm"
                      className={buttonStyle}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
              {limitedTasks.length === 0 && (
                <div className="text-center py-4 text-slate-400">No limited time tasks available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className={`bg-gradient-to-br ${accentBg} border-2 ${accentColor} overflow-hidden`}>
          <div className={`h-1.5 w-full bg-gradient-to-r ${userTeam === "dev" ? "from-emerald-500 to-cyan-500" : "from-rose-500 to-orange-500"}`} />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Milestone Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestoneTasks.map(task => (
                <div key={task.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-xs text-slate-400">{task.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-0">
                      <CheckCircle className="h-3 w-3 mr-1" /> Milestone
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="outline" className="bg-emerald-500/10 border-0 text-emerald-400">
                      +{formatCurrency(task.reward)}
                    </Badge>
                    <Button
                      onClick={() => completeTask(task.id, task.reward)}
                      size="sm"
                      className={buttonStyle}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
              {milestoneTasks.length === 0 && (
                <div className="text-center py-4 text-slate-400">No milestone tasks available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
