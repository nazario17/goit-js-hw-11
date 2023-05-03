import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkUp';
import { getImages } from './js/fetchImages';
import {
  openImageModal,
  refreshImageModal,
  closeModal,
} from './js/simpleLightBox';
import scrollBy from './js/scroll';

const form = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.gallery');
const lastMessage = document.querySelector('.last-message');
const target = document.querySelector('.js-guard');

let currentPage = 1;
let queryParam = null;

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoadMore, options);

form.addEventListener('submit', onSearchForm);
galleryEl.addEventListener('click', evt => {
  evt.preventDefault();
});

function onLoadMore(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      renderImagesOnLoadMore();
    }
  });
}

function onSearchForm(evt) {
  evt.preventDefault();
  queryParam = evt.currentTarget.elements.searchQuery.value;
  galleryEl.innerHTML = '';
  if (!queryParam) {
    Notify.warning('Please, fill the field');
    return;
  }
  renderImagesBySubmit(queryParam);
  observer.observe(target);
}

async function renderImagesOnLoadMore() {
  try {
    const response = await getImages(queryParam, currentPage);
    const dataArray = response.data.hits;

    galleryEl.insertAdjacentHTML('beforeend', createMarkup(dataArray));
    if (dataArray.length * currentPage > response.data.totalHits) {
      observer.unobserve(target);
      lastMessage.textContent = `Hooray! All images has finished.`;
    }
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
    openImageModal();
    scrollBy();
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    galleryEl.innerHTML = '';
  }
}
