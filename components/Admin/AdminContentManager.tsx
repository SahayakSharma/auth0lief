'use client'

import { useTab } from "@/context/tabContext"
import Monitoring from "./content/Monitoring";
import StaffDetails from "./content/StaffDetails";
import Location from "./content/Location";

export default function AdminContentManager(){
    const {activeTab}=useTab();
    switch(activeTab){
        case 'monitoring':
            return <Monitoring/>
        case 'staff_details':
            return <StaffDetails/>
        default:
            return <Location/>
    }
}