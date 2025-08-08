'use client'

import { FirestoreConfig } from "@/config/firestoreConfig"
import { useUser } from "@auth0/nextjs-auth0"
import { collection, DocumentData, getDocs, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import StaffCard from "./StaffCard"

export default function StaffList() {
    const [staff, setStaff] = useState<DocumentData[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { user } = useUser()

    async function getStaffDetails() {
        const instance = FirestoreConfig.getInstance()
        try {
            const snap = await getDocs(query(collection(instance.getDb(), 'Users')))
            setStaff([])
            snap.forEach((doc) => {
                if (doc.id != user?.sub) {
                    setStaff(prev => ([...prev, { id: doc.id, ...doc.data() }]))
                }
            })
            setLoading(false)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getStaffDetails()
    }, [])

    const getInitials = (name: string) => {
        return name
            .split('@')[0]
            .split('.')
            .map(n => n.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    <p className="text-lg font-medium text-gray-600">Loading staff members...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="w-full">
            <p className="font-bold text-4xl text-center uppercase">Staff-Members</p>
            <div className="grid grid-cols-4 gap-6 py-20">
                {
                    staff.map((staffDetail,index)=>(
                        <StaffCard staffDetail={staffDetail} key={index}/>
                    ))
                }
            </div>
        </main>
    )
}
