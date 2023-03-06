import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerHome.css";
import DrawerComponent from "./Drawer.jsx";

const CustomerHome = () => {
  const history = useNavigate();
  const [keyword, setKeyword] = useState("");

  const updateSubmitHandlerOrderID = () => {
    if (keyword.length === 0) {
      history("/");
    } else {
      history(`/customer/update/${keyword}`);
    }
  };

  const deleteSubmitHandlerOrderID = () => {
    if (keyword.length === 0) {
      history(`/`);
    } else {
      history(`/customer/delete/${keyword}`);
    }
  };

  return (
    <Fragment>
      <div>
        <DrawerComponent />
        <div className="searchCustomer">
          <form className="searchBox2" onSubmit={updateSubmitHandlerOrderID}>
            <input
              type="text"
              placeholder="UPDATE By Order ID ..."
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input type="submit" value="UPDATE" />
          </form>

          <form className="searchBox2" onSubmit={deleteSubmitHandlerOrderID}>
            <input
              type="text"
              placeholder="Delete By Order ID ..."
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input type="submit" value="DELETE" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CustomerHome;
