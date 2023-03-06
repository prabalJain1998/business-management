import { Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CardItem from "../common/CardItem";

const Insights = () => {
  const { insights } = useSelector((state) => state.allCustomers);

  return (
    <div className="overall">
      <div>
        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Orders"}
            value={insights?.orders?.totalOrder}
            threshold={500}
            start={1}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Remaining"}
            value={insights?.orders?.totalPendingOrders}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Amount"}
            value={insights?.amount?.totalAmount}
            threshold={0}
            disableIcon={true}
          />
        </Grid>
      </div>

      <div>
        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Paid"}
            value={insights?.amount?.totalPaid}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Discount"}
            value={insights?.amount?.totalDiscount}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Remain"}
            value={insights?.amount?.totalRemain}
            disableIcon={true}
          />
        </Grid>
      </div>

      <div>
        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Cash"}
            value={insights?.money?.totalCash}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Online"}
            value={insights?.money?.totalOnline}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Bank"}
            value={insights?.money?.totalBank}
            threshold={0}
            disableIcon={true}
          />
        </Grid>
      </div>

      <div>
        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"User Amount"}
            value={insights?.user?.totalAmountUser}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"User Paid"}
            value={insights?.user?.totalPaidUser}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"User Remain"}
            value={
              insights?.user?.totalAmountUser -
              insights?.user?.totalPaidUser -
              insights?.user?.totalDiscountUser
            }
            threshold={0}
            disableIcon={true}
          />
        </Grid>
      </div>

      <div>
        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Party Amount"}
            value={insights?.party?.totalAmountParty}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Party Paid"}
            value={insights?.party?.totalPaidParty}
            threshold={0}
            disableIcon={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={6}>
          <CardItem
            keyItem={"Party Remain"}
            value={
              insights?.party?.totalAmountParty -
              insights?.party?.totalPaidParty -
              insights?.party?.totalDiscountParty
            }
            threshold={0}
            disableIcon={true}
          />
        </Grid>
      </div>
    </div>
  );
};

export default Insights;
