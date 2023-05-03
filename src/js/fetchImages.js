import axios from 'axios';

export async function getImages(queryParam, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY_API = '36020847-b5ba762273a6a27bc51b550e0';
  return await axios.get(
    `${BASE_URL}?key=${KEY_API}&q=${queryParam}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
}
