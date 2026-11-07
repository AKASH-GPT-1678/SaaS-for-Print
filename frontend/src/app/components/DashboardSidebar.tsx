"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  QrCode,
  Settings,
  Users,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Manage QR", href: "/qr", icon: QrCode },
  { label: "Messages", href: "/chat", icon: MessageSquareText },
  { label: "Documents", href: "#", icon: FileText, soon: true },
  { label: "Customers", href: "#", icon: Users, soon: true },
  { label: "History", href: "#", icon: Clock3, soon: true },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-[#dfe8df] bg-[#f8f7f2] px-3 py-4 text-[#173138] transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-[88px]" : "w-72"
      }`}
      aria-label="Dashboard sidebar"
    >
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70]"
          aria-label="Printar dashboard"
        >
          <Image src="/logo.svg" alt="" width={40} height={40} className="shrink-0" />
          {!collapsed ? (
            <span className="truncate text-[23px] font-bold tracking-[-0.8px]">
              Printar<span className="text-[#54826e]">.</span>
            </span>
          ) : null}
        </Link>

        {!collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-lg p-2 text-[#6b807d] transition hover:bg-[#e8f0e6] hover:text-[#173f37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70]"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-5 rounded-lg p-2 text-[#6b807d] transition hover:bg-[#e8f0e6] hover:text-[#173f37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70]"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      ) : null}

      <nav className="mt-8 flex-1" aria-label="Dashboard navigation">
        <p
          className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7c9189] ${
            collapsed ? "text-center" : ""
          }`}
        >
          {collapsed ? "•" : "Workspace"}
        </p>
        <div className="space-y-1">
          {navigation.map(({ label, href, icon: Icon, soon }) => {
            const active = href !== "#" && pathname === href;
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                aria-disabled={soon ? true : undefined}
                onClick={soon ? (event) => event.preventDefault() : undefined}
                className={`group flex items-center rounded-xl px-3 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477c70] ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  active
                    ? "bg-[#173f37] text-white shadow-[0_8px_20px_rgba(23,63,55,0.14)]"
                    : soon
                      ? "cursor-not-allowed text-[#9aa9a1]"
                      : "text-[#58706d] hover:bg-[#e8f0e6] hover:text-[#173f37]"
                }`}
                title={collapsed ? `${label}${soon ? " (coming soon)" : ""}` : undefined}
              >
                <Icon size={19} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
                {!collapsed ? <span>{label}</span> : null}
                {!collapsed && soon ? (
                  <span className="ml-auto text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa9a1]">
                    Soon
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="space-y-1 border-t border-[#dfe8df] pt-3">
        <Link
          href="#"
          onClick={(event) => event.preventDefault()}
          className={`flex items-center rounded-xl px-3 py-3 text-sm font-semibold text-[#9aa9a1] ${
            collapsed ? "justify-center" : "gap-3"
          }`}
          aria-disabled="true"
          title={collapsed ? "Settings (coming soon)" : undefined}
        >
          <Settings size={19} aria-hidden="true" />
          {!collapsed ? <span>Settings</span> : null}
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className={`flex w-full items-center rounded-xl px-3 py-3 text-sm font-semibold text-[#9b625d] transition hover:bg-[#f7e9e5] hover:text-[#9d4138] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9685e] ${
            collapsed ? "justify-center" : "gap-3"
          }`}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut size={19} aria-hidden="true" />
          {!collapsed ? <span>Log out</span> : null}
        </button>
      </div>
    </aside>
  );
}
