// @ts-check
const path = require("path");
const fs = require("fs");
const pdf = require("pdf-creator-node");

function getAssets() {
  const fontPathBold = fs.readFileSync(
    path.resolve(__dirname, "./fonts/Telefonica-Bold.ttf")
  );
  const fontTelefonicaBold = fontPathBold.toString("base64");
  const fontPathRegular = fs.readFileSync(
    path.resolve(__dirname, "./fonts/Telefonica-Regular.ttf")
  );
  const fontTelefonicaRegular = fontPathRegular.toString("base64");

  return {
    fontTelefonicaBold,
    fontTelefonicaRegular,
  };
}

/**
 * @param {'store-pickup'|'regular'|'express'} type
 *
 * @returns {PdfContentProps}
 */
function getData(type) {
  const bitmap = fs.readFileSync(path.resolve(__dirname, "./img/phone.png"));
  const photo = bitmap.toString("base64");

  /**
   * @type {PdfContentProps} data
   */
  const data = {
    order: {
      client: "David".toUpperCase(),
      phoneLine: "992992992",
      purchaseDate: "22 Junio 2023",
      purchaseTime: "11:55 a.m.",
      phone: {
        photo,
        name: "iPhone 12 Pro",
        color: "Azul",
        feat: "64GB",
        price: {
          amount: "900.00",
          initialAmount: "120.00",
        },
      },
    },
  };

  if (type === "store-pickup") {
    data.shippingInformation = {
      department: "Lima",
      province: "Lima",
      district: "Ventanilla",
      store: "EFE - Ventanilla - Boulevard",
      address: "Mz. C5 Lt.14 Urb. ex Zona comercial e Industrial Callao",
      storeSchedule: "9:00 a.m. a 9:00 p.m.",
    };
  } else {
    data.shippingInformation = {
      department: "Lima",
      province: "Lima",
      district: "Barranco",
      address: "Av. El Sol, 388, int. 401",
      reference: "Frente a la iglesia Santa Carmen.",
    };

    data.deliverySchedule = {
      deliveryDate: "22 de Junio",
      range: "8:00 a.m. - 2:00 p.m.",
    };
  }

  return data;
}

/**
 *
 * @param {string} templatePath
 * @param {PdfContentProps} props
 */
function generatePDF(templatePath, props) {
  const htmlPath = path.resolve(__dirname, templatePath);
  const html = fs.readFileSync(htmlPath, "utf8");
  const pdfPath = htmlPath
    .replace("templates", "pdfs")
    .replace(".html", ".pdf");
  const document = {
    html,
    data: {
      ...getAssets(),
      ...props,
    },
    path: pdfPath,
    type: "",
  };

  const optionsPDF = {
    format: "A4",
    orientation: "portrait",
    border: "0mm",
    height: "633px", // allowed units: mm, cm, in, px
    width: "446px", // allowed units: mm, cm, in, px
  };

  pdf
    .create(document, optionsPDF)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
}

const ExpressCashTemplate = "./templates/express/contado.html";
const ExpressInitialFeeTemplate = "./templates/express/cuota-inicial.html";
const ExpressFinancedTemplate = "./templates/express/financiado.html";
const ExpressMpTemplate = "./templates/express/mp.html";

const RegularCashTemplate = "./templates/regular/contado.html";
const RegularInitialFeeTemplate = "./templates/regular/cuota-inicial.html";
const RegularFinancedTemplate = "./templates/regular/financiado.html";
const RegularMpTemplate = "./templates/regular/mp.html";

const StorePickupCashTemplate = "./templates/store-pickup/contado.html";
const StorePickupInitialFeeTemplate =
  "./templates/store-pickup/cuota-inicial.html";
const StorePickupFinancedTemplate = "./templates/store-pickup/financiado.html";
const StorePickupMpTemplate = "./templates/store-pickup/mp.html";

/**
 * Test
 */
const htmlTemplatePaths = [
  ExpressCashTemplate,
  ExpressInitialFeeTemplate,
  ExpressFinancedTemplate,
  ExpressMpTemplate,
  RegularCashTemplate,
  RegularInitialFeeTemplate,
  RegularFinancedTemplate,
  RegularMpTemplate,
  StorePickupCashTemplate,
  StorePickupInitialFeeTemplate,
  StorePickupFinancedTemplate,
  StorePickupMpTemplate,
];

htmlTemplatePaths.forEach((path) => {
  const type = path.split("/")[2];
  const data = getData(type);
  generatePDF(path, data);
});

// const data = getData("express");
// generatePDF(ExpressCashTemplate, data);

/**
 * @typedef Price
 * @property {string} amount
 * @property {string} [initialAmount]
 */

/**
 * @typedef Product
 * @property {string} photo
 * @property {string} name
 * @property {string} color
 * @property {string} feat
 * @property {Price} price
 */

/**
 * @typedef Order
 *
 * @property {Product} phone
 * @property {string} client
 * @property {string} phoneLine
 * @property {string} purchaseDate
 * @property {string} purchaseTime
 */

/**
 * @typedef ShippingInformation
 *
 * @property {string} department
 * @property {string} province
 * @property {string} district
 * @property {string} [address]
 * @property {string} [reference]
 * @property {string} [store]
 * @property {string} [storeSchedule]
 */

/**
 * @typedef DeliverySchedule
 *
 * @property {string} range
 * @property {string} deliveryDate
 */

/**
 * @typedef {Object}  PdfContentProps
 *
 * @property {Order} [order]
 * @property {ShippingInformation} [shippingInformation]
 * @property {DeliverySchedule} [deliverySchedule]
 *
 */
