'use client'
import { useContext,createContext,useState, Dispatch, SetStateAction, ReactNode } from "react";


type ITabContext={
    activeTab:string,
    setActiveTab:Dispatch<SetStateAction<string>>
}

const TabContext=createContext<ITabContext>({
    activeTab:'monitoring',
    setActiveTab:()=>{throw new Error('function used outside scope of context')}
})

export function TabContextProvider({children}:{children:ReactNode}){
    const[activeTab,setActiveTab]=useState<string>('monitoring');

    return(
        <TabContext.Provider value={{activeTab,setActiveTab}}>
            {children}
        </TabContext.Provider>
    )
}

export function useTab(){
    return useContext(TabContext)
}