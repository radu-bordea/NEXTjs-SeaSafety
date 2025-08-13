// components/NavbarWrapper.tsx
import { getCurrentuser } from "@/app/lib/current-user";
import { Navbar } from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getCurrentuser();

  const navbarUser =
    user === null ? null : { ...user, name: user.name ?? "Unknown" }; // replace null with default

  return <Navbar user={navbarUser} />;
}

