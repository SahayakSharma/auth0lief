'use client'
import { useUser } from "@auth0/nextjs-auth0"
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import ContentManager from "./ContentManager";

export default function StaffDashboard(){
    const {user,isLoading}=useUser();
    return(
        <main className="w-full h-screen fixed flex">
            <Sidebar/>
            <ContentManager/>
        </main>
    )
}