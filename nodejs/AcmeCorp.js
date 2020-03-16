var qrcode = require('qrcode-terminal');
const FaberCollege = require('./FaberCollege');
const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

const client = new AgencyServiceClient(new Credentials(
  "2DCwKX6P225a5GqrrgVduplOB1BAvPDi7-dPBLguzko", // access token
  "ecfdc8b9ba9045bca3589279ac5b86c0" // subscription token
));

const run = async () => {
  try {
    console.log("####### CREATE CREDENTIALS #######");
    let schemas = await client.listSchemas();
    let schema = schemas.find(x => x.name === 'Employee Certificate');
    if (schema === undefined) {
      console.log('\tCreating ACME Employee Certificate Schema');
      schema = await client.createSchema({
        schemaParameters: {
          name: 'Employee Certificate',
          version: '1.0',
          attrNames: [ "First Name", "Last Name", "Salary", "Experience", "Start Date" ]
        }
      })
      console.log('\t✓ Done.');
    }
    else {
      console.log('\t✓ ACME Employee Certificate Schema Found');
    }

    let credentialDefinitions = await client.listCredentialDefinitions();
    let credentialDefinition = credentialDefinitions.find(x => x.name === 'Employee Certificate');
    if (credentialDefinition === undefined) {
      console.log('\tCreating Employee Certificate Definition');
      credentialDefinition = await client.createCredentialDefinitionForSchemaId(schema.id, {
        credentialDefinitionParameters: {
          supportRevocation: false,
          tag: "Default"
        }
      });
    }
    else {
      console.log('\t✓ Employee Certificate Definition Found');
    }

    console.log("\n####### ACME CORP CREATES JOB APPLICATION FORM #######");
    let transcriptSchema = await FaberCollege.getTranscriptSchema();
    if (transcriptSchema) { console.log("\t✓ Retrieved Transcript Schema from Faber College"); }
    let verificationDefinitions = await client.listVerificationDefinitions();
    let verificationDefinition = verificationDefinitions.find(x => x.data.name === "Job Application");
    if (verificationDefinition === undefined) {
      console.log("\tCreating ACME Job Application Definition...");
      verificationDefinition = await client.createVerificationDefinition({
        body: {
          "name": "Job Application",
          "version": "1.0",
          "nonce": null,
          "requested_attributes": {
            "First Name": {
              "name": "First Name",
              "restrictions": [
                {
                  "schema_id": transcriptSchema.id
                }
              ],
              "non_revoked": {
                "from": 0,
                "to": 0
              }
            },
            "Last Name": {
              "name": "Last Name",
              "restrictions": [
                {
                  "schema_id": transcriptSchema.id
                }
              ],
              "non_revoked": {
                "from": 0,
                "to": 0
              }
            },
            "Degree": {
              "name": "Degree",
              "restrictions": [
                {
                  "schema_id": transcriptSchema.id
                }
              ],
              "non_revoked": {
                "from": 0,
                "to": 0
              }
            },
            "GPA": {
              "name": "GPA",
              "restrictions": [
                {
                  "schema_id": transcriptSchema.id
                }
              ],
              "non_revoked": {
                "from": 0,
                "to": 0
              }
            }
          },
          "requested_predicates": {
            "GPA": {
              "p_type": ">=",
              "p_value": "3.0",
              "name": "string",
              "restrictions": [
                {
                  "schema_id": transcriptSchema.id
                }
              ],
              "non_revoked": {
                "from": 0,
                "to": 0
              }
            }
          },
          "non_revoked": {
            "from": 0,
            "to": 0
          }
        }
      });
    }
    else {
      console.log('\t✓ ACME Job Application Definition Found');
    }

    console.log("\n####### ACME CORP INVITES ALICE TO CONNECT #######");
    let connection = await client.createConnection({
      connectionInvitationParameters: {
        // connectionId: "unique id", // not specifying id will generate a random one
        multiParty: false
      }
    });
    qrcode.generate(connection.invitationUrl, {small: true});
    console.log("Invitation:", connection.invitationUrl);
    console.log("Scan the QR Code with your mobile wallet or visit the URI above to connect and continue...");
    await waitForConnection(connection);
    console.log('\t✓ Alice Connected with ACME Corp');

    console.log("\n####### ACME CORP SENDS ALICE A JOB APPLICATION #######");
    let verificationIdObject = await client.createVerification({
      verificationParameters: {
        verificationDefinitionId: verificationDefinition.id,
        connectionId: connection.connectionId
      }
    });
    console.log("\t✓ Created a Job Application for Alice with id:", verificationIdObject.id);
    let verification = await client.getVerification(verificationIdObject.id);
    console.log(`\t✓ Verification State: ${verification.state}`);
    console.log(verification);
    console.log("\t Open Wallet to Accept Verification Request");
    await waitForVerification(verification);
    console.log("\t✓ Job Application Accepted.");

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
const waitForVerification = async (verification) => {
  try {
    while (verification.state != 'Accepted') {
      verification = await client.getVerification(verification.verificationId);
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
  run: run
}
