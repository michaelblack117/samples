const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

// const client = new AgencyServiceClient(new Credentials("<access token>", "<subscription key>"));
const client = new AgencyServiceClient(new Credentials("teyOFPKTDO23SB2gKCsv4X20vgjWbQMkCWpXHYyP54s", "ecfdc8b9ba9045bca3589279ac5b86c0"));


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

const createTranscriptSchema = async () => {
  try {
    // Faber College Transcript Schema Definition
    let transcriptSchema = await client.createSchema({
        SchemaParameters: {
            name: "College Transcript",
            version: "1.0",
            attrNames: [
                "Name",
                "Major",
                "GPA",
                "Year of Graduation"
            ]
        }
    });
    return transcriptSchema;
  }
  catch (e) {
    console.error(e);
  }
}

const createTranscriptCredDef = async () => {
  try {
      let credentialDefinition = await client.createCredentialDefinition({
      CredentialDefinitionFromSchemaParameters: {
        name: "College Transcript",
        version: "1.0",
        attrNames: [
          "Name",
          "Major",
          "GPA",
          "Year of Graduation"
        ]
      }
    });
    return credentialDefinition;
  }
  catch (e) {
    console.error(e);
  }
}
const createTranscriptCredDefFromSchema = async (schemaId) => {
  try {
    // Create Credential Definition With Schema
    let credentialDefinition = await client.createCredentialDefinitionForSchemaId(
      schemaId,
      {
        CredentialDefinitionParameters: {
          supportRevocation: false,
          tag: "Sophmore"
      }
    });

    return credentialDefinition;
  }
  catch (e) {
    console.error(e);
  }
}

run = async () => {
  // First make a connection with Alice
  // let connection = await connectWithAlice();
  let schema = await createTranscriptSchema();
  console.log(schema);
}

run();
