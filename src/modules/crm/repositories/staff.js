import xhr from "@/api/config/xhr";
import endPoint from "@/api/config/endPoint";
import {getURL} from "@/api/config/endPoint";

export const getFavorites =  async () => {
    return await xhr.get(getURL(endPoint.FAVORITE_LIST));
}

export const postAddFavorites =  async data => {
    return await xhr.post(getURL(endPoint.FAVORITE_ADD), data);
}

export const deleteFavorite = async routeParams => {
    return await xhr._delete(getURL(endPoint.FAVORITE_DELETE, routeParams));
}

