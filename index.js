import { Photos } from "./Photos.js";
import { Storage } from "./Storage.js";
import { UI } from "./UI.js";

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const photos = new Photos();
  ui.setupAPP();
  photos
    .getPhotos()
    .then((photos) => {
      ui.displayPhotos(photos);
      Storage.savePhotos(photos);
    })
    .then(() => {
      ui.liveSearch();
    });
});
