"use client";

import LoginForm from "./LoginForm";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginParamsWrapperInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirectTo = searchParams.get("redirect_to") || "";

  return <LoginForm email={email} redirectTo={redirectTo} />;
}

export default function LoginParamsWrapper() {
  return (
    <Suspense fallback={<div className="py-4 text-center">Loading...</div>}>
      <LoginParamsWrapperInner />
    </Suspense>
  );
}
