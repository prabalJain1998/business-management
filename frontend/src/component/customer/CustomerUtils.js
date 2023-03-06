import jsPDF from "jspdf";

export const generateLink = (phone, remain, status) => {
  if (!phone) {
    alert.error("No whatsapp found");
    return;
  }
  if (status != "COMPLETED") {
    alert.error("भाई पहले आर्डर पूरा करो");
    return;
  }
  let message = "";
  let messageHindi = "";
  if (Number(remain) === 0) {
    message = `Hi, Welcome to Singhai Printers, your order is ${status} Please Collect it from the Store Thanks!!`;
    messageHindi = `नमस्ते, सिंघई प्रिंटर्स में आपका स्वागत है, आपका ऑर्डर पूरा हो गया है कृपया दुकान से सामान ले जाइए धन्यवाद !!`;
  } else {
    message = `Hi, Welcome to Singhai Printers, your order is ${status} You have remaining Payment of ${remain} Please Complete the Payment and Collect the Order from the Store Thanks!!`;
    messageHindi = `नमस्ते, सिंघई प्रिंटर्स में आपका स्वागत है, आपका ऑर्डर पूरा हो गया है आपके पास ${remain} रुपये का भुगतान शेष है कृपया भुगतान पूरा करें और दुकान से सामान ले जाइए धन्यवाद !!`;
  }

  let text = encodeURI(messageHindi + "     " + message);
  let generatedLink = `https://wa.me/+91${phone}?text=${text}`;
  const win = window.open(generatedLink, "_blank");
  win.focus();
};

export const exportToPdf = (buttonDatasetMappings, buttonID) => {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape";

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  const headers = [
    [
      "Order Date",
      "Name",
      "Particulars",
      "Phone",
      "Total",
      "Paid",
      "Remain",
      "Order Status",
    ],
  ];

  const downloadPdf = buttonDatasetMappings[buttonID]?.dataset.map((elt) => [
    elt.orderDate.substring(0, 10).split("-").reverse().join("-"),
    elt.name,
    elt.particulars,
    elt.phoneNo,
    elt.amount,
    elt.paid,
    elt.remain,
    elt.orderStatus,
  ]);
  const title = buttonDatasetMappings[buttonID].name;

  let content = {
    startY: 50,
    head: headers,
    body: downloadPdf,
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  const dateToday = new Date(Date.now());
  doc.save(
    title +
      "_" +
      dateToday.toString().substring(4, 10).split("-").reverse().join("-") +
      "_" +
      dateToday.getFullYear() +
      ".pdf"
  );
};
