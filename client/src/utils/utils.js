import axios from "axios";

export const addBookToDB = async (url, bookObject) => {
  let response = await axios.post(url, bookObject);
  if (response.error) {
    console.log(response.error);
  }

  return !response.error ? "success" : "error";
};

