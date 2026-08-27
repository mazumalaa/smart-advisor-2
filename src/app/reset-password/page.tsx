"use client"

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "./reset-password-form";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  return <ResetPasswordForm token={searchParams.get("token")} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}