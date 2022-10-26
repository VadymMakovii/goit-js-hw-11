import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from "./js/api-service";
import MarkupCreatorService from "./js/markup-creator";
import './css/styles.css';


const imagesApiService = new ImagesApiService();
const markupCreatorService = new MarkupCreatorService({
    selectorBtn: '.load-more',
    selectorGallery: '.gallery',
});

const searchFormEl = document.querySelector('#search-form');

searchFormEl.addEventListener('submit', onSubmitForm);
markupCreatorService.loadMoreBtn.addEventListener('click', onLoadMorePage);

async function onSubmitForm(e) {
    e.preventDefault();
    imagesApiService.resetPage();
    imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
    if (imagesApiService.query === "") {
        return Notify.failure("Sorry, you didn't enter your search query. Please try again.", { showOnlyTheLastOne: true })
    };
    await imagesApiService.fetchImages().then(({ data }) => {
        markupCreatorService.BtnHide();
        markupCreatorService.clearMarkup();
        markupCreatorService.scrollUp();
        markupCreatorService.requestHandler(data);
        if (data.totalHits > 0) {
        return Notify.success(`Hooray! We found ${data.totalHits} images.`, { showOnlyTheLastOne: true });
        };
    });
};

async function onLoadMorePage() {
    await imagesApiService.incrementPage();
    imagesApiService.fetchImages().then(response => {
        markupCreatorService.loadMorePage(response.data);
    });
};