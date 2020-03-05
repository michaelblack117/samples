const assert = require('chai').assert;
const sample = require('./index');

describe('Testing Sample Functions', function() {
  it('List the organizations', async () => {
    let orgs = await sample.getOrganizations();
    assert.isArray(orgs);
    assert.isNotNull(orgs[0].name);
  })

  it('List Schema Definitions', async () => {
    let schemas = await sample.getSchemas();
    assert.isArray(schemas);
  })

  // TODO fix errors when creating schemas
  //
  // it('Create College Transcript Schema', async () => {
  //   let transcriptSchema = await sample.createTranscriptSchema();
  //   assert.isNotNull(transcriptSchema);
  // })

  // TODO fix errors when creating credential definitions

  it('Generate an Invitation to Connect', async () => {
    let invitation = await sample.createInvitation();
    assert.isObject(invitation);
  })
});
