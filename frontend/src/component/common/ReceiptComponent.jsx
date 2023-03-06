import React from "react";
import singhaiLogo from "../../images/singhaiLogo.PNG";
import { Button, Chip, Divider } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const ReceiptComponent = ({
  orderDate,
  deliveryDate,
  phoneNo,
  whatsappNo,
  name,
  paymentStatus,
  paymentMode,
  particulars,
  totalAmount,
  paidAmount,
  remainingAmount,
  customizeHeight,
  title,
}) => {
  const length = particulars?.length;
  const rowsToAppend = 14 - length;
  let emptyRowArray = [];
  if (rowsToAppend > 0) {
    emptyRowArray = Array.from({ length: rowsToAppend }, (v, i) => i);
  }

  const [hindi, setHindi] = React.useState(false);

  const classes = {
    receiptContainer: {
      width: customizeHeight ? "auto" : "300px",
      height: customizeHeight ? "auto" : "430px",
      padding: "15px",
      margin: "22px",
      marginTop: "10px",
    },
    container_a: {
      height: "auto",
    },
    container_a_1: {
      position: "right",
      float: "right",
      fontSize: 8,
      display: "flex",
      width: "100%",
      color: "black",
      borderRadius: "10%",
      justifyContent: "space-between",
      margin: "1px",
    },
    container_a_2: {
      display: "flex",
      justifyContent: "center",
    },
    container_a_2_1: {
      fontSize: 6,
      textAlign: "center",
      padding: "1px",
      color: "black",
      fontWeight: "bold",
    },
    container_a_3: {
      fontSize: 7,
      textAlign: "center",
      padding: "2px",
      color: "black",
      borderBottom: "1px solid black",
      borderTop: "1px solid black",
    },
    container_b: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "bold",
    },
    container_b_1: {
      display: "flex",
      flexDirection: "column",
      fontSize: 7,
      paddingTop: "5px",
      width: "70px",
    },
    container_b_2: {
      display: "flex",
      flexDirection: "column",
      fontSize: 7,
      paddingTop: "2px",
      width: "200px",
      textAlign: "right",
      overflowWrap: "anywhere",
    },
    emptyRowStyle: {
      fontSize: 9,
      padding: "2px",
      height: "10px",
    },
  };

  return (
    <div style={classes.receiptContainer}>
      <Button onClick={() => setHindi(!hindi)}></Button>
      {/* <center> <Chip label={title} style={{height:"10px", fontSize:"6px"}}/></center> */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={classes.container_a}>
          {/* Singhai Printers */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={classes.container_a_1}>
              <b>
                <p style={{ opacity: 0.7 }}>
                  <LocalPhoneIcon style={{ height: "6px", width: "6px" }} />{" "}
                  9993461758
                </p>
              </b>
              <Chip label={title} style={{ height: "10px", fontSize: "6px" }} />
              <b>
                <p style={{ marginLeft: "2px" }}>
                  <LocalPhoneIcon style={{ height: "6px", width: "6px" }} />
                  <WhatsAppIcon style={{ height: "6px", width: "6px" }} />{" "}
                  7898830709
                </p>
              </b>
            </div>
            <div style={{ display: "flex" }}>
              <img src={singhaiLogo} alt="heading" width="50px" height="40px" />
              {!hindi ? (
                <p
                  style={{
                    fontSize: "29px",
                    marginLeft: "30px",
                    fontWeight: "bold",
                  }}
                >
                  Singhai Printers
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "29px",
                    marginLeft: "30px",
                    fontWeight: "bold",
                    fontFamily: "Pacifico",
                  }}
                >
                  सिंघई प्रिंटर्स
                </p>
              )}
            </div>
          </div>

          {/* Accessories */}
          <div style={classes.container_a_2}>
            {!hindi ? (
              <>
                <div style={classes.container_a_2_1}>
                  <p>Shadi Cards |</p>
                </div>

                <div style={classes.container_a_2_1}>
                  <p>Visiting Cards |</p>
                </div>
                <div style={classes.container_a_2_1}>
                  <p>Rubber Stamps |</p>
                </div>
                <div style={classes.container_a_2_1}>
                  <p>Flex Banner |</p>
                </div>
                <div style={classes.container_a_2_1}>
                  <p>Multicolor & Digital Printing and Many more...</p>
                </div>
              </>
            ) : (
              <p style={classes.container_a_2_1}>
                शादी कार्ड विजिटिंग कार्ड रबर स्टैम्प फ्लेक्स बैनर मल्टीकलर
                डिजिटल प्रिंटिंग और भी बहुत कुछ..
              </p>
            )}
          </div>

          {/* Address */}
          <div style={classes.container_a_3}>
            <p>
              {!hindi
                ? "Near Dr. Moghe ki Gali, Jhansi Tiraha, Krishnapuram Colony Shivpuri (M.P.)"
                : "डॉ. मोघे की गली, कृष्णापुरम कॉलोनी, झांसी तिराहा शिवपुरी (म.प्र.)"}
            </p>
          </div>
        </div>

        {/* Second */}
        <div style={classes.container_b}>
          <div style={classes.container_b_1}>
            <p>
              Date: {orderDate?.substring(0, 10).split("-").reverse().join("/")}
            </p>
            <p>
              Delivery :{" "}
              {deliveryDate?.substring(0, 10).split("-").reverse().join("/")}
            </p>
            <p style={{ fontSize: "9px", fontWeight: "bold" }}>
              <LocalPhoneIcon style={{ height: "6px", width: "6px" }} />{" "}
              {phoneNo && `${phoneNo}`}{" "}
            </p>
            <p style={{ fontSize: "9px", fontWeight: "bold" }}>
              <WhatsAppIcon style={{ height: "6px", width: "6px" }} />{" "}
              {whatsappNo && `${whatsappNo}`}{" "}
            </p>
          </div>

          <div style={classes.container_b_2}>
            <p style={{ fontSize: "15px" }}>{name}</p>
            <p>
              {paymentMode &&
                paymentStatus &&
                `${paymentStatus} | ${paymentMode}`}
            </p>
          </div>
        </div>

        <div>
          <table class="table-bordered">
            <thead>
              <tr>
                <th>
                  <p
                    style={{
                      fontSize: 8,
                      padding: "2px",
                      width: "110px",
                      maxWidth: "110px",
                    }}
                  >
                    Particulars
                  </p>
                </th>
                <th>
                  <p style={{ fontSize: 8, padding: "2px" }}>Quantity</p>
                </th>
                <th>
                  <p style={{ fontSize: 8, padding: "2px" }}>Price</p>
                </th>
                <th>
                  <p style={{ fontSize: 8, padding: "2px" }}>Amount</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {particulars?.map((item) => (
                <tr>
                  <td>
                    <p
                      style={{
                        fontSize: 10,
                        padding: "2px",
                        maxWidth: "100%",
                        wordWrap: "break-word",
                      }}
                    >
                      {item.item}
                    </p>
                  </td>
                  <td>
                    <p style={{ fontSize: 10, padding: "2px" }}>
                      {item.quantity}
                    </p>
                  </td>
                  <td>
                    <p style={{ fontSize: 10, padding: "2px" }}>{item.price}</p>
                  </td>
                  <td>
                    <p style={{ fontSize: 10, padding: "2px" }}>{item.total}</p>
                  </td>
                </tr>
              ))}
              {emptyRowArray.map(() => (
                <tr>
                  <td>
                    <p style={classes.emptyRowStyle}></p>
                  </td>
                  <td>
                    <p style={classes.emptyRowStyle}></p>
                  </td>
                  <td>
                    <p style={classes.emptyRowStyle}></p>
                  </td>
                  <td>
                    <p style={classes.emptyRowStyle}></p>
                  </td>
                </tr>
              ))}

              <tr>
                <td colspan="3" class="text-right">
                  <p style={{ fontSize: 9, padding: "2px" }}>Total :</p>
                </td>
                <td>
                  {" "}
                  <p style={{ fontSize: 11, padding: "2px" }}>
                    <b>{totalAmount}</b>
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="text-right">
                  <p style={{ fontSize: 9, padding: "2px" }}>Paid :</p>
                </td>
                <td>
                  <p style={{ fontSize: 11, padding: "2px" }}>
                    <b>{paidAmount}</b>
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="text-right">
                  <p style={{ fontSize: 9, padding: "2px" }}>Remain :</p>
                </td>
                <td>
                  <p style={{ fontSize: 11, padding: "2px" }}>
                    <b>{remainingAmount}</b>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginTop: "2px", opacity: 0.6 }}>
        <p style={{ fontSize: 6 }}>
          फ़ोन करने का समय : दोपहर 12 बजे से रात 8 बजे तक, धन्यवाद्
        </p>
      </div>
    </div>
  );
};

export default ReceiptComponent;
