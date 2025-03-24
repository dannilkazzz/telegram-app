"use client";

import { useGameStore } from "@/lib/store/game-store";
import { leaderboardData, LeaderboardUser } from "@/lib/game-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Trophy, Zap, Activity, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function LeadersSection() {
  const { userTeam } = useGameStore();

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Get avatar letter from name
  const getAvatarLetter = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // Leaderboard avatar background based on rank
  const getRankBg = (rank: number): string => {
    switch (rank) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-slate-700";
    }
  };

  // Get medal icon based on rank
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Trophy className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Trophy className="h-4 w-4 text-amber-600" />;
      default:
        return <Medal className="h-3 w-3 text-slate-500" />;
    }
  };

  // Render a single leaderboard column
  const renderLeaderboard = (title: string, data: LeaderboardUser[], isDevLeaderboard: boolean) => {
    const accentColor = isDevLeaderboard ? "from-emerald-500 to-cyan-500" : "from-rose-500 to-orange-500";
    const accentBorder = isDevLeaderboard ? "border-emerald-500/40" : "border-rose-500/40";
    const accentBg = isDevLeaderboard ? "from-emerald-500/10 to-cyan-500/10" : "from-rose-500/10 to-orange-500/10";
    const accentText = isDevLeaderboard ? "text-emerald-500" : "text-rose-500";

    return (
      <motion.div variants={itemVariants}>
        <Card className={`border-2 ${accentBorder} bg-gradient-to-br ${accentBg} overflow-hidden`}>
          <div className={`h-1.5 w-full bg-gradient-to-r ${accentColor}`} />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className={`h-5 w-5 ${accentText}`} /> {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.map((user, index) => (
              <div
                key={user.name}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  index < 3 ? 'bg-slate-800/80' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`flex items-center justify-center w-6 h-6 rounded-full bg-transparent p-0 border-0`}
                  >
                    {getRankIcon(index + 1)}
                  </Badge>
                  <Avatar className={`${getRankBg(index + 1)} border-2 border-slate-800`}>
                    <AvatarFallback>{getAvatarLetter(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{user.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Activity className="h-3 w-3" /> {user.points} points
                    </div>
                  </div>
                </div>
                <div className={`${accentText} flex items-center gap-1 font-medium`}>
                  <Zap className="h-4 w-4" /> {formatCurrency(user.income)}/hr
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="mt-16 mb-20 p-4 grid gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {renderLeaderboard("Top Developers", leaderboardData.devs, true)}
      {renderLeaderboard("Top Hackers", leaderboardData.bytes, false)}

      <motion.div variants={itemVariants} className="text-center text-sm text-slate-400 mt-4">
        <p>Complete tasks and increase your income to climb the leaderboards!</p>
      </motion.div>
    </motion.div>
  );
}
