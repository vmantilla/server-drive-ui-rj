// utils.js

export function fetchJsonFile(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    });
}
