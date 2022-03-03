//imports
const moment = require('moment-timezone');
const getLensOn = require('../utility/getLensOn');

module.exports = {
  name: 'wearLens',
  description: 'User runs this command when they wear a pair of lens. Documents the action and time of action. Does nothing is user is already wearing lens',
  async execute(receivedMessage, doc) {
    //get sheets
    await doc.loadInfo(); // loads document properties and worksheets
    const overviewSheet = doc.sheetsByIndex[0];
    await overviewSheet.loadCells(`A2:E2`);
    const dailySheet = doc.sheetsByIndex[1];

    //check if lens are alreay on
    if (getLensOn(overviewSheet)) {
      return receivedMessage.channel.send('Your lens are already on.')
    }

    //create and enter info
    const [activeLeft, activeRight] = getActiveLens(overviewSheet);
    const entry = createEntry(activeLeft, activeRight);
    await dailySheet.addRow(entry);

    //update lensOn value
    overviewSheet.getCellByA1('C2').value = true;
    await overviewSheet.saveUpdatedCells();

    //send user confirmation message
    receivedMessage.react('👍');
  }
}

function getActiveLens(overviewSheet) {
  let activeLeft, activeRight;
  activeLeft = overviewSheet.getCellByA1(`A2`).value;
  activeRight = overviewSheet.getCellByA1(`B2`).value;
  return [activeLeft, activeRight];
}

function createEntry(left, right) {
  let date = moment().tz("America/New_York").format('l');
  let time = moment().tz("America/New_York").format('LT');
  const now = new Date();
  const entry = {
    Date: date,
    lensNumLeft: left,
    lensNumRight: right,
    startTime: time
  }
  return entry;
}