



/* eslint-disable react-refresh/only-export-components */
import {  createContext, useContext, useState, type ReactNode } from "react"

export enum Role{
    USER="USER",
    SYSTEM_ADMINISTRATOR="SYSTEM_ADMINISTRATOR",
    STORE_OWNER="STORE_OWNER"
}

export interface User{
    userId:number,
    name:string,
    address:string,
    role: Role
}

interface UserContextType{
    user: User | null,
    setUser: (user: User | null) => void
}

const userContext=createContext<UserContextType|null>(null);

export const UserContextProvider=({ children }: { children: ReactNode })=>{
    const [user,setUser]=useState<User|null>(null);

    return(
        <userContext.Provider value={{user,setUser}}>{children}</userContext.Provider>
    )

}


export const useUser=()=>{
    const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
}