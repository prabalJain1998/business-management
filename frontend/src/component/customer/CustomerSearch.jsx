import { Button, TextField } from "@mui/material";
import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../common/Heading";
import "./CustomerSearch.css";
import CustomerSearchName from "./CustomerSearchName";
import DrawerComponent from "./Drawer.jsx";
import SearchIcon from "@mui/icons-material/Search";
import HeaderActions from "../common/HeaderActions";

const CustomerSearch = () => {
  const [keyword, setKeyword] = useState("");
  const history = useNavigate();

  const searchSubmitHandlerName = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history(`/customer/search/name/${keyword}`);
    } else {
      history("/");
    }
  };

  return (
    <Fragment>
      <HeaderActions />
      <div>
        <Heading
          label={"Search"}
          icon={() => {
            return <SearchIcon />;
          }}
        />
        <div className="searchField">
          <TextField
            label="Search"
            placeholder={"Please enter order name"}
            fullWidth
            sx={{ m: 1 }}
            type="string"
            value={keyword}
            required
            onChange={(e) => setKeyword(e.target.value)}
            variant="outlined"
          />
        </div>

        {keyword.trim().length !== 0 ? (
          <CustomerSearchName name={keyword} />
        ) : (
          <></>
        )}
      </div>
    </Fragment>
  );
};

export default CustomerSearch;
