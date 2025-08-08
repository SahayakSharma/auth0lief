'use client'
import { useUser } from "@auth0/nextjs-auth0"
import { useEffect } from "react";

export default function StaffDashboard(){
    const {user,isLoading}=useUser();
    return(
        <main>
            This is staff dashboard
            <a href="/auth/logout">logout</a>
        </main>
    )
}