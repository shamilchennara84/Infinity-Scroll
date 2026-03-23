const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

function hideLoader() {
    loader.hidden = true;
}

//unsplash api
let initialLoad = true;
let count = 5;
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=${count}`;

function updateAPIURLWithNewCount(newCount) {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=${newCount}`;
}


//helper function

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach((photo) => {
        // Create <a> to link to Unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });
        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });

        // Add event listener, check when each is finished loading
        img.addEventListener('load', () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
            ready = true;
            hideLoader();
            if (initialLoad) {
                updateAPIURLWithNewCount(30);
                initialLoad = false;
            }
          }
        })

        // Append <img> to <a>
        item.appendChild(img);

        // Append <a> to image container
        imageContainer.appendChild(item);
    });
}




async function getPhotos() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch photos');
        }
        photosArray = await response.json();
        displayPhotos();
    } catch (error) {
        console.error('Error fetching photos:', error);
    }
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready =false
        getPhotos();
    }
})

getPhotos();