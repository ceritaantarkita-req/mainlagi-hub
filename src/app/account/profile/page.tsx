import type { Metadata } from "next";
import { ProfileEditor } from "@/components/account/ProfileEditor";

export const metadata: Metadata = { title: "Profile | Mainlagi Hub" };

export default function ProfilePage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section account-page">
        <header className="fun-section__head">
          <h2>Profile</h2>
        </header>
        <ProfileEditor />
      </section>
    </div>
  );
}
