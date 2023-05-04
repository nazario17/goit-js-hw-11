import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkUp.js';
import { getImages } from './js/fetchImages.js';
import {
  openImageModal,
  refreshImageModal
} from './js/simpleLightBox.js';
import scrollBy from './js/scroll.js';

const form = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.gallery');
const lastMessage = document.querySelector('.last-message');
const buttonOnLoad = document.querySelector('.load-more');


let currentPage = 1;
let queryParam = null;

form.addEventListener('submit', onSearchForm);
buttonOnLoad.addEventListener('click', onLoadMore);
galleryEl.addEventListener('click', evt => {
  evt.preventDefault();
});

function onLoadMore() {
  currentPage += 1;
  renderImagesOnLoadMore(queryParam, currentPage);
}

function onSearchForm(evt) {
  evt.preventDefault();
  queryParam = evt.currentTarget.elements.searchQuery.value;
  galleryEl.innerHTML = '';
  buttonOnLoad.classList.add('is-hidden');
  if (!queryParam) {
    Notify.warning('Please, fill the field');
    return;
  }
  renderImagesBySubmit(queryParam);
}

async function renderImagesOnLoadMore() {
  try {
    const response = await getImages(queryParam, currentPage);
    const dataArray = response.data.hits;
    if (currentPage * 40 > response.data.totalHits) {
      buttonOnLoad.classList.add('is-hidden');
      lastMessage.textContent = `Hooray! We found ${response.data.totalHits} images.`;
    }
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(dataArray));
    scrollBy();
    const newGalleryItems = galleryEl.querySelectorAll('.gallery a');
    const lightbox = new SimpleLightbox(newGalleryItems);
    newGalleryItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        lightbox.open(item.href);
      });
    });
    refreshImageModal();
  } catch (error) {
    console.log(error);
  }
}

async function renderImagesBySubmit() {
  try {
    const response = await getImages(queryParam);
    const dataArray = response.data.hits;
    galleryEl.innerHTML = createMarkup(dataArray);
    if (!dataArray.length) throw new Error('not found');
    if (dataArray.length)
      Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    if (dataArray.length >= 40) {
      buttonOnLoad.classList.remove('is-hidden');
    } else {
      lastMessage.textContent = `Hooray! We found ${response.data.totalHits} images.`;
    }
    openImageModal();
    scrollBy();
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    galleryEl.innerHTML = '';
  }
}