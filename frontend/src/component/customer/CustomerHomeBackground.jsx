import React from "react";
import HomePage from "./HomePage.jsx";
import { useSelector } from "react-redux";
import Dashboard from "./Dashboard.jsx";

const CustomerHomeBackground = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return <div>{isAuthenticated ? <Dashboard /> : <HomePage />}</div>;
};

export default CustomerHomeBackground;
