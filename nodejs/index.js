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

const getSchemas = async () => {
  try {
    // Get List of Schemas
    let schemas = await client.listSchemas();
    return schemas;
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
    return employeeSchema;
  }
  catch (e) {
    console.error(e);
  }
}

const getCredentials = async () => {
  try {
    const credentials = await client.listCredentials();
  }
  catch (e) {
    console.error(e);
  }
}
const createCredentialDefinitionFromSchema = async (schemaId) => {
  if (schemaId === null) { throw new Error("please provide schema ID") }
  try {
    // Create Credential Definition With Schema
    const credentialDefinition = await client.createCredentialDefinition(schemaId, {
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

// Buggy

// const createTranscriptCredential = async () => {
//   try {
//     // Create Credential Definition With Schema
//     const credentialDefinition = await client.createCredentialDefinition({
//       credentialDefinitionFromSchemaParameters: {
//           name: "College Transcript",
//           version: "1.0",
//           attrNames: ["Name", "Major", "GPA", "Year of Graduation"],
//           supportRevocation: false,
//           tag: "Faber Year 1"
//       }
//     });
//
//     return credentialDefinition;
//   }
//   catch (e) {
//     console.error(e);
//   }
// }

const createInvitation = async () => {
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
    let faberCollege = orgs.find(x => x.name === "Faber College");
    let acmeCorp = orgs.find(x => x.name === "ACME Corp");
    let thriftBank = orgs.find(x => x.name === "Thrift Bank");

    // let transcriptSchema = await createTranscriptSchema();
    // let employeeSchema = await createEmployeeSchema();

  }
  catch (e) {
    console.error(e);
  }
}

// main();

module.exports = {
  getOrganizations,
  getSchemas,
  createTranscriptSchema,
  createEmployeeSchema,
  getCredentials,
  createCredentialDefinitionFromSchema,
  // createTranscriptCredential,
  createInvitation,
  offerCredential
}
