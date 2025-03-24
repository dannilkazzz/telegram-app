import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Gets the base path for assets and links
 * Handles the GitHub Pages deployment path
 */
export function getBasePath() {
  return process.env.NODE_ENV === 'production' ? '/dev-vs-byte' : '';
}

// Using declaration merging instead of interface extension
export function getTelegramWebApp() {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).Telegram?.WebApp;
  }
  return null;
}

export function showTelegramPopup(title: string, message: string) {
  const tgApp = getTelegramWebApp();
  if (tgApp) {
    try {
      tgApp.showPopup({
        title,
        message,
        buttons: [{ type: "close" }],
      });
    } catch (error) {
      console.error("Error showing Telegram popup:", error);
      alert(`${title}\n${message}`);
    }
  } else {
    alert(`${title}\n${message}`);
  }
}
