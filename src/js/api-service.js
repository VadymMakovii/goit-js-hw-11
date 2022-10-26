import axios from 'axios';

export default class ImagesApiService {
    constructor() {
        this.pageNumber = "";
        this.searchQuery = "";
    }

fetchImages() {
    const API_KEY = '30847367-b1dc05b2e3ce029cb21abd284';
    const url = 'https://pixabay.com/api/';
    const params = {
        key: API_KEY,
        q: this.searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        per_page: 40,
        page: this.pageNumber,
    };
    return axios.get(url, { params });
}
    
incrementPage() {
    this.pageNumber += 1; 
}

resetPage() {
    this.pageNumber = 1;
}
    
get query() {
    return this.searchQuery;
}
    
set query(newQuery) {
    this.searchQuery = newQuery;
}

};