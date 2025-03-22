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

// Simplified TelegramWebApp popup function to avoid syntax errors
export function showTelegramPopup(title: string, message: string) {
  try {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      // Create params object first to avoid syntax errors
      const params = {
        title,
        message,
      };

      // Define callback separately
      const callback = () => {
        // Empty callback
      };

      // Call the function with separate params
      window.Telegram.WebApp.showPopup(params, callback);
    } else {
      // Fallback to alert if Telegram WebApp is not available
      alert(`${title}\n${message}`);
    }
  } catch (error) {
    console.error("Error showing popup:", error);
    // Fallback to regular alert on error
    alert(`${title}\n${message}`);
  }
}
