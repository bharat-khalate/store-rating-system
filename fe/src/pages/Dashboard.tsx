import { useEffect } from "react";
import { Role, useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import AdminDashBoard from "./AdminDashBoard";
import StoreDashBoard from "./StoreDashboard";
import UserDashBoard from "./UserDashBoard";



export default  function Dashboard() {
    const ctx=useUser();
    const navigate=useNavigate();

    useEffect(()=>{
        if(!ctx) navigate("/");
    },[ctx])

    if(ctx?.user?.role===Role.SYSTEM_ADMINISTRATOR) return <AdminDashBoard/>;
    else if(ctx?.user?.role===Role.STORE_OWNER) return <StoreDashBoard/>
    else if(ctx?.user?.role===Role.USER) return <UserDashBoard/>
    else navigate("/");
    
}
