import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { Logo } from "@/components/SiteChrome";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getAdmin();
  if (admin) redirect("/admin/orders");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F6F2",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Logo />
        <h1 className="serif" style={{ fontSize: 30, margin: "20px 0 6px", letterSpacing: "-0.02em" }}>
          Admin
        </h1>
        <p style={{ fontSize: 15.5, color: "#56544C", margin: "0 0 20px" }}>
          Bookings, orders and feedback reports.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
