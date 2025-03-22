"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type TeamType = "dev" | "byte" | "";
type CategoryType = { name: string; icon: string };

interface DevStats {
  appsCreated: number;
  securityLevel: number;
  courtCasesWon: number;
  operationsCompleted: number;
}

interface ByteStats {
  systemsHacked: number;
  softwareCreated: number;
  appsHacked: number;
  operationsCompleted: number;
}

interface TaskProgress {
  dailyTasks: Record<string, number>;
  limitedTasks: Record<string, number>;
  regularTasks: Record<string, number>;
}

interface GameState {
  // User properties
  userTeam: TeamType;
  userBalance: number;
  passiveIncome: number;
  lastOnlineTime: number;

  // Game data
  dev: {
    categories: CategoryType[];
    apps: Array<{ name: string; income: number }>;
    stats: DevStats;
  };
  byte: {
    categories: CategoryType[];
    tools: Array<{ name: string; income: number }>;
    stats: ByteStats;
  };
  taskProgress: TaskProgress;

  // Actions
  selectTeam: (team: TeamType) => void;
  calculateOfflineEarnings: () => number;
  updateBalance: (amount: number) => void;
  updateIncome: (amount: number) => void;
  resetGame: () => void;
  addDevApp: (app: { name: string; income: number }) => void;
  addByteTool: (tool: { name: string; income: number }) => void;
  updateDevStats: (stats: Partial<DevStats>) => void;
  updateByteStats: (stats: Partial<ByteStats>) => void;
  completeTask: (taskId: string, taskType: keyof TaskProgress, reward: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Default values
      userTeam: "",
      userBalance: 0,
      passiveIncome: 0,
      lastOnlineTime: Date.now(),

      dev: {
        categories: [
          { name: "Apps", icon: "💻" },
          { name: "Security", icon: "🔒" },
          { name: "Court", icon: "⚖️" },
        ],
        apps: [],
        stats: {
          appsCreated: 0,
          securityLevel: 1,
          courtCasesWon: 0,
          operationsCompleted: 0,
        },
      },

      byte: {
        categories: [
          { name: "Hack", icon: "🔓" },
          { name: "Software", icon: "🛠️" },
        ],
        tools: [],
        stats: {
          systemsHacked: 0,
          softwareCreated: 0,
          appsHacked: 0,
          operationsCompleted: 0,
        },
      },

      taskProgress: {
        dailyTasks: {},
        limitedTasks: {},
        regularTasks: {},
      },

      // Actions
      selectTeam: (team) => {
        set({ userTeam: team });

        if (team === "dev") {
          // Give first free app
          const state = get();
          if (state.dev.apps.length === 0) {
            const firstApp = { name: "Basic App", income: 1 };
            set({
              dev: {
                ...state.dev,
                apps: [firstApp]
              },
              passiveIncome: 1
            });
          }
        } else if (team === "byte") {
          // Give first free tool
          const state = get();
          if (state.byte.tools.length === 0) {
            const firstTool = { name: "Basic Hack Tool", income: 1 };
            set({
              byte: {
                ...state.byte,
                tools: [firstTool]
              },
              passiveIncome: 1
            });
          }
        }
      },

      calculateOfflineEarnings: () => {
        const state = get();
        const timeOffline = Math.max(0, (Date.now() - state.lastOnlineTime) / 1000);
        const earnings = (state.passiveIncome / 3600) * timeOffline;
        set({
          userBalance: state.userBalance + earnings,
          lastOnlineTime: Date.now()
        });
        return earnings;
      },

      updateBalance: (amount) => {
        set((state) => ({ userBalance: state.userBalance + amount }));
      },

      updateIncome: (amount) => {
        set((state) => ({ passiveIncome: state.passiveIncome + amount }));
      },

      resetGame: () => {
        set({
          userTeam: "",
          userBalance: 0,
          passiveIncome: 0,
          lastOnlineTime: Date.now(),
          dev: {
            categories: [
              { name: "Apps", icon: "💻" },
              { name: "Security", icon: "🔒" },
              { name: "Court", icon: "⚖️" },
            ],
            apps: [],
            stats: {
              appsCreated: 0,
              securityLevel: 1,
              courtCasesWon: 0,
              operationsCompleted: 0,
            },
          },
          byte: {
            categories: [
              { name: "Hack", icon: "🔓" },
              { name: "Software", icon: "🛠️" },
            ],
            tools: [],
            stats: {
              systemsHacked: 0,
              softwareCreated: 0,
              appsHacked: 0,
              operationsCompleted: 0,
            },
          },
          taskProgress: {
            dailyTasks: {},
            limitedTasks: {},
            regularTasks: {},
          },
        });
      },

      addDevApp: (app) => {
        set((state) => ({
          dev: {
            ...state.dev,
            apps: [...state.dev.apps, app],
          },
          passiveIncome: state.passiveIncome + app.income,
        }));
      },

      addByteTool: (tool) => {
        set((state) => ({
          byte: {
            ...state.byte,
            tools: [...state.byte.tools, tool],
          },
          passiveIncome: state.passiveIncome + tool.income,
        }));
      },

      updateDevStats: (stats) => {
        set((state) => ({
          dev: {
            ...state.dev,
            stats: {
              ...state.dev.stats,
              ...stats,
            },
          },
        }));
      },

      updateByteStats: (stats) => {
        set((state) => ({
          byte: {
            ...state.byte,
            stats: {
              ...state.byte.stats,
              ...stats,
            },
          },
        }));
      },

      completeTask: (taskId, taskType, reward) => {
        const state = get();
        // Add reward to balance
        set({
          userBalance: state.userBalance + reward,
          taskProgress: {
            ...state.taskProgress,
            [taskType]: {
              ...state.taskProgress[taskType],
              [taskId]: Date.now()
            }
          }
        });
      }
    }),
    {
      name: "dev-byte-game-storage",
    }
  )
);
