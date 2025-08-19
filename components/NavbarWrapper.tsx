// components/NavbarWrapper.tsx
import { getCurrentuser } from "@/app/lib/current-user";
import { Navbar } from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getCurrentuser();

  // Normalize user object
  const navbarUser = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split("@")[0], // fallback: show part of email
      }
    : null;

  return <Navbar user={navbarUser} />;
}
