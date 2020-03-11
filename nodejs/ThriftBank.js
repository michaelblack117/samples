var qrcode = require('qrcode-terminal');
const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

const thriftBankClient = new AgencyServiceClient(new Credentials(
  "9HTlZgoWSkHLBzMe7DRCDRA12NuIRimA8cwn5Jzo8Yg", // access token
  "ecfdc8b9ba9045bca3589279ac5b86c0" // subscription token
));
