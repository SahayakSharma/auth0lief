
import AdminContentPannel from "./AdminContentPannel";
import AdminSidebar from "./SideBar";
import { TabContextProvider } from "@/context/tabContext";

export default function AdminDashboard() {

    return (
        <main className="w-full h-screen flex">
            <TabContextProvider>
                <AdminSidebar />
                <AdminContentPannel/>
            </TabContextProvider>
        </main>
    )
}