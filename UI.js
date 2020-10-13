import { Storage } from "./Storage.js";

let heartsDOM = [];

export class UI {
  displayPhotos(photos) {
    let result = "";
    photos.forEach((item) => {
      result += `
          <div class="grid-item">
          <div class="photo_wrap" data-id=${item.id}>
              <img src="${item.url_small}" alt="" class="img">
          </div>
          <div class="photo_info_wrap">
              <h3 class="photo_name">${item.name}</h3>
              <div class="photo_like"><div class="likes_number">${item.likes}</div>
                  <div class="tooltip" id=${item.id} data-id=${item.id}>
                      <i class="far fa-heart"></i>
                      <span class="tooltiptext">Add to favourite</span>
                  </div>
              </div>
          </div>
      </div>
           `;
    });

    let container = document.querySelector("#photo_container");
    let items = document.querySelectorAll(".grid-item");
    container.innerHTML = result;
    this.getHearts();
    this.getGallery();
    if (photos.length < 6 && window.innerWidth > 700) {
      container.style.height = "100vh";
    } else if (photos.length < 11 && window.innerWidth > 700) {
      container.style.height = "300vh";
    } else if (photos.length >= 11 && window.innerWidth > 700) {
      container.style.height = "600vh";
    }
  }
  getHearts() {
    const hearts = [...document.querySelectorAll(".tooltip")];
    heartsDOM = hearts;
    hearts.forEach((heart) => {
      this.updateHeartsUI(heart);
      heart.addEventListener("click", (event) => {
        let id = event.target.parentElement.dataset.id;
        let favPhoto = { ...Storage.getPhoto(id) };
        if (favPhoto.liked) {
          event.target.classList.add(`far`);
          event.target.classList.remove(`fas`);
          event.target.nextElementSibling.innerHTML = "Add to favourite";
          favPhoto.likes--;
          favPhoto.liked = false;
          Storage.deleteFavouriteItem(id);
          Storage.updatePhoto(id, favPhoto);
          this.updateLikesUI(favPhoto, id);

          this.setupAPP();
        } else {
          event.target.classList.remove(`far`);
          event.target.classList.add(`fas`);
          event.target.nextElementSibling.innerHTML = "Remove from favourite";

          favPhoto.likes++;
          favPhoto.liked = true;
          let favourite = Storage.getFavourite();
          favourite.push(favPhoto);
          Storage.saveFavourite(favourite);
          Storage.updatePhoto(id, favPhoto);
          this.updateLikesUI(favPhoto, id);

          this.setupAPP();
        }
      });
    });
  }
  updateLikesUI(photo, id) {
    if (photo.liked) {
      document.getElementById(
        id
      ).previousElementSibling.innerHTML = photo.likes++;
    } else {
      document.getElementById(
        id
      ).previousElementSibling.innerHTML = photo.likes--;
    }
  }
  updateHeartsUI(heart) {
    let id = heart.dataset.id;
    let favourite = Storage.getFavourite();
    let inFavourite = favourite.find((item) => item.id === id);
    if (inFavourite) {
      heart.firstElementChild.classList.remove(`far`);
      heart.firstElementChild.classList.add(`fas`);
      heart.lastElementChild.innerHTML = "Remove from favourite";
    } else {
      heart.firstElementChild.classList.add(`far`);
      heart.firstElementChild.classList.remove(`fas`);
      heart.lastElementChild.innerHTML = "Add to favourite";
    }
  }
  getGallery() {
    let photoDOM = [...document.querySelectorAll(".photo_wrap")];
    photoDOM.forEach((photo) => {
      photo.addEventListener("click", () => {
        let id = photo.dataset.id;
        let photos = Storage.getPhotos();
        let currentPhotoObj = photos.find((item) => item.id === id);
        this.displayGallery(currentPhotoObj);
      });
    });
  }
  displayGallery(currentPhotoObj) {
    let galleryContainer = document.querySelector(".gallery_container");
    let overlay = document.querySelector("#overlay");
    galleryContainer.style.display = "flex";
    overlay.style.display = "block";
    galleryContainer.innerHTML = ` <div class="gallery_header">
          <div class="photo_like gallery_photo_like">
          <h2 class="gallery_photo_name">${currentPhotoObj.name}</h2>
          <div style="display: none;" class="likes_number">0</div> 
          <div class="tooltip gallery" id=${currentPhotoObj.id} data-id=${currentPhotoObj.id}>
          <i class="far fa-heart"></i>
          <span class="tooltiptext">Add to favourite</span>
          </div>
          </div>
          <div class="gallery_close"><i class="far fa-times-circle"></i></div>
       </div>     
       <div class="gallery_photo_wrap">
         <div class="arrow arrow_left"><i class="fas fa-chevron-left"></i></div>
         <img class="gallery_photo" src="${currentPhotoObj.url_large}">
         <div class="arrow arrow_right"><i class="fas fa-chevron-right"></i></div>
      </div>
      <div class="gallery_footer">
         <p class="publish_date">Published on: ${currentPhotoObj.date}</p>
         <p class="author">Photo by: <a href="${currentPhotoObj.link}" target="_blank">${currentPhotoObj.author}</a> from ${currentPhotoObj.source}</p>
      </div>`;
    if (
      currentPhotoObj.orientation === "vertical" &&
      window.innerWidth > 1000
    ) {
      document.querySelector(".gallery_photo_wrap").style.width = "25%";
    } else if (
      currentPhotoObj.orientation === "vertical" &&
      window.innerWidth < 1000
    ) {
      document.querySelector(".gallery_photo_wrap").style.width = "65%";
    }
    galleryContainer.addEventListener("click", (e) => this.closeGallery(e));
    this.getHearts();
    const arrows = [...document.querySelectorAll(".arrow")];
    arrows.forEach((arrow) =>
      arrow.addEventListener("click", (e) =>
        this.arrowHandler(e, currentPhotoObj)
      )
    );
    let galleryPhoto = document.querySelector(".gallery_photo");
    if (window.innerWidth > 1300) {
      galleryPhoto.addEventListener("click", (e) => {
        if (currentPhotoObj.orientation === "horizontal") {
          e.target.classList.toggle("max_horizontal");
          e.target.parentElement.parentElement.classList.toggle("not_fixed");
          e.target.parentElement.classList.toggle("get_overlay");
        }
        if (currentPhotoObj.orientation === "vertical") {
          e.target.classList.toggle("max_vertical");
          e.target.parentElement.parentElement.classList.toggle("not_fixed");
          e.target.parentElement.classList.toggle("get_overlay");
          if (e.target.parentElement.style.width === "25%")
            e.target.parentElement.style.width = "100%";
          else e.target.parentElement.style.width = "25%";
        }
      });
    }
  }
  arrowHandler(e, currentPhotoObj) {
    if (
      e.target.parentElement.classList.contains("arrow_right") |
      e.target.classList.contains("arrow_right")
    ) {
      let photos = Storage.getPhotos();
      let currentId = currentPhotoObj.id;
      let nextId = ++currentId;
      console.log(nextId);
      if (nextId <= photos.length) {
        let nextPhoto = photos.find((photo) => photo.id == nextId);
        this.displayGallery(nextPhoto);
      } else if (nextId > photos.length) {
        let newNextPhoto = photos.find((photo) => photo.id == 1);
        this.displayGallery(newNextPhoto);
      }
    }
    if (
      e.target.parentElement.classList.contains("arrow_left") |
      e.target.classList.contains("arrow_left")
    ) {
      let photos = Storage.getPhotos();
      let currentId = currentPhotoObj.id;
      let previousId = --currentId;
      console.log(previousId);
      if (previousId >= 1) {
        let previousPhoto = photos.find((photo) => photo.id == previousId);
        this.displayGallery(previousPhoto);
      } else if (previousId < 1) {
        let newPreviousPhoto = photos.find(
          (photo) => photo.id == photos.length
        );
        this.displayGallery(newPreviousPhoto);
      }
    }
  }
  closeGallery(e) {
    if (e.target.parentElement.classList.contains("gallery_close")) {
      document.querySelector(".gallery_container").style.display = "none";
      document.querySelector("#overlay").style.display = "none";
    }
  }
  liveSearch() {
    let searchInput = document.getElementById("search_input");
    let container = document.getElementById("photo_container");
    let typingWaitTimer;
    searchInput.addEventListener("keyup", (e) => {
      let term = e.target.value.toLowerCase();
      if (term == "") {
        clearTimeout(typingWaitTimer);
        container.innerHTML = "";
        this.displayPhotos(Storage.getPhotos());
      }
      if (term != "") {
        clearTimeout(typingWaitTimer);
        container.innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div>`;
        typingWaitTimer = setTimeout(() => {
          container.innerHTML = "";
          let searchedPhotos = [];
          const photos = Storage.getPhotos();
          photos.forEach((photo) => {
            const keywords = photo.keywords;
            if (keywords.toLowerCase().indexOf(term) != -1) {
              searchedPhotos = [...searchedPhotos, photo];
            }
          });
          this.displayPhotos(searchedPhotos);
          // this.getHearts();
          // this.getGallery();
          if (searchedPhotos.length < 1) {
            document.getElementById("photo_container").innerHTML = `
          <h3 class="no_results">Sorry, no results found.</h3>`;
          }
        }, 1000);
      }
    });
  }
  setupAPP() {
    let favourite = Storage.getFavourite();
    document.getElementById("your_favourite").addEventListener("click", () => {
      this.displayPhotos(favourite);
    });
    document.getElementById("latest").addEventListener("click", () => {
      let tenLatest = [];
      let photos = Storage.getPhotos();
      for (let i = 0; i < 10; i++) {
        let latestPhoto = photos.reduce((a, b) => (a.date > b.date ? a : b));
        tenLatest = [...tenLatest, latestPhoto];
        photos.splice(photos.indexOf(latestPhoto), 1);
      }
      this.displayPhotos(tenLatest);
    });
    document.getElementById("top_10").addEventListener("click", () => {
      let top10 = [];
      let photos = Storage.getPhotos();
      for (let i = 0; i < 10; i++) {
        let topPhoto = photos.reduce((a, b) => (a.likes > b.likes ? a : b));
        top10 = [...top10, topPhoto];
        photos.splice(photos.indexOf(topPhoto), 1);
      }
      this.displayPhotos(top10);
    });
    document.getElementById("nav_wrap").addEventListener("click", () => {
      let photos = Storage.getPhotos();
      this.displayPhotos(photos);
    });
    document.getElementById("search_icon_min").addEventListener("click", () => {
      let searchBar = document.querySelector(".search_bar");
      searchBar.classList.toggle("showItem");
      document.getElementById("search_input").focus();
    });
  }
}
