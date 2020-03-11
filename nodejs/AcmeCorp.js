var qrcode = require('qrcode-terminal');
const FaberCollege = require('./FaberCollege');
const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

const client = new AgencyServiceClient(new Credentials(
  "pGtYaJIopuMMYh2PFsNE3oafUTYxjg743_ToPSyoHS8", // access token
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
        body: {
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
        body: {
          supportRevocation: false,
          tag: "Default"
        }
      });

    console.log("\n####### ACME CORP CREATES JOB APPLICATION FORM #######");
    let transcriptSchema = await FaberCollege.getTranscriptSchema();
    let verificationDefinitions = await client.listVerificationDefinitions();
    let verificationDefinition = verificationDefinitions.find(x => x.name === "Job Application");
    if (verificationDefinition === undefined) {
      console.log("\tCreating ACME Job Application Definition");
      verificationDefinition = await client.createVerificationDefinition({
        body: {
          name: "Job Application",
          version: "1.0",
          requestedAttributes: {
            "Verify First Name": {
              name: "First Name",
              restrictions: [
                {
                  schemaId: transcriptSchema.id
                },
                // {
                //   credDefId: credential.credentialId
                // },
                // {
                //   issuerDid: credential.issuerDid
                // }
              ]
            },
            "Verify Last Name": {
              name: "Last Name",
              restrictions: [ { schemaId: transcriptSchema.id } ]
            },
            "Verify Degree": {
              name: "Degree",
              restrictions: [ { schemaId: transcriptSchema.id } ]
            },
            "Verify GPA": {
              name: "GPA",
              restrictions: [ { schemaId: transcriptSchema.id } ]
            }

          },
          requestedPredicates: {
          "Good GPA": {
            pType: ">=",
            pValue: "3.0",
            name: "GPA",
            restrictions: [
              {
                schemaId: transcriptSchema.id
              }
            ]
          }
        }
        }
      });
    }
    else {
      console.log('\t✓ ACME Job Application Definition Found');
    }

    console.log("\n####### ACME INVITES ALICE TO CONNECT #######");
    let connection = await client.createConnection({
      body: {
        // connectionId: "unique id", // not specifying id will generate a random one
        multiParty: false
      }
    });
    qrcode.generate(connection.invitationUrl, {small: true});
    console.log("Scan the QR Code with your mobile wallet to connect and continue...");
    await waitForConnection(connection);
    console.log('\t✓ Alice Connected with ACME Corp');

    console.log("\n####### ACME CORP SENDS ALICE A JOB APPLICATION #######");
    let verificationId = await client.createVerification(verificationDefinition.id, connection.connectionId);
    console.log("\t✓ Sent Alice a Job Application with id:", verificationId);
    let verification = await client.getVerification(verificationId);
    console.log(verification);
    }
    else {
      console.log('\t✓ Employee Certificate Definition Found');
    }

    console.log("\n####### ACME CORP CREATES JOB APPLICATION FORM #######");
    let transcriptSchema = FaberCollege.getTranscriptSchema();
    if (transcriptSchema) { console.log("\t✓ Retrieved Transcript Schema from Faber College"); }
    let verificationDefinitions = await client.listVerificationDefinitions();
    let verificationDefinition = verificationDefinitions.find(x => x.name === "Job Application");
    if (verificationDefinition === undefined) {
      console.log("\tCreating ACME Job Application Definition...");
      verificationDefinition = await client.createVerificationDefinition({
        body: {
          name: "Job Application",
          version: "1.0",
          requestedAttributes: {
            "First Name": {
              name: "First Name",
              restrictions: [
                {
                  schemaId: transcriptSchema.id
                },
                // {
                //   credDefId: credential.credentialId
                // },
                // {
                //   issuerDid: credential.issuerDid
                // }
              ]
            },
            "Last Name": {
              name: "Last Name",
              restrictions: [ { schemaId: transcriptSchema.id } ]
            },
            "Degree": {
              name: "Degree",
              restrictions: [ { schemaId: transcriptSchema.id } ]
            },
            "GPA": {
              name: "GPA",
              restrictions: [ { schemaId: transcriptSchema.id } ]
            }

          },
          requestedPredicates: {
            "GPA": {
              pType: ">=",
              pValue: "3.0",
              name: "GPA",
              restrictions: [ { schemaId: transcriptSchema.id } ]
          }
        }
        }
      });
    }
    else {
      console.log('\t✓ ACME Job Application Definition Found');
    }

    console.log("\n####### ACME CORP INVITES ALICE TO CONNECT #######");
    let connection = await client.createConnection({
      body: {
        // connectionId: "unique id", // not specifying id will generate a random one
        multiParty: false
      }
    });
    qrcode.generate(connection.invitationUrl, {small: true});
    console.log("Scan the QR Code with your mobile wallet to connect and continue...");
    await waitForConnection(connection);
    console.log('\t✓ Alice Connected with ACME Corp');

    console.log("\n####### ACME CORP SENDS ALICE A JOB APPLICATION #######");
    let verificationId = await client.createVerification(verificationDefinition.id, connection.connectionId);
    console.log("\t✓ Sent Alice a Job Application with id:", verificationId);
    let verification = await client.getVerification(verificationId);
    console.log(verification);
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
  run: run
}
