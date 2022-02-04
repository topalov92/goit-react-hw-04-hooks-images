const KEY = '24223617-8b23732ad6f6818826d28aef9';

export default function fetchImages(searchQuery, page) {
  return fetch(
    `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(new Error('No images found on request'));
  });
}