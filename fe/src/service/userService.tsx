import type { User } from "../context/UserContext";
import api from "./axios";



export async function register(user) {
   try{
    const res=await api.post("/users/register",user);
    return res.data;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   }catch(err:any){
    console.error(err.message)
    throw err;
   }    
}


export async function login(user) {
    try{
     const res=await api.post("/users/login",user);
     return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
     console.error(err.message)
     throw err;
    }    
 }


 export async function getUserById(userId:number) {
    try{
     const res=await api.get("/users/getUserById/"+userId);
     return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
     console.error(err.message)
     throw err;
    }    
 }

export async function getAllUsers() {
    try {
        const res = await api.get("/users/getAllUsers");
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}

export async function updatePassword(data) {
    try {
        const res = await api.put("/users/update",data);
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}

