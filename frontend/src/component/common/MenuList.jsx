import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MenuList = ({ actionTitle, routes, flex }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const history = useNavigate();
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <p style={{ padding: "3px", fontFamily: "Roboto" }}>{actionTitle} </p>
        <KeyboardArrowDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <div style={{ display: "flex", flexDirection: flex ? flex : "row" }}>
          {routes.map((a) =>
            a.component ? (
              <>{a.component()}</>
            ) : (
              <MenuItem onClick={() => history(a.route)}>
                <p style={{ padding: "10px" }}>{a.title}</p>
              </MenuItem>
            )
          )}
        </div>
      </Menu>
    </div>
  );
};

export default MenuList;
