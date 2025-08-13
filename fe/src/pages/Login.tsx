import { useUser } from "@/context/UserContext";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Outlet } from "react-router-dom";


export default function Login(){
    const ctx=useUser();

    if(ctx && ctx?.user){
     return <Outlet/>;
    }
        

    return(
        <>
        <Form handleSubmit={(e)=>{}}>
            <Input></Input>
            <Label></Label>
            <Button></Button>
        </Form>
        </>
    )
}