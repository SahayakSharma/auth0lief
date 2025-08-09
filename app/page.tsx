import AdminDashboard from "@/components/Admin/AdminDashboard";
import StaffDashboard from "@/components/Staff/StaffDashboard";
import { UserProvider } from "@/context/userContext";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg text-center space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome</h1>
          <p className="text-gray-500 text-sm">Please sign up or log in to continue</p>
          <div className="flex flex-col gap-3">
            <a
              href="/api/auth/login?screen_hint=signup"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign Up
            </a>
            <a
              href="/api/auth/login"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Log In
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <UserProvider>
        {session.user.email === "admin@gmail.com" ? (
          <AdminDashboard />
        ) : (
          <StaffDashboard />
        )}
      </UserProvider>
    </main>
  );
}
