import React from "react";

const HorizontalLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      width: "100%",
    }}
  />
);

export default HorizontalLine;
