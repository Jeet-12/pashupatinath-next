"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";

interface Props {
  children: React.ReactNode;
}

export default function GlobalShell({ children }: Props) {
  const pathname = usePathname() ?? "";
  const hideGlobal = pathname.startsWith("/dashboard/user");

  return (
    <>
      {!hideGlobal && <Header />}
      {children}
      {!hideGlobal && <Footer />}
    </>
  );
}
