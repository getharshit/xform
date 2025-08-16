import { ReactNode } from "react";
import Link from "next/link";
import { FormInput, BarChart3, Settings } from "lucide-react";

interface FormsLayoutProps {
  children: ReactNode;
}

export default function FormsLayout({ children }: FormsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
