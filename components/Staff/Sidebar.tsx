'use client'

import { useUser } from "@auth0/nextjs-auth0"
import { Home, User2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function Sidebar(){
    const {user}=useUser();
    const router=useRouter();
    return(
        <main className="w-[18%] h-full border-r-[1px] border-[#e7e7e7] p-5">
            <div className="p-5 border-b-[1px] border-[#e7e7e7] flex items-center gap-5 overflow-hidden">
                {
                    user?.picture  ? <Image src={user.picture} alt="image here" width={50} height={50} className="rounded-full"/> : <User2/>
                }
                <div className="flex flex-col">
                    <p className="font-medium text-[20px]">{user?.name}</p>
                    <Badge variant={'outline'}>Staff</Badge>
                </div>
            </div>

            <div className="bg-[#f1f1f1] rounded-md py-3 text-center mt-10 font-medium cursor-pointer flex items-center justify-center gap-3">
                <Home/>
                <p className="text-[20px]">Home</p>
            </div>
            <div className="hover:bg-[#f1f1f1] rounded-md py-3 text-center mt-5 font-medium cursor-pointer flex items-center justify-center gap-3" onClick={()=>router.replace("/auth/logout")}>
                <LogoutOutlined/>
                <p className="text-[20px]">Logout</p>
            </div>
        </main>
    )
}