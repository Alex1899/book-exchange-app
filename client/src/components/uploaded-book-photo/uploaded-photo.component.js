import React from "react";
import ImageUploader from "react-images-upload";
import { Trash } from "react-bootstrap-icons";
import "./uploaded-photo.styles.scss";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const UploadedPic = ({ photo, onChange }) => {
  const onDrop = async (pic) => {
    console.log({ pic });
    if(pic.length < 1){
      console.log("Error uploading pic")
      return 
    }
    const imgData = await getBase64(pic[0]);
    console.log({ imgData });
    onChange(imgData);
  };

  return (
    <div className="uploaded-photo">
      {!photo ? (
        <ImageUploader
          className="uploader"
          buttonStyles={{ backgroundColor: "black" }}
          withIcon={true}
          singleImage={true}
          label=""
          buttonText="Upload Photo"
          onChange={onDrop}
          imgExtension={[".jpg", ".png", ".gif", ".svg"]}
          maxFileSize={5242880}
          fileSizeError="File size is too big"
        />
      ) : (
        <div className="d-flex flex-column align-items-center">
          <img
            className="book-photo"
            src={photo}
            alt="book"
          />
          <span
            className="d-flex mt-3 align-items-center"
            onClick={() => onChange(null)}
          >
            <Trash />
            <p className="ml-1 m-0 p-0">Remove pic</p>
          </span>
        </div>
      )}
    </div>
  );
};

export default UploadedPic;
