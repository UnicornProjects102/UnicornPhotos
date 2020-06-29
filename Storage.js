export class Storage {
  static getPhotos() {
    return localStorage.getItem("photos")
      ? JSON.parse(localStorage.getItem("photos"))
      : [];
  }
  static savePhotos(data) {
    localStorage.setItem("photos", JSON.stringify(data));
  }
  static getPhoto(id) {
    let photos = JSON.parse(localStorage.getItem("photos"));
    return photos.find((photo) => photo.id === id);
  }
  static updatePhoto(id, newPhoto) {
    let photos = JSON.parse(localStorage.getItem("photos"));
    let photoToUpdate = photos.find((photo) => photo.id === id);
    let index = photos.indexOf(photoToUpdate);
    photos[index] = newPhoto;
    localStorage.setItem("photos", JSON.stringify(photos));
  }
  static saveFavourite(favourite) {
    localStorage.setItem("favourite", JSON.stringify(favourite));
  }
  static getFavourite() {
    return localStorage.getItem("favourite")
      ? JSON.parse(localStorage.getItem("favourite"))
      : [];
  }
  static deleteFavouriteItem(id) {
    let favourite = JSON.parse(localStorage.getItem("favourite"));
    let itemToDelete = favourite.find((photo) => {
      photo.id === id;
    });
    let index = favourite.indexOf(itemToDelete);
    favourite.splice(index, 1);
    localStorage.setItem("favourite", JSON.stringify(favourite));
  }
}
