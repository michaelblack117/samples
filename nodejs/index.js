const FaberCollege = require('./FaberCollege');
const AcmeCorp = require('./AcmeCorp');

function main() {
  try {
    // FaberCollege.run();
    AcmeCorp.run();
  }
  catch (e) {
    console.error(e);
    return;
  }
}

main();
