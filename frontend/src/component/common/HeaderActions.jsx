import React from "react";
import MenuList from "./MenuList";
import "./HeaderAction.css";

const HeaderActions = () => {
  return (
    <div id="headerAction">
      <MenuList
        actionTitle={"Home"}
        routes={[
          {
            title: "Home",
            route: "/",
          },
        ]}
      />

      <MenuList
        actionTitle={"Order"}
        routes={[
          {
            title: "Search",
            route: "/customer/search",
          },
          {
            title: "Create",
            route: "/customer/create",
          },
          {
            title: "Statement",
            route: "/customer/statement",
          },
        ]}
      />

      <MenuList
        actionTitle={"Party"}
        routes={[
          {
            title: "Create Party",
            route: "/party/create",
          },
          {
            title: "All Parties",
            route: "/party/all",
          },
          {
            title: "Accept Payment",
            route: "/acceptPayment",
          },
        ]}
      />

      <MenuList
        actionTitle={"Internal Party"}
        routes={[
          {
            title: "Create Internal Party",
            route: "/internal/party/create",
          },
          {
            title: "Internal Parties",
            route: "/internal/party/all",
          },
          {
            title: "Payments",
            route: "/internalPartyPayment",
          },
        ]}
      />

      <MenuList
        actionTitle={"Digital"}
        routes={[
          {
            title: "Create",
            route: "/digital/action/create",
          },
          {
            title: "Orders",
            route: "/digital/orders",
          },
          {
            title: "Payments",
            route: "/digital/action/payment",
          },
        ]}
      />

      <MenuList
        actionTitle={"Logs"}
        routes={[
          {
            title: "Details",
            route: "/logs",
          },
          {
            title: "Payment",
            route: "/logs/action/payment",
          },
        ]}
      />

      <MenuList
        actionTitle={"Products"}
        routes={[
          {
            title: "Create Product",
            route: "/product/create",
          },
          {
            title: "Products",
            route: "/products",
          },
        ]}
      />

      <MenuList
        actionTitle={"Trash"}
        routes={[
          {
            title: "Details",
            route: "/trash/orders",
          },
        ]}
      />

      <MenuList
        actionTitle={"User"}
        routes={[
          {
            title: "Update Password",
            route: "/customer/password/update",
          },
          {
            title: "Log out",
            route: "/customer/logout",
          },
        ]}
      />
    </div>
  );
};

export default HeaderActions;
