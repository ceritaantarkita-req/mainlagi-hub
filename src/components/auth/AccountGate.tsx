"use client";

import Link from "next/link";

/**
 * Shown when a feature needs an authenticated account but the user is a guest.
 */
export function AccountGate({ message }: { message?: string }) {
  return (
    <div className="account-gate">
      <p>{message ?? "Masuk untuk mengelola fitur ini. Kamu tetap bisa bermain tanpa akun."}</p>
      <div className="account-gate__actions">
        <Link className="button button--primary" href="/login">
          Masuk
        </Link>
        <Link className="button button--ghost" href="/signup">
          Buat akun
        </Link>
      </div>
    </div>
  );
}
