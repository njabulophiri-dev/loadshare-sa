import { Suspense } from "react";
import AuthErrorContent from "./AuthErrorContent";

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
