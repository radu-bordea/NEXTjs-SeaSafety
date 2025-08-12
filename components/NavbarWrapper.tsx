// components/NavbarWrapper.tsx
import { getCurrentuser } from "@/app/lib/current-user";
import { Navbar } from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getCurrentuser();
  return <Navbar user={user} />;
}
