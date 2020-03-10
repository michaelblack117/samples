const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

// const client = new AgencyServiceClient(new Credentials("<access token>", "<subscription key>"));
const client = new AgencyServiceClient(new Credentials("37bfeee3edebf2818aa44fda842530ad7bf060ea34261376028e59947b6de4f1", "ecfdc8b9ba9045bca3589279ac5b86c0"));


/******************************* ORGANIZATIONS *******************************/
const listOrganizations = async () => {
  try {
    var organizations = await client.listTenants();
    return organizations;
  }
  catch (e) {
    console.error(e);
  }
}

/******************************* CONNECTIONS *******************************/
const createConnection = async () => {
  try {
    // Generate Connection Invitation
    const connection = await client.createConnection({
        connectionInvitationParameters: {
            // connectionId: "unique id", // not specifying id will generate a random one
            multiParty: false
        }
    });
    return connection
  }
  catch (e) {
    console.error(e);
  }
}

const listConnections = async () => {
  try {
    let connections = await client.listConnections();
    return connections;
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

const deleteConnection = async (id) => {
  try {
    let result = await client.deleteConnection(id);
    return result;
  }
  catch (e) {
    console.error(e);
  }
}

/******************************* CREDENTIALS *******************************/
const getSchemas = async () => {
  try {
    let schemas = await client.listSchemas();
    return schemas;
  }
  catch (e) {
    console.error(e);
  }
}

const createCredentialDefinition = async (schemaId, revokable = false, tag = 'Default') => {
  if (schemaId === null) { throw new Error("please provide schema ID") }
  try {
    // Create Credential Definition With Schema Id
    const credentialDefinition = await client.createCredentialDefinitionForSchemaId(schemaId, {
        credentialDefinitionFromSchemaParameters: {
            supportRevocation: revokable,
            tag: tag // unique identifier
        }
    });

    return credentialDefinition;
  }
  catch (e) {
    console.error(e);
  }
}

const listCredentialDefinitions = async () => {
  try {
    let credentialDefinitions = await client.listCredentialDefinitions();
    return credentialDefinitions;
  }
  catch (e) {
    console.error(e);
  }
}

const getCredentialDefinition = async (id) => {
  try {
    let credentialDefinition = await client.getCredentialDefinition(id);
    return credentialDefinition;
  }
  catch (e) {
    console.error(e);
  }
}

const createCredential = async (credentialDefinitionId, connectionId) => {
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

const listCredentials = async () => {
  try {
    const credentials = await client.listCredentials();
    return credentials
  }
  catch (e) {
    console.error(e);
  }
}

const getCredential = async (id) => {
  try {
    // The potential credential states are:
    // 'Offered' | 'Requested' | 'Issued' | 'Rejected' | 'Revoked'
    let credential = await client.getCredential(id);
    return credential;
  }
  catch (e) {
    console.error(e);
  }
}

const issueCredential = async (credential) => {
  try {
    if (credential.state === 'Requested') {
      let credential = await client.issueCredential(id);
      return credential;
    }
  }
  catch (e) {
    console.error(e);
  }
}

const revokeCredential = async (id) => {
  try {
    let result = await client.revokeCredential(id);
    return result;
  }
  catch (e) {
    console.error(e);
  }
}

/******************************* VERIFICATIONS  *******************************/
const createVerificationDefinition = async (proofRequest, requestedPredicates) => {
  try {
    let definition = await client.createVerificationDefinition({
      proofRequest: proofRequest,
      // proofRequest: {
      //   name: "Proof of Employment",
      //   version: "1.0",
      //   requestedAttributes: {
      //     "Verify Name": {
      //       name: "Name",
      //       restrictions: [
      //         {
      //           schemaId: credential.schemaId
      //         },
      //         {
      //           credDefId: credential.credentialId
      //         },
      //         {
      //           issuerDid: credential.issuerDid
      //         }
      //       ]
      //     }
      //   },
      requestedPredicates: requestedPredicates,
      // requestedPredicates: {
      //   "Over Age": {
      //     pType: ">=",
      //     pValue: "21",
      //     name: "Age",
      //     restrictions: [
      //       {
      //         schemaId: credential.schemaId
      //       }
      //     ]
      //   }
      // }
    });
    return definition;
  }
  catch (e) {

  }
}

const listVerificationDefinitions = async () => {
  try {
    let definitions = await client.listVerificationDefinitions();
    return definitions;
  }
  catch (e) {
    console.error(e);
  }
}

const getVerificationDefinition = async (id) => {
  try {
    let definition = await client.getVerificationDefinition(id);
    return definition;
  }
  catch (e) {
    console.error(e);
  }
}

const createVerification = async (verDefId, connId) => {
  try {
    // connId should be in a state of connected in order to receive the verification
    let verificationId = await client.createVerification(verDefId, connId);
    return verificationId;
  }
  catch (e) {
    console.error(e);
  }
}

const listVerificationsForConnection = async (connectionId) => {
  try {
    let verifications = await client.listVerificationsForConnection(connectionId);
    return verifications;
  }
  catch (e) {
    console.error(e);
  }
}

const getVerification = async (id) => {
  try {
    let verification = await client.getVerification(id);
    return verification;
  }
  catch (e) {
    console.error(e);
  }
}

const verifyVerification = async (id) => {
  try {
    let verification = await client.verifyVerification(id);
    return verification;
  }
  catch (e) {
    console.error(e);
  }
}

async function main() {
  try {
    let result = await listCredentials();
    console.log(result);
  }
  catch (e) {
    console.error(e);
  }
}

// main();

module.exports = {
  listOrganizations,
  createConnection,
  listConnections,
  getConnection,
  deleteConnection,
  getSchemas,
  createCredentialDefinition,
  listCredentialDefinitions,
  getCredentialDefinition,
  createCredential,
  listCredentials,
  getCredential,
  issueCredential,
  revokeCredential,
  createVerificationDefinition,
  listVerificationDefinitions,
  getVerificationDefinition,
  createVerification,
  listVerificationsForConnection,
  getVerification,
  verifyVerification
}
