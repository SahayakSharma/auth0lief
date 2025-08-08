import AdminDashboard from "@/components/Admin/AdminDashboard";
import StaffDashboard from "@/components/Staff/StaffDashboard";
import { UserProvider } from "@/context/userContext";
import { auth0 } from "@/lib/auth0"; 

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">Sign up</a>
        <a href="/auth/login">Log in</a>
      </main>
    );
  }



  return (
    <main>
      <UserProvider>
        {
          session.user.email === 'admin@gmail.com' ? <AdminDashboard /> : <StaffDashboard />
        }
      </UserProvider>
    </main>
  );
}