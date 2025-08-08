'use client'
import { useTab } from "@/context/tabContext"
import { adminTabs } from "@/lib/adminTabs"
import { LogoutOutlined, UserOutlined } from "@ant-design/icons"
import { PercentSquareIcon, User2 } from "lucide-react"
import Link from "next/link"

export default function AdminSidebar() {
    const {activeTab,setActiveTab}=useTab();

    return (
        <main className="w-[15%] h-full border-r-[1px] border-[#dddddd]">
            <div className="w-full h-full flex flex-col gap-5 p-5">
                <div className="w-full py-5 mb-10 flex gap-5 items-center justify-center border-b-[1px] border-[#e6e6e6]">
                    <User2 size={30}/>
                    <p className=" uppercase font-bold text-3xl">Admin</p>
                </div>
                {
                    adminTabs.map((item, index) => (
                        <div className="py-4 rounded-md px-5 hover:bg-[#e0e0e0] cursor-pointer text-center font-medium flex gap-3" key={index} onClick={()=>setActiveTab(item.value)} style={{
                            backgroundColor:activeTab===item.value ? '#e0e0e0':''
                        }}>
                            <item.icon/>
                            <p>{item.title}</p>
                        </div>
                    ))
                }
                <div className="py-7 rounded-md px-5 hover:bg-[#e0e0e0] cursor-pointer text-center font-medium flex gap-3">
                    <LogoutOutlined/>
                    <Link href='/auth/logout'>LogOut</Link>
                </div>
            </div>
        </main>
    )
}