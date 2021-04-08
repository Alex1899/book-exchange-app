import axios from "axios";

export const addBookToDB = async (url, bookObject) => {
  let response = await axios.post(url, bookObject);
  if (response.error) {
    console.log(response.error);
  }

  return !response.error ? "success" : "error";
};

export const handleErrors = (e, handleAlert) => {
  let msg = e.response.data.errors ? e.response.data.errors.msg : null;
  switch (e.response.status) {
    case 404:
      handleAlert(msg ? msg : "Requested Page Not Found");
      break;
    case 401:
      handleAlert(msg ? msg : "You are not authorized to access this resource");
      break;
    case 500:
      handleAlert(
        msg
          ? msg
          : "Sorry :( There was an error with the server. Please try again later"
      );
      break;
    default:
      handleAlert("There was an error. Please, try again later");
      break;
  }
};
