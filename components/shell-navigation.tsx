"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [["⌂", "Home", "/"], ["▣", "Projects", "/projects"], ["◫", "Papers", "/papers"], ["◌", "Team", "/team"], ["!", "Attention", "/attention"]];

export function ShellNavigation({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="mark" />Meridian</div><nav>{nav.map(([icon, label, href]) => <Link key={href} href={href} className={(href === "/" ? path === href : path.startsWith(href)) ? "active" : ""}><span>{icon}</span>{label}</Link>)}</nav></aside><section className="page"><header className="topbar"><span>Workspace / {path === "/" ? "Home" : path.split("/")[1]}</span></header>{children}</section></div>;
}