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



export  async function submitRating(rating:{userId:number, storeId:number, rating:number}){
    try {
        const res = await api.post(`/ratings/stores/ratings`,rating);
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}

export  async function updateRating(rating:{ratingId:number, rating:number}){
    try {
        const res = await api.put(`/ratings/${rating.ratingId}/ratings/${rating.rating}`);
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}


export  async function getRatingsForUser( userId,storeId){
    try {
        const res = await api.get(`/ratings/stores/${storeId}/users/${userId}/rating`);
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}

export  async function getRatingsByStoreID(storeId){
    try {
        const res = await api.get(`/ratings/stores/${storeId}/ratings`);
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}