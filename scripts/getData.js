function fetchData (url) {
  const fetchedData = fetch(url);
  return fetchedData
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject({
          status: response.status,
          statusText: response.statusText,
        });
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      if (error.status === 404) {
        console.log(error)
        return [];
      } else {
        return new Promise(resolve=> resolve({message: `Sorry, something went wrong from server side. ${error.message}`}));
      }
    });
};
