/**
 * Game data and types for the Dev vs Byte game
 */

// App and Tool type definitions
export interface DevApp {
  name: string;
  income: number;
}

export interface ByteTool {
  name: string;
  income: number;
  hackBoost?: number;
}

// Task type definition
export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  time?: string; // Keeping the time property as instructed
  requiredLevel?: number;
}

// HackableTarget definition for Byte team
export interface HackableTarget {
  name: string;
  owner: string;
  balance: number;
  income: number;
  security: number;
}

// LeaderboardUser definition
export interface LeaderboardUser {
  name: string;
  points: number;
  income: number;
}

// Dev apps data
export const devApps = [
  {
    id: "app-1",
    name: "Simple Blog",
    description: "A basic blogging application.",
    cost: 0, // Free first app
    income: 5,
    requiredLevel: 1
  },
  {
    id: "app-2",
    name: "Mobile Calculator",
    description: "A calculator app for smartphones.",
    cost: 100,
    income: 10,
    requiredLevel: 1
  },
  {
    id: "app-3",
    name: "Social Feed",
    description: "A simple social media feed viewer.",
    cost: 200,
    income: 20,
    requiredLevel: 1
  },
  {
    id: "app-4",
    name: "E-Commerce Template",
    description: "A template for online stores.",
    cost: 500,
    income: 50,
    requiredLevel: 2
  },
  {
    id: "app-5",
    name: "Mobile Game",
    description: "A simple mobile game with in-app purchases.",
    cost: 1000,
    income: 100,
    requiredLevel: 2
  },
  {
    id: "app-6",
    name: "CRM System",
    description: "Customer relationship management software.",
    cost: 2000,
    income: 200,
    requiredLevel: 3
  },
  {
    id: "app-7",
    name: "Enterprise ERP",
    description: "Enterprise resource planning software.",
    cost: 5000,
    income: 500,
    requiredLevel: 4
  },
  {
    id: "app-8",
    name: "AI Assistant",
    description: "Artificial intelligence powered assistant.",
    cost: 10000,
    income: 1000,
    requiredLevel: 5
  }
];

// Byte tools data
export const byteTools = [
  {
    id: "tool-1",
    name: "Basic Password Cracker",
    description: "A simple tool for cracking weak passwords.",
    cost: 0, // Free first tool
    income: 5,
    hackBoost: 0.1,
    requiredLevel: 1
  },
  {
    id: "tool-2",
    name: "Network Scanner",
    description: "Scans networks for vulnerabilities.",
    cost: 100,
    income: 10,
    hackBoost: 0.1,
    requiredLevel: 1
  },
  {
    id: "tool-3",
    name: "Malware Injector",
    description: "Injects simple malware into vulnerable systems.",
    cost: 200,
    income: 20,
    hackBoost: 0.15,
    requiredLevel: 1
  },
  {
    id: "tool-4",
    name: "Botnet Starter",
    description: "A small network of compromised computers.",
    cost: 500,
    income: 50,
    hackBoost: 0.2,
    requiredLevel: 2
  },
  {
    id: "tool-5",
    name: "Zero-Day Exploit",
    description: "Exploits undiscovered vulnerabilities.",
    cost: 1000,
    income: 100,
    hackBoost: 0.25,
    requiredLevel: 2
  },
  {
    id: "tool-6",
    name: "Advanced Backdoor",
    description: "Creates persistent access to systems.",
    cost: 2000,
    income: 200,
    hackBoost: 0.3,
    requiredLevel: 3
  },
  {
    id: "tool-7",
    name: "Enterprise Infiltrator",
    description: "Specialized for enterprise system breaches.",
    cost: 5000,
    income: 500,
    hackBoost: 0.35,
    requiredLevel: 4
  },
  {
    id: "tool-8",
    name: "Quantum Hacking Suite",
    description: "Advanced quantum computing based hacking tools.",
    cost: 10000,
    income: 1000,
    hackBoost: 0.4,
    requiredLevel: 5
  }
];

