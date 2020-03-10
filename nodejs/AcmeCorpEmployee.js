const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

// const client = new AgencyServiceClient(new Credentials("<access token>", "<subscription key>"));
const client = new AgencyServiceClient(new Credentials("pGtYaJIopuMMYh2PFsNE3oafUTYxjg743_ToPSyoHS8", "ecfdc8b9ba9045bca3589279ac5b86c0"));


const createConnection = async () => {
  try {
    // Generate Connection Invitation
    let connection = await client.createConnection({
      connectionInvitationParameters: {
        // connectionId: "unique id", // not specifying id will generate a random one
        multiParty: false
      }
    });
    return connection;
  }
  catch (e) {
    console.error(e);
  }
}

const getConnection = async (id) => {
  try {
    let connection = await client.getConnection(id);
    return connection;
  }
  catch (e) {
    console.error(e);
  }
}

const connectWithAlice = async () => {
  // make and invitation to connect
  let connection = await createConnection();
  let id = connection.connectionId;
  // send the invitation to Alice in some way.
  console.log("Invitation To Connect", connection.invitationUrl);

  // wait for Alice to accept the invitation
  while (connection.state !== 'Connected') {
    connection = await getConnection(id);
  }
  console.log("Yay we made a connection to Alice!");
  return connection;
}

const createJobApplication = async (schemaRestrictionId) => {
  try {
    // create verification definition
    let jobApplication = await client.createVerificationDefinition({
      proofRequest: {
        name: "Job Application",
        version: "1.0",
        requestedAttributes: {
          "Verify First Name": {
            name: "First Name",
            restrictions: [
              {
                schemaId: schemaRestrictionId
              }
            ]
          },
          "Verify Last Name": {
            name: "Last Name",
            restrictions: [
              {
                schemaId: schemaRestrictionId
              }
            ]
          },
          "Verify Degree": {
            name: "Degree",
            restrictions: [
              {
                schemaId: schemaRestrictionId
              }
            ]
          },
          "Verify GPA": {
            name: "GPA",
            restrictions: [
              {
                schemaId: schemaRestrictionId
              }
            ]
          },
        }
      }
    });
    return jobApplication;
  }
  catch (e) {
    console.error(e);
  }
}

const sendJobApplication = async (verificationId, connectionId) => {
  try {
    let verificationId = await client.createVerification({
      verificationDefinitionId: verificationId,
      connectionId: connectionId
    });
    return verificationId;
  }
  catch (e) {
    console.error(e);
  }
}

const createEmployeeSchema = async () => {
  try {
    // ACME Corp Employee Schema Definition
    const employeeSchema = await client.createSchema({
      schemaParameters: {
        name: "Employee",
        version: "1.0",
        attrNames: [
          "First Name",
          "Last Name",
          "Salary",
          "Experience",
          "Start Date"
        ]
      }
    });
    return employeeSchema;
  }
  catch (e) {
    console.error(e);
  }
}

run = async () => {
  // First make a connection with Alice
  // let connection = await connectWithAlice();

  let schema = await createEmployeeSchema();

  // let application = await createJobApplication(schema.idea);
  console.log(schema);
}

run();
