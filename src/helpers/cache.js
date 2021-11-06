import { IMAGE_URL_EXPIRATION } from "../constants";

export function addToCache(key, value) {
  const createdAt = (new Date()).getTime();
  localStorage.setItem(key, JSON.stringify({ value, createdAt }));
}

export function getFromCache(key) {
  const item = localStorage.getItem(key);
  if (item) {
    const itemObject = JSON.parse(item);
    if (!isExpired(itemObject.createdAt)) {
      return itemObject.value;
    } else {
      localStorage.removeItem(key);
    }
  }
}

function isExpired(createdAt) {
  const now = (new Date()).getTime();
  return (now - createdAt) >= (IMAGE_URL_EXPIRATION * 1000 * .9);
}
