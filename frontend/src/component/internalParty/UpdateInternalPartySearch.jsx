import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "../customer/CustomerSearch.css";
import DrawerComponent from "../customer/Drawer";

const UpdateInternalPartySearch = () => {
  const [keyword, setKeyword] = useState("");
  const history = useNavigate();

  const searchSubmitHandlerOrderID = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history(`internal/party/update/${keyword}`);
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
            placeholder="Search Internal By Party ID ..."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input type="submit" value="Update" />
        </form>
      </div>
    </Fragment>
  );
};

export default UpdateInternalPartySearch;
