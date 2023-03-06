import * as React from "react";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const cssStyle = {
  textDecoration: "underline",
  color: "#1976d2",
  marginBottom: "5px",
  fontFamily: "Roboto",
  fontSize: "15px",
  paddingTop: "3px",
};

const linkStyle = {
  display: "flex",
  flexDirection: "column",
};

const menuHeaderStyle = {
  color: "#1976d2",
};

export const mainListItems = (
  <React.Fragment>
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="orderAccordion"
      >
        <Typography style={menuHeaderStyle}>Order</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={linkStyle}>
          <Link to="/customer/search" style={cssStyle}>
            Search Order
          </Link>
          <Link to="/customer/create" style={cssStyle}>
            Create Order
          </Link>
          <Link to="/customer/statement/" style={cssStyle}>
            Statement
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="partyAccordion"
      >
        <Typography style={menuHeaderStyle}>Party</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={linkStyle}>
          <Link to="/party/create/" style={cssStyle}>
            Create Party
          </Link>
          <Link to="/party/all" style={cssStyle}>
            All Parties
          </Link>
          <Link to="/acceptPayment" style={cssStyle}>
            Accept Payment
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="internalPartyAccordion"
      >
        <Typography style={menuHeaderStyle}>Internal Party</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={linkStyle}>
          <Link to="/internal/party/create/" style={cssStyle}>
            Create Internal Party
          </Link>
          <Link to="/internalPartyPayment" style={cssStyle}>
            Internal Payments
          </Link>
          <Link to="/internal/party/all" style={cssStyle}>
            All Internal Parties
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="partyAccordion"
      >
        <Typography style={menuHeaderStyle}>Digital</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={linkStyle}>
          <Link to="/digital/action/create/" style={cssStyle}>
            Create Order
          </Link>
          <Link to="/digital/orders" style={cssStyle}>
            All Orders
          </Link>
          <Link to="/digital/action/payment/" style={cssStyle}>
            Payment
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="partyAccordion"
      >
        <Typography style={menuHeaderStyle}>Products</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={linkStyle}>
          <Link to="/product/create/" style={cssStyle}>
            Create Product
          </Link>
          <Link to="/products" style={cssStyle}>
            All Products
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>

    {/* <Accordion>
    <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="partyAccordion"
        >
          <Typography style={{color:"grey"}}>Shadi Orders</Typography>
    </AccordionSummary>
    <AccordionDetails>
    <ListItemButton>
      <Link to='/customer/shadi/create/' style={cssStyle}>Create Shadi Order</Link>
    </ListItemButton>

    </AccordionDetails>
    </Accordion> */}

    {/* <Accordion>
    <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="partyAccordion"
        >
          <Typography style={{color:"grey"}}>Employee</Typography>
    </AccordionSummary>
    <AccordionDetails>
    <ListItemButton>
      <Link to='/employee/action/create/' style={cssStyle}>Create Employee</Link>
    </ListItemButton>

    <ListItemButton>
    <Link to='/employee/action/details' style={cssStyle}>Details</Link>
    </ListItemButton>

    <ListItemButton>
    <Link to='/employee/action/entry' style={cssStyle}>Entry</Link>
    </ListItemButton>

    </AccordionDetails>
    </Accordion> */}

    {/* <Accordion>
    <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="sendMessageAccordion"
        >
          <Typography style={{color:"grey"}}>Whatsapp</Typography>
    </AccordionSummary>
    <AccordionDetails>
    <ListItemButton>
    <Link to='/send/' style={cssStyle}>Whatsapp</Link>
    </ListItemButton>
    </AccordionDetails>
    </Accordion> */}

    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="trashAccordion"
      >
        <Typography style={menuHeaderStyle}>Trash</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={linkStyle}>
          <Link to="/trash/orders" style={cssStyle}>
            Trash
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="partyAccordion"
      >
        <Typography style={menuHeaderStyle}>Logs</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={linkStyle}>
          <Link to="/logs" style={cssStyle}>
            Details
          </Link>
          <Link to="/logs/action/payment" style={cssStyle}>
            Payment
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="partyAccordion"
      >
        <Typography style={menuHeaderStyle}>User</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={linkStyle}>
          <Link to="/customer/password/update" style={cssStyle}>
            Update Password
          </Link>
          <Link to="/customer/logout" style={cssStyle}>
            Logout
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>
  </React.Fragment>
);

export const secondaryListItems = <React.Fragment></React.Fragment>;
