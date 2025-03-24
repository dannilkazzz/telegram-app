import { GameLayout } from "@/components/game-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev vs Byte | Create Apps or Hack Systems",
  description: "Choose your side in this digital battle. Developers create apps and mine money. Hackers exploit systems and steal assets. Which side will you choose?",
};

export default function Home() {
  return <GameLayout />;
}
