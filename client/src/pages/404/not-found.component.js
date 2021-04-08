import React from "react";
import NotFoundImage from "../../assets/404_page.png";

const NotFoundPage = () => (
  <div className="d-flex justify-content-center">
    <div className="d-flex justify-content-center" style={{ width: 400 }}>
      <img src={NotFoundImage} alt="page not found" style={{ width: "100%" }} />
    </div>
  </div>
);

export default NotFoundPage;
