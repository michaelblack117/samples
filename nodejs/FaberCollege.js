var qrcode = require('qrcode-terminal');
const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

const client = new AgencyServiceClient(new Credentials(
  "teyOFPKTDO23SB2gKCsv4X20vgjWbQMkCWpXHYyP54s", // access token
  "ecfdc8b9ba9045bca3589279ac5b86c0" // subscription token
));

const getTranscriptSchema = async () => {
  try {
    let schemas = await client.listSchemas();
    let schema = schemas.find(x => x.name === 'College Transcript');
    return schema;
  }
  catch (e) {
    console.error(e);
  }
}

const run = async () => {
  try {
    console.log("####### CREATE CREDENTIALS #######");
    let schema = await getTranscriptSchema();
    if (schema === undefined) {
      console.log('\tCreating Faber College Transcript Schema');
      schema = await client.createSchema({
        body: {
          name: 'College Transcript',
          version: '1.0',
          attrNames: [ "First Name", "Last Name", "Degree", "GPA", "Year"]
        }
      })
      console.log('\t✓ Done.');
    }
    else {
      console.log('\t✓ Faber College Transcript Schema Found');
    }

    let credentialDefinitions = await client.listCredentialDefinitions();
    let credentialDefinition = credentialDefinitions.find(x => x.name === 'College Transcript');
    if (credentialDefinition === undefined) {
      console.log('\tCreating College Transcript Definition');
      credentialDefinition = await client.createCredentialDefinitionForSchemaId(schema.id, {
        body: {
          supportRevocation: false,
          tag: "Default"
        }
      });
    }
    else {
      console.log('\t✓ College Transcript Definition Found');
    }

    console.log("\n####### FABER COLLEGE INVITES ALICE TO CONNECT #######");
    let connection = await client.createConnection({
      body: {
        // connectionId: "unique id", // not specifying id will generate a random one
        multiParty: false
      }
    });
    qrcode.generate(connection.invitationUrl, {small: true});
    console.log("Scan the QR Code with your mobile wallet to connect and continue...");
    await waitForConnection(connection);
    console.log('\t✓ Alice Connected with Faber College');

    console.log("\n####### FABER COLLEGE ISSUES TRANSCRIPT TO ALICE #######");
    let credential = await client.createCredential({
      body: {
        definitionId: credentialDefinition.definitionId,
        connectionId: connection.connectionId,
        automaticIssuance: false,
        credentialValues: {
          "First Name": "Alice",
          "Last Name": "Winterland",
          "Degree": "Bachelor of Science",
          "GPA": "4.0",
          "Year": "2020"
        }
      }
    });
    console.log("\t✓ Faber Offers Credential To Alice");
    console.log("\tOpen your mobile wallet to review and accept credential...");
    await waitForCredentialState(credential, "Requested");
    console.log("\t✓ Alice Requested Credential");

    // If you checked true on automaticIssuance then you don't need this step
    await client.issueCredential(credential.credentialId);
    console.log("\t✓ College Transcript Issued to Alice");

    console.log("\nNow Alice can use her college transcript to apply for a job at ACME Corp\n");

  }
  catch (e) {
    console.error(e);
    return;
  }
}

const waitForConnection = async (connection) => {
  try {
    while (connection.state !== 'Connected') {
      connection = await client.getConnection(connection.connectionId);
      await sleep(3000);
    }
  }
  catch (e) {
    console.error(e);
  }
}

const waitForCredentialState = async (credential, state = 'Requested') => {
  try {
    // The potential credential states are:
    // 'Offered' | 'Requested' | 'Issued' | 'Rejected' | 'Revoked'
    while (credential.state !== state) {
      credential = await client.getCredential(credential.credentialId);
      await sleep(3000);
    }
  }
  catch (e) {
    console.error(e);
  }
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = {
  run: run,
  getTranscriptSchema: getTranscriptSchema
}
