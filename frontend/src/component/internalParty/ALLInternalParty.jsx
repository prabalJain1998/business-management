import * as React from "react";
import Loader from "../layout/Loader/Loader.js";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  clearErrors,
  getAllInternalParties,
} from "../../actions/internalPartyAction";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import DrawerComponent from "../customer/Drawer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import HeaderActions from "../common/HeaderActions.jsx";

const ALLInternalParty = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useNavigate();

  const { loading, error, party } = useSelector(
    (state) => state.allInternalParties
  );

  const parties = party && party.parties;

  const editInternalPartyHandler = (id) => {
    history(`/internal/party/update/${id}`);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllInternalParties());
  }, [dispatch, alert, error]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link
              to={`/internal/party/${params.getValue(params.id, "id")}`}
              style={{ color: "#1976d2", margin: "auto" }}
            >
              {params.getValue(params.id, "name")}
            </Link>
          </Fragment>
        );
      },
    },
    { field: "phoneNo", headerName: "Phone", minWidth: 100, flex: 1 },
    { field: "details", headerName: "Details", minWidth: 100, flex: 1 },
    { field: "address", headerName: "Address", minWidth: 100, flex: 1 },
  ];

  const rows = [];

  parties &&
    parties.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        phoneNo: item.phoneNo,
        details: item.details,
        address: item.address,
      });
    });

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard2">
          <HeaderActions />
          <div className="productListContainer2">
            <h1 id="productListHeading">ALL INTERNAL PARTIES</h1>
            <div className="overall"></div>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={20}
              disableSelectionOnClick
              className="productListTable2"
              autoHeight
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ALLInternalParty;
