import React from "react";

const Heading = ({ label, icon }) => {
  return (
    <div
      style={{
        fontFamily: "Roboto",
        fontSize: "30px",
        fontWeight: "bold",
        margin: "10px 20px",
        display: "flex",
        color: "purple",
      }}
    >
      <div style={{ color: "#1976d2", paddingRight: "10px" }}>
        {icon && icon()}
      </div>

      {label}
    </div>
  );
};

export default Heading;
