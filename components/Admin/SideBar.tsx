'use client'
import { useTab } from "@/context/tabContext"
import { adminTabs } from "@/lib/adminTabs"
import { LogoutOutlined } from "@ant-design/icons"
import { useUser } from "@auth0/nextjs-auth0"
import { User2 } from "lucide-react"
import Image from "next/image"
import { Badge } from "../ui/badge"
import { useRouter } from "next/navigation"

export default function AdminSidebar() {
    const { activeTab, setActiveTab } = useTab();
    const router = useRouter();
    const {user}=useUser();
    console.log(user)
    return (
        <main className="w-[15%] h-full border-r-[1px] border-[#dddddd]">
            <div className="w-full h-full flex flex-col gap-5 p-5">
                <div className="p-5 border-b-[1px] border-[#e7e7e7] flex items-center gap-5">
                    {
                         <User2 />
                    }
                    <div className="flex flex-col">
                        <p className="font-medium text-[15px]">{user?.name}</p>
                        <Badge variant={'outline'}>Admin</Badge>
                    </div>
                </div>
                {
                    adminTabs.map((item, index) => (
                        <div className="py-4 rounded-md px-5 hover:bg-[#e0e0e0] cursor-pointer text-center font-medium flex gap-3" key={index} onClick={() => setActiveTab(item.value)} style={{
                            backgroundColor: activeTab === item.value ? '#e0e0e0' : ''
                        }}>
                            <item.icon />
                            <p>{item.title}</p>
                        </div>
                    ))
                }
                <div className="py-7 rounded-md px-5 hover:bg-[#e0e0e0] cursor-pointer text-center font-medium flex gap-3" onClick={() => {
                    router.replace('/auth/logout')
                }}>
                    <LogoutOutlined />
                    <p>LogOut</p>
                </div>
            </div>
        </main>
    )
}