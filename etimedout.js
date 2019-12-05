const request = require("request");

function fetch(url, { method, body, headers }) {
  return new Promise((resolve, reject) => {
    request(url, {
      method,
      body,
      headers,
      callback: (error, response, body) => {
        if (error) {
          // Network-related errors such as ETIMEDOUT and ECONNRESET.
          reject(error);
        } else {
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: body
          });
        }
      }
    });
  });
}

Promise.all(
  Array(1000)
    .fill(0)
    .map((_, i) => {
      return fetch("http://localhost:8000", { method: "post", body: `${i}` });
    })
)
  .then(() => {
    console.log("done");
  })
  .catch(error => {
    console.error(error);
  });
