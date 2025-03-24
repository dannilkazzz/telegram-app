import Link from "next/link";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Dev vs Byte - Test Page</h1>
      <p className="text-xl mb-8">
        This is a simple test page to check if the server is rendering correctly.
      </p>
      <div className="p-6 bg-slate-800 rounded-lg max-w-lg">
        <p className="mb-4">
          If you can see this page, the Next.js server is working properly. The issue may be with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Client-side JavaScript errors</li>
          <li>Problems with localStorage or Zustand store</li>
          <li>Issues with Telegram Web App integration</li>
          <li>CSS or styling problems</li>
        </ul>
      </div>
      <Link href="/" className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
        Back to Main Game
      </Link>
    </div>
  );
}
