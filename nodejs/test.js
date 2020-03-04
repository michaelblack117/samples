const assert = require('chai').assert;
const sample = require('./index');

describe('Testing Sample Functions', function () {
  it('List the organizations', async function () {
    let orgs = sample.getOrganizations();
    assert.isNotNull(orgs);
  })
})
