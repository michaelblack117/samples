const assert = require('chai').assert;
const sample = require('./index');

describe('Testing Organization Functions', function() {
  it('List the organizations', async () => {
    let orgs = await sample.listOrganizations();
    assert.isArray(orgs);
  })
})

describe('Testing Connection Functions', function() {
  it('Generate an Invitation to Connect', async () => {
    let invitation = await sample.createConnection();
    assert.isObject(invitation);
    assert.equal(invitation.state, "Invited");
  })

  it('Retrieve Connection', async () => {
    let invitation = await sample.createConnection();
    let connection = await sample.getConnection(invitation.connectionId);
    assert.equal(invitation.connectionId, connection.connectionId);
  })

  it('Delete Connection', async () => {
    let connection = await sample.createConnection();
    let result = await sample.deleteConnection(connection.connectionId);
    assert.isObject(result);

  })
})

describe('Testing Credential Functions', function() {
  it('List Schema Definitions', async () => {
    let schemas = await sample.getSchemas();
    assert.isArray(schemas);
  })

  it('List Credential Definitions', async () => {
    let definitions = await sample.listCredentialDefinitions();
    assert.isArray(definitions);
  })

  it('List Credentials', async () => {
    let credentials = await sample.listCredentials();
    assert.isArray(credentials);
  })
})

describe('Testing Verification Functions', function() {
  it('List Verification Definitions', async () => {
    let definitions = await sample.listVerificationDefinitions();
    assert.isArray(definitions);
  })
})
