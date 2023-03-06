import React, { Fragment } from "react";
import Pagination from "@mui/material/Pagination";
import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { useDispatch } from "react-redux";

const TableComponent = ({
  dataset,
  columns,
  pageSize,
  disableSelectionOnClick,
  autoHeight,
  page,
  onPageChange,
}) => {
  const dispatch = useDispatch();

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

  return (
    <Fragment>
      <DataGrid
        page={page}
        onPageChange={onPageChange}
        rows={dataset}
        columns={columns}
        pageSize={pageSize}
        disableSelectionOnClick={disableSelectionOnClick}
        autoHeight={autoHeight}
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
    </Fragment>
  );
};

export default TableComponent;
