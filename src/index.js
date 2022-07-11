const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const URL = 'https://pixabay.com/api/';
const options = {
    key: '28553161-db98e247409cde79825aae425',
    imageType: 'photo',
    safeSearch: true,
    opientation: 'horizontal',
    page: 1,
    per_page: 40, 
}
let searchWords = '';
let lightBox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: '250' });




searchForm.addEventListener('submit', e => {
    e.preventDefault();
    galleryEl.innerHTML = '';
    options.page = 1;
    loadMoreBtn.classList.add('is-hidden');

    searchWords = searchForm.searchQuery.value;

    searchPhoto(searchWords).then(({ data }) => {
        if (data.hits.length === 0) {
            Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
            return
        }
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        galleryMarkup(data.hits);
        options.page += 1;
        loadMoreBtn.classList.remove('is-hidden');
        lightBox.refresh();

        
        

    });
});

loadMoreBtn.addEventListener('click', () => {
    searchPhoto(searchWords).then(({ data }) => {
        galleryMarkup(data.hits);
        options.page += 1;
        lightBox.refresh();
        quantityHits(data);

    
        
    })
});


    
async function searchPhoto(word) {
    const responce = await axios.get(`${URL}/?key=${options.key}&q=${word}&image_type=${options.imageType}&orientation=${options.opientation}&safesearch=${options.safeSearch}&page=${options.page}&per_page=${options.per_page}`);
    return responce
}

function galleryMarkup(array) {
    const arrayMarkup = array.map(el => {
        return `<div class="photo-card">
  <a href="${el.largeImageURL}"><img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" width="240" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${el.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${el.views}</b>
    </p> 
    <p class="info-item">
      <b>Comments: ${el.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${el.downloads}</b>
    </p>
  </div>
</div>`
    });

    arrayMarkup.forEach(markup => {
        galleryEl.insertAdjacentHTML('beforeend', markup)
    });
};

function quantityHits(object) {
    const allPhotos = document.querySelectorAll('.photo-card');
        if (allPhotos.length === object.totalHits) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.classList.add('is-hidden');
    }
};



