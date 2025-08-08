
import { auth0 } from "@/lib/auth0"

export default async function AdminDashboard(){

    const session=await auth0.getSession();

    return(
        <main>
            ha ha I am admin
            <a href="/auth/logout">logout</a>
        </main>
    )
}