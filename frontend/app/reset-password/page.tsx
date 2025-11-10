import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center pt-20">Loading reset form...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
