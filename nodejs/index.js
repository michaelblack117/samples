const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

// const client = new AgencyServiceClient(new Credentials("<access token>", "<subscription key>"));
const client = new AgencyServiceClient(new Credentials("teyOFPKTDO23SB2gKCsv4X20vgjWbQMkCWpXHYyP54s", "ecfdc8b9ba9045bca3589279ac5b86c0"));

const getOrganizations = async () => {
  try {
    var organizations = await client.listTenants();
    return organizations;
  }
  catch (e) {
    console.error(e);
  }
}

const createTranscriptSchema = async () => {
  try {
    // Create Credential Schema
    const transcriptSchema = await client.createSchema({
        schemaParameters: {
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

const createEmployeeSchema = async () => {
  try {
    // Create Credential Schema
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
  }
  catch (e) {
    console.error(e);
  }
}

const createCredentialDefinition = async (schemaId) => {
  var credentialDefinition;
  if (schemaId === null) { throw new Error("please provide schema ID") }
  try {
    // Create Credential Definition With Schema
    credentialDefinition = await client.createCredentialDefinition(schemaId, {
        credentialDefinitionFromSchemaParameters: {
            supportRevocation: false,
            tag: "unique identifier"
        }
    });

    return credentialDefinition;
  }
  catch (e) {
    console.error(e);
  }
}

const createConnection = async () => {
  try {
    // Generate Connection Invitation
    const invitation = await client.createConnection({
        connectionInvitationParameters: {
            // connectionId: "unique id", // not specifying id will generate a random one
            multiParty: false
        }
    });
    return invitation
  }
  catch (e) {
    console.error(e);
  }
}

const offerCredential = async (credentialDefinitionId, connectionId) => {
  try {
    // Make a credential offer to a specified connection
    var credentialOffer = await client.createCredential({
        definitionId: credentialDefinitionId,
        connectionId: connectionId
      });
    return credentialOffer;
  }
  catch (e) {
    console.error(e);
  }
}

async function main() {
  try {
    let orgs = await getOrganizations();
    console.log(orgs);
  }
  catch (e) {
    console.error(e);
  }
}

main();

module.exports = {
  getOrganizations,
  createTranscriptSchema,
  createEmployeeSchema,
  createCredentialDefinition,
  createConnection,
  offerCredential
}
