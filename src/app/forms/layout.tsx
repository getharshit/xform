import { ReactNode } from "react";
import Link from "next/link";
import { FormInput, BarChart3, Settings } from "lucide-react";

interface FormsLayoutProps {
  children: ReactNode;
}

export default function FormsLayout({ children }: FormsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/forms" className="flex items-center gap-2">
              <FormInput className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                FormBuilder
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/forms"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Forms
              </Link>
              <Link
                href="/analytics"
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
              <Link
                href="/settings"
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
