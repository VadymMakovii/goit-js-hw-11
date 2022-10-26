import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

export default class MarkupCreatorService {
    constructor({ selectorBtn, selectorGallery }) {
        this.lightBox = "";
        this.loadMoreBtn = document.querySelector(selectorBtn);
        this.galleryEl = document.querySelector(selectorGallery);
    }

clearMarkup() {
    this.galleryEl.innerHTML = '';
}

async requestHandler(arr) {
    const quantityFindedImg = arr.totalHits;
    if (quantityFindedImg < 1) {
        this.BtnHide();
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.", { showOnlyTheLastOne: true });
    } else {
        const markup = this.createMarkup(arr);
        await this.galleryEl.insertAdjacentHTML('beforeend', markup);
        this.BtnShow();
        this.lightBox = new SimpleLightbox('.gallery a', { scrollZoom: false });
        if (this.galleryEl.childElementCount === quantityFindedImg) {
            this.onCollectionEnd();
        };
    };
}

loadMorePage(arr) {
    this.BtnHide();
    const markup = this.createMarkup(arr);
    this.galleryEl.insertAdjacentHTML('beforeend', markup);
    this.refreshLightBox(this.lightBox);
    if (this.galleryEl.childElementCount === arr.totalHits) {
        return this.onCollectionEnd();
    };
    this.slowScroll();
    setTimeout(() => { this.BtnShow(); }, 1000);
}

scrollUp() {
    window.scrollBy({ top: 0, behavior: "smooth", });
}

slowScroll() {
const { height: cardHeight } = this.galleryEl.firstElementChild.getBoundingClientRect();
window.scrollBy({ top: cardHeight * 2 + 25, behavior: "smooth", });
}

BtnShow() {
    this.loadMoreBtn.setAttribute('hidden', 'false');
    this.loadMoreBtn.classList.remove('is-hidden');
}

BtnHide() {
    this.loadMoreBtn.setAttribute('hidden', 'true');
    this.loadMoreBtn.classList.add('is-hidden');
}

refreshLightBox(item) {
    item.refresh();
}

onCollectionEnd () {
    Notify.warning("We're sorry, but you've reached the end of search results.", { showOnlyTheLastOne: true } );
    this.BtnHide();
}

createMarkup(data) {
    const findedImages = data.hits;
    return findedImages.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        <div class="info">
            <p class="info-item"><b>Likes</b>${likes}</p>
            <p class="info-item"><b>Views</b>${views}</p>
            <p class="info-item"><b>Comments</b>${comments}</p>
            <p class="info-item"><b>Downloads</b>${downloads}</p>
        </div>
    </div>
    </a>`
    }).join('');
}
};