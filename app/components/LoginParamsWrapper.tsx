"use client";

import LoginForm from "./LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginParamsWrapper() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirectTo = searchParams.get("redirect_to") || "";

  return <LoginForm email={email} redirectTo={redirectTo} />;
}
