import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "../customer/CustomerSearch.css";
import DrawerComponent from "../customer/Drawer";

const PartySearch = () => {
  const [keyword, setKeyword] = useState("");
  const history = useNavigate();

  const searchSubmitHandlerOrderID = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history(`/party/partySearch/${keyword}`);
    } else {
      history("/");
    }
  };

  return (
    <Fragment>
      <DrawerComponent />
      <div className="searchCustomer">
        <form className="searchBox2" onSubmit={searchSubmitHandlerOrderID}>
          <input
            type="text"
            placeholder="Search By Order ID ..."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input type="submit" value="Search" />
        </form>
      </div>
    </Fragment>
  );
};

export default PartySearch;
