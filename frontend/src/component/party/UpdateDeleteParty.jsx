import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../customer/CustomerCreateOrder.css";
import DrawerComponent from "../customer/Drawer";

const UpdatePartySearch = () => {
  const history = useNavigate();
  const [keyword, setKeyword] = useState("");

  const updateSubmitHandlerOrderID = () => {
    if (keyword.length === 0) {
      history("/");
    } else {
      history(`/party/update/${keyword}`);
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
              placeholder="UPDATE By Party ID ..."
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input type="submit" value="UPDATE" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdatePartySearch;
