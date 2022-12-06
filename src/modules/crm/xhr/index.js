import Axios from "axios";


const createAxiosInstance = configHeader => {
    return Axios.create({
        headers: {...configHeader}
    });
}

export async function get(url, params = {}){
    const axios = createAxiosInstance({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Tokenapi' : 'Tv2fDcU56qh5CVpOeDbIeXbnTGFg3J5SX9iWTa2M0hndtbF2k2czwT0mHtQK'
    });
    return await axios.get(url, {
        params: params
    });
}

export async function post(url, data){
    const axios = createAxiosInstance({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Tokenapi' : 'Tv2fDcU56qh5CVpOeDbIeXbnTGFg3J5SX9iWTa2M0hndtbF2k2czwT0mHtQK'
    });
    return await axios.post(url, data);
}

export async function postMultipartForm(url, data){
    const axios = createAxiosInstance({headers : {"Content-Type" : "multipart/form-data;boundary=---------------------------974767299852498929531610575"}});
    return await axios.post(url, data);
}