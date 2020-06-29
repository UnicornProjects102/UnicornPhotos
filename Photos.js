import { Storage } from "./Storage.js";

export class Photos {
  async getPhotos() {
    try {
      let result = await fetch("data.json");
      let data = await result.json();
      let photos;
      localStorage.getItem("photos")
        ? (photos = Storage.getPhotos())
        : (photos = data);
      return photos;
    } catch (error) {
      console.log(error);
    }
  }
}
