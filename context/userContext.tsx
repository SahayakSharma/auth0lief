'use client'
import { FirestoreConfig } from "@/config/firestoreConfig"
import { useUser } from "@auth0/nextjs-auth0"
import { doc, DocumentData, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useContext, createContext, ReactNode } from "react"
import { useEffect, useState } from "react"



type IUserContext = {
    userDetails: DocumentData
}

const UserContext = createContext<IUserContext>({ userDetails: {} })

export function UserProvider({ children }: { children: ReactNode }) {
    const [userDetails, setUserDetails] = useState<DocumentData>({})
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(true);

    async function getUserDetails() {
        if (!user) return;
        setLoading(true);
        const userId = user?.sub;
        const instance = FirestoreConfig.getInstance();
        try {
            const snap = await getDoc(doc(instance.getDb(), 'User', userId));
            if (snap.exists()) {
                setUserDetails(snap.data());
                setLoading(false)
                return;
            }
            const payload = {
                full_name: user.name,
                picture: user.picture,
                email: user.email,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            }
            await setDoc(doc(instance.getDb(), 'Users', userId), payload);
            setUserDetails({ ...payload, created_at: new Date(), updated_at: new Date() });
            setLoading(false)
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message)
            }
        }

    }
    useEffect(() => {
        if (user) getUserDetails();
        console.log(user)
    }, [user])

    return (
        loading ? <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                <p className="text-lg font-medium text-gray-600">Loading your data...</p>
            </div>
        </div> : <UserContext.Provider value={{ userDetails }}>
            {children}
        </UserContext.Provider>
    )
}