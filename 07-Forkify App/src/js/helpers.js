import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const request = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([request, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // Propagating error
    throw err;
  }
};

export const deleteRecipe = function (url, id) {
  // https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886?key=<insert your key>
  // URL/ID?key=<insert your jey>
  fetch(
    `https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=8c041166-6462-48a8-95cd-4a370bff8d41`,
    { method: "delete" }
  );
};

/*
export const getJSON = async function (url) {
  try {
    // For test:: const res = await Promise.race([fetch(url), timeout(0.2)]);
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // Propagating error
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // For test:: const res = await Promise.race([fetch(url), timeout(0.2)]);
    const request = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([request, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // Propagating error
    throw err;
  }
};
*/
