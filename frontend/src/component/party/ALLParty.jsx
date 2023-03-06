import * as React from "react";
import Loader from "../layout/Loader/Loader.js";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearErrors, getAllParties } from "../../actions/partyAction";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import DrawerComponent from "../customer/Drawer.jsx";
import AllOutIcon from "@mui/icons-material/AllOut";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Heading from "../common/Heading.jsx";
import HeaderActions from "../common/HeaderActions.jsx";

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const ALLParty = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, party } = useSelector((state) => state.allparties);
  const parties = party && party.parties;
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllParties());
  }, [dispatch, alert, error]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 300,
      flex: 1,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link
              to={`/party/partySearch/${params.getValue(params.id, "id")}`}
              style={{
                color: "#1976d2",
                margin: "auto",
              }}
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
            <Heading
              label={"ALL Parties"}
              icon={() => {
                return <AllOutIcon />;
              }}
            />

            <div className="overall"></div>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={100}
              disableSelectionOnClick
              className="productListTable2"
              autoHeight
              components={{
                Toolbar: GridToolbar,
                Pagination: CustomPagination,
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ALLParty;
