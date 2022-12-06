import UrlPattern from "url-pattern";

const API_URL = process.env.VUE_APP_API_URL;

const endPoint = {
    "PRODUCT_LIST": 'product',
    'PRODUCT_BY_CATEGORIES': 'product/get-by-categories',
    'PRODUCT_BY_LOCATIONS': 'product/get-by-locations',
    'GET_CITY_IN_COUNTRY': 'country/near-location',
    'TWT_CURRENCY_EXCHANGE_RATE': 'twt-agent-portal/currency-exchange-rate',
    'PRODUCT_DETAIL': 'product/detail/:code',
    'TOP_DESTINATION': 'country/top-destination',
    'GET_AVAILABILITY_LIST': 'product/get-availability-list',
    'GET_AVAILABILITY': 'product/get-availability/:id',
    'BOOKING_CREATE_QUOTE': 'booking/create-quote',
    'BOOKING_CONVERT_QUOTE_TO_BOOKING': 'booking/convert-quote-to-booking',
    'BOOKING_LIST': 'booking',
    'BOOKING_DETAIL': 'booking/detail/:id',
    'PRODUCT_FILTER_LIST': 'product/filter-list',
    'USER_REGISTER': 'authenticate/register',
    'USER_LOGIN': 'authenticate/sign-in',
    'USER_FORGET_PASSWORD' : 'authenticate/forget-password',
    'USER_CHECK_FORGET_PASSWORD_TOKEN' : 'authenticate/check-forget-password-token',
    'USER_FORGET_UPDATE_PASSWORD' : 'authenticate/update-password-forget',
    'FAVORITE_ADD': 'favorite/add',
    'FAVORITE_LIST': 'favorite',
    'FAVORITE_DELETE': 'favorite/delete/:id',
    'USER_UPDATE': 'profile/update',
    'USER_DETAIL': 'profile',
}

export const getURL = (name, routeParams = {}, queryParam = {}) => {
    const pattern = new UrlPattern(`${name}`);
    let url = new URL(`${API_URL}${pattern.stringify(routeParams)}`);
    let mappingParams = new URLSearchParams([
        ...Array.from(url.searchParams.entries()),
        ...Object.entries(queryParam)
    ]);
    return `${url.origin}${url.pathname}?${mappingParams}`;
}

export default endPoint;
