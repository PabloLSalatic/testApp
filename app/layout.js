import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-200 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/expense-tracker">Expense Tracker</Link>
            </li>
            <li>
              <Link href="/shopping-list">Shopping List</Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
