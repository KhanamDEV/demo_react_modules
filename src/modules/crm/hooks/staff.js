import {useEffect, useState} from "react";
import {
    findProductByCode,
    findProductById,
    getAvailability, getAvailabilityList,
    getFilterListTree, getProductByCategories,
    getProductIndex,
    getProductInterested,
    getProducts, search
} from "../api/product";
import utils from  '../utils/index'
import {useSearchParams} from "react-router-dom";
import {useLocation} from "react-router";

export function useProductsIndex(){
    const [searchParams, setSearchParams] = useSearchParams();
    let currentPage = searchParams.get('page');
    currentPage = currentPage ? currentPage : 1;
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [paged, setPaged] = useState(currentPage);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        await getProductIndex({page: paged, isFeatured: true, per_page: 9}).then(res => {
            res = res.data;
            let products = [];
            res.data.forEach(function (value){
                let durationString = '';
                if (value.duration){
                    let duration = value.duration.split(" - ");
                    if (duration.length){
                        durationString += utils.formatDurationISO8601(duration[0]);
                        if (duration[1] && duration[0] != duration[1]) durationString += ` - ${utils.formatDurationISO8601(duration[1])}`
                    }
                }

                products.push({
                    id: value.id,
                    name: value.title,
                    description: value.summary,
                    supplierName: value.supplier,
                    price: {
                        gross: value.gross_twin_share_price,
                        currency: value.currency
                    },
                    image: value.cover_image,
                    isFeatured : value.is_featured,
                    duration: durationString,
                    isFreeCancel: value.is_free_cancel,
                    code: value.tripcode,
                    country: value.country,
                    location_brief: value.location_brief
                })
            });
            setProducts(products);
            setProductCount(res.total);
            setPageSize(res.per_page);
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [paged]);

    return {loading, products, productCount, paged, setPaged, pageSize}
}

export function useProducts(filter){
    const [searchParams, setSearchParams] = useSearchParams();
    let currentPage = searchParams.get('page');
    currentPage = currentPage ? currentPage : 1;
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [paged, setPaged] = useState(currentPage);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        await getProducts({page: paged, filter: JSON.stringify(filter)}).then(res => {
            res = res.data;
            let products = [];
            if (res.data.constructor === Object){
                res.data = Object.values(res.data);
            }
            res.data.forEach(function (value){
                let durationString = '';
                if (value.duration){
                    let duration = value.duration.split(" - ");
                    if (duration.length){
                        durationString += utils.formatDurationISO8601(duration[0]);
                        if (duration[1] && duration[0] != duration[1]) durationString += ` - ${utils.formatDurationISO8601(duration[1])}`
                    }
                }

                products.push({
                    id: value.id,
                    name: value.title,
                    description: value.summary,
                    supplierName: value.supplier,
                    price: {
                        gross: value.gross_twin_share_price,
                        currency: value.currency
                    },
                    image: value.cover_image,
                    imagePreview: JSON.parse(value.images),
                    isFeatured : value.is_featured,
                    duration: durationString,
                    isFreeCancel: value.is_free_cancel,
                    code: value.tripcode,
                    country: value.country_name,
                    location_brief: value.location_brief
                })
            });
            setProducts(products);
            setProductCount(res.total);
            setPageSize(res.per_page);
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [paged]);

    useEffect(() => {
        if (paged == 1){fetchData()}
        else{
            setPaged(1);
            setSearchParams({page: 1, q: filter.search});
        }
    }, [filter])

    return {loading, products, productCount, paged, setPaged, pageSize}
}

export function useProductDetail(code){
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        await findProductByCode({code: code}).then(res => {
            // console.log(res);
            // console.log(res);
            // res.product.contentList = utils.formatContentListProduct(res.product.contentList.nodes);
            // res.product.attributeList = utils.formatAttrListProduct(res.product.attributeList.nodes);
            // res.product.guideLanguageList = res.product.guideLanguageList.nodes;
            // res.product.price = res.product.holibobGuidePrice;
            // res.product.description = utils.removeMultiDownLine(res.product.description);
            // res.product.categories = res.product.categoryList.nodes.map(value => value.id);
            setProduct(res.data);
            setLoading(false);
        })
    }
    useEffect(() => {
        fetchData();
    }, [])
    useEffect(() => {
        fetchData()
    }, [code])
    return {loading, product};
}

export function useGetFilterListTree(){
    const [filterList, setFilterList] = useState({});
    const [loadingFilterList, setLoadingFilterList] = useState(true);

    const fetchData = async () => {
        await getFilterListTree().then(res => {
            setFilterList( res.data);
            setLoadingFilterList(false);
        }).catch(err => {
            setLoadingFilterList(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    return {loadingFilterList, filterList}
}

export function useGetProductInterested(placeId, idIgnore){
    const [productInterestedLoading, setProductInterestedLoading] = useState(true);
    const [interestedProducts, setInterestedProducts] = useState([])
    const fetchData = async () => {
        if (placeId){
            await getProductInterested({country: placeId }).then(res => {
                res = res.data;
                let products = [];
                res.forEach(function (value){
                    if (value.id != idIgnore){
                        products.push({
                            id: value.id,
                            name: value.title,
                            description: value.summary,
                            supplierName: value.supplier,
                            price: {
                                gross: value.gross_twin_share_price,
                                currency: value.currency
                            },
                            image: value.cover_image,
                            isFeatured : value.is_featured,
                            duration: utils.makeDurationString(value.duration),
                            isFreeCancel: value.is_free_cancel,
                            code: value.tripcode,
                            country: value.country,
                            location_brief: value.location_brief
                        })
                    }
                });
                setInterestedProducts(products);
                setProductInterestedLoading(false);
            })
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchData();
    }, [placeId, idIgnore])
    return {productInterestedLoading, interestedProducts}
}

export function useGetAvailability(id = '', input = {}){
    const [loadingAvailability, setLoadingAvailability] = useState(true);
    const [availability, setAvailability] = useState(null)
    const fetchData = async () => {
        if (id){
            setLoadingAvailability(true);
            await getAvailability({id: id, input: JSON.stringify(input)}).then(res => {
                setAvailability(res.data.data.availability);
                setLoadingAvailability(false);
            });
        } else{
            setAvailability(null);
            setLoadingAvailability(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData()
    }, [id, input])
    return {loadingAvailability, availability};
}

export function useGetAvailabilityList(product_id, date){
    const [loadingAvailabilityList, setLoadingAvailabilityList] = useState(true);
    const [availabilityList, setAvailabilityList] = useState([]);
    const fetchData = async () => {
        if (product_id){
            setLoadingAvailabilityList(true);
            await getAvailabilityList({product_id: product_id, date: date}).then(res => {
                setAvailabilityList(res.data.data.availabilityList.nodes);
                setLoadingAvailabilityList(false);
            })
        }
    }
    useEffect(() => {
        fetchData();
    }, [date, product_id])

    return {loadingAvailabilityList, availabilityList}
}

export function useSearchProduct(keyword = ''){
    const [loadingSearch, setLoadingSearch] = useState(true);
    const [searchData, setSearchData] = useState([]);

    const fetchData = async () => {
        if (keyword){
            setLoadingSearch(true);
            setSearchData([]);
            await search({keyword: keyword}).then(res => {
                setSearchData(res.data.data.search.nodes);
                setLoadingSearch(false);
            })
        } else {
            setSearchData([]);
            setLoadingSearch(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [keyword])

    return {loadingSearch, searchData};
}

export function useGetProductByCategories(categories = [], idIgnore){
    const [loadingProductByCategories, setLoadingProductByCategories] = useState(true);
    const [productByCategories, setProductByCategories] = useState([]);
    const fetchData = async () => {
        if (categories.length || idIgnore){
            setLoadingProductByCategories(true);
            await getProductByCategories({categories: JSON.stringify(categories), id: idIgnore}).then(res => {
                res = res.data;
                let products = [];
                res.forEach(function (value){
                    if (value.id != idIgnore){
                        products.push({
                            id: value.id,
                            name: value.title,
                            description: value.summary,
                            supplierName: value.supplier,
                            price: {
                                gross: value.gross_twin_share_price,
                                currency: value.currency
                            },
                            image: value.cover_image,
                            isFeatured : value.is_featured,
                            duration: utils.makeDurationString(value.duration),
                            isFreeCancel: value.is_free_cancel,
                            code: value.tripcode,
                            country: value.country,
                            location_brief: value.location_brief
                        })
                    }
                });
                setProductByCategories(products);
                setLoadingProductByCategories(false);
            });
        }

    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [categories])
    return {loadingProductByCategories, productByCategories}
}