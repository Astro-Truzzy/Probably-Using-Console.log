import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { canAccessAdminFromCookies } from "@lib/auth-crypto";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const store = await cookies();
  if (!(await canAccessAdminFromCookies(store))) {
    redirect("/");
  }

  return <AdminClient />;
}