// Task data
export const tasksData = {
  limited: {
    dev: [
      {
        id: "dev_limited_1",
        title: "Develop Launch App",
        description: "Create your first app to start generating income",
        reward: 50
      },
      {
        id: "dev_limited_2",
        title: "Upgrade Security",
        description: "Enhance your security to level 2",
        reward: 100
      }
    ],
    byte: [
      {
        id: "byte_limited_1",
        title: "Develop First Hack Tool",
        description: "Create your first hacking tool",
        reward: 50
      },
      {
        id: "byte_limited_2",
        title: "First Successful Hack",
        description: "Successfully hack your first target",
        reward: 100
      }
    ]
  },
  daily: {
    dev: [
      {
        id: "dev_daily_1",
        title: "Create New App",
        description: "Develop a new app today",
        reward: 25,
        time: "Daily"
      },
      {
        id: "dev_daily_2",
        title: "Upgrade Security",
        description: "Enhance your security level",
        reward: 30,
        time: "Daily"
      }
    ],
    byte: [
      {
        id: "byte_daily_1",
        title: "Attempt Hack",
        description: "Try to hack a system today",
        reward: 25,
        time: "Daily"
      },
      {
        id: "byte_daily_2",
        title: "Develop Exploit",
        description: "Create a new hacking tool",
        reward: 30,
        time: "Daily"
      }
    ],
    common: [
      {
        id: "common_daily_1",
        title: "Login Daily",
        description: "Log in to the game",
        reward: 10,
        time: "Daily"
      }
    ]
  },
  regular: {
    dev: [
      {
        id: "dev_regular_1",
        title: "Own 5 Apps",
        description: "Have 5 different apps in your portfolio",
        reward: 200
      },
      {
        id: "dev_regular_2",
        title: "Security Level 5",
        description: "Reach security level 5",
        reward: 300
      },
      {
        id: "dev_regular_3",
        title: "Win 10 Courts",
        description: "Win 10 court cases against hackers",
        reward: 500
      }
    ],
    byte: [
      {
        id: "byte_regular_1",
        title: "Create 3 Tools",
        description: "Have 3 different hacking tools",
        reward: 200
      },
      {
        id: "byte_regular_2",
        title: "Hack 20 Apps",
        description: "Successfully hack 20 different apps",
        reward: 300
      },
      {
        id: "byte_regular_3",
        title: "Develop 5 Exploits",
        description: "Create 5 different advanced exploits",
        reward: 500
      }
    ],
    common: [
      {
        id: "common_regular_1",
        title: "Complete 3 Ops",
        description: "Complete 3 operations",
        reward: 50
      },
      {
        id: "common_regular_2",
        title: "Reach Income",
        description: "Reach $100/hr passive income",
        reward: 100
      },
      {
        id: "common_regular_3",
        title: "Complete 50 Ops",
        description: "Complete 50 operations",
        reward: 1000
      }
    ]
  }
};

// Leaderboard data
export const leaderboardData = {
  devs: [
    { name: "TechWhiz", points: 1254, income: 3204 },
    { name: "CodeMaster", points: 987, income: 2560 },
    { name: "AppGuru", points: 845, income: 1980 },
    { name: "DevNinja", points: 723, income: 1450 },
    { name: "ByteBuilder", points: 654, income: 1104 },
    { name: "StackOverflower", points: 532, income: 890 },
    { name: "GitCommitter", points: 432, income: 754 }
  ],
  bytes: [
    { name: "H4X0R", points: 1198, income: 3102 },
    { name: "Ph4nt0m", points: 1032, income: 2780 },
    { name: "CyberShadow", points: 876, income: 2104 },
    { name: "DarkByte", points: 764, income: 1560 },
    { name: "Cr4ck3r", points: 632, income: 1230 },
    { name: "NullPointer", points: 524, income: 870 },
    { name: "RootAccess", points: 412, income: 654 }
  ]
};

// Function to generate hackable targets for byte team
export function getHackableTargets(): HackableTarget[] {
  return [
    {
      name: "Personal Blog",
      owner: "@blogger123",
      balance: 150,
      income: 5,
      security: 1
    },
    {
      name: "Small Business Site",
      owner: "@localbiz",
      balance: 500,
      income: 25,
      security: 2
    },
    {
      name: "E-commerce Store",
      owner: "@shopmaster",
      balance: 2000,
      income: 100,
      security: 3
    },
    {
      name: "Banking Portal",
      owner: "@securemoney",
      balance: 10000,
      income: 500,
      security: 5
    },
    {
      name: "Social Media App",
      owner: "@socialconnect",
      balance: 5000,
      income: 250,
      security: 4
    },
    {
      name: "Gaming Platform",
      owner: "@gameover",
      balance: 3000,
      income: 150,
      security: 3
    },
    {
      name: "News Site",
      owner: "@dailybytes",
      balance: 1000,
      income: 50,
      security: 2
    },
    {
      name: "Weather App",
      owner: "@stormchaser",
      balance: 300,
      income: 15,
      security: 1
    },
    {
      name: "Fitness Tracker",
      owner: "@fitcoder",
      balance: 800,
      income: 40,
      security: 2
    },
    {
      name: "Travel Booking",
      owner: "@wanderlust",
      balance: 4000,
      income: 200,
      security: 4
    }
  ];
}
