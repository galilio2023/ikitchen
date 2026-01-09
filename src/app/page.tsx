import { redirect } from "next/navigation";

export default function RootPage() {
  // This sends the user straight to the dashboard logic
  redirect("/dashboard");
}
