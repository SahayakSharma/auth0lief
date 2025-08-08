'use client'
import { FirestoreConfig } from "@/config/firestoreConfig"
import { collection, DocumentData, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import SetNewLocation from "@/components/helper/SetNewLocation";
import StaffList from "@/components/helper/StaffList";
import LocationList from "@/components/helper/LocationList";

export default function Location() {

    const [loading, setLoading] = useState<boolean>(true);
    const [locations, setLocations] = useState<DocumentData[]>([]);

    async function getLocations() {
        const instance = FirestoreConfig.getInstance();
        try {
            const snap = await getDocs(query(collection(instance.getDb(), 'Locations')));
            setLocations([])
            snap.forEach(doc => {
                setLocations(prev => ([...prev, { id: doc.id, ...doc.data() }]));
            })
            setLoading(false);
        }
        catch (err) {
            console.log(err)
        }
    }

    function addToLocation(newLocation: DocumentData) {
        setLocations(prev => ([...prev, newLocation]))
    }

    useEffect(() => {
        getLocations();
    }, [])
    return (
        <main className="w-full h-full">
            <div className="w-full h-20 flex justify-end">
                <SetNewLocation addToLocation={addToLocation} />
            </div>
            {
                loading ? <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    <p className="text-lg font-medium text-gray-600">Loading team members...</p>
                </div>
            </div> : <LocationList locations={locations}/>
            }
        </main>
    )
}