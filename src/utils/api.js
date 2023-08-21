import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_KEY = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
}

export const fetchDataApi = async (url, params) => {
    try {
        const { data } = await axios.get(`${BASE_URL}${url}`, {
            headers,
            ...params,
        })
        return data;

    } catch (error) {
        console.log(error);
    }
}

