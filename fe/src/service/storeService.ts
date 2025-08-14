import api from "./axios";




export async function getAllstores() {
    try {
        const res = await api.get("/store/getAllStore");
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}

export async function addStores(store) {
    try {
        const res = await api.post("/store/create",store);
        return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err.message);
        throw err;
    }
}