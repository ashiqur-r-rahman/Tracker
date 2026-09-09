"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

const nav = [["⌂", "Home", "/"], ["▣", "Projects", "/projects"], ["◫", "Papers", "/papers"], ["◌", "Team", "/team"], ["!", "Attention", "/attention"]];

export function ShellNavigation({ children, profile }: { children: React.ReactNode; profile: { username: string; display_name: string; role: string } | null }) {
  const path = usePathname();
  const username = profile?.username || "member";
  const initials = username.slice(0, 2).toUpperCase();
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="mark" />Meridian</div><nav>{nav.map(([icon, label, href]) => <Link key={href} href={href} className={(href === "/" ? path === href : path.startsWith(href)) ? "active" : ""}><span>{icon}</span>{label}</Link>)}</nav><div className={`user-card user-${username}`}><div className="avatar">{initials}</div><div><b>{username}</b><small>{profile?.role || "member"}</small></div><LogoutButton /></div></aside><section className="page"><header className="topbar"><span>Workspace / {path === "/" ? "Home" : path.split("/")[1]}</span></header>{children}</section></div>;
}