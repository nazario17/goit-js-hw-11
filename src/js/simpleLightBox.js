import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function openImageModal() {
  const galleryItems = document.querySelectorAll('.gallery a');
  const lightbox = new SimpleLightbox(galleryItems);
  lightbox.on('show.simplelightbox', function () {
    const { defaultOptions } = lightbox;
    defaultOptions.captionDelay = 250;
  });
}
export function refreshImageModal() {
  const galleryItems = document.querySelectorAll('.gallery a');
  const lightbox = new SimpleLightbox(galleryItems);
  lightbox.refresh();
}
