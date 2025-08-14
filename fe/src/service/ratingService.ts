import api from "./axios";


export default async function getAllRatings(){
    try {
        const res = await api.get("/ratings/getAllRatings");
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}