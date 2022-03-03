//imports
const date = require('date-and-time');
const getLensOn = require('../utility/getLensOn')

module.exports = {
  name: 'removeLens',
  description: 'User runs this command when they remove a pair of lens. Documents time lens were taken off and total time worn. Does nothing if lens were already off.',
  async execute(receivedMessage, doc) {
    //get sheets
    await doc.loadInfo(); // loads document properties and worksheets
    const overviewSheet = doc.sheetsByIndex[0];
    await overviewSheet.loadCells(`A2:E2`);
    const dailySheet = doc.sheetsByIndex[1];

    //check if lens are already off
    if (!getLensOn(overviewSheet)) {
      return receivedMessage.channel.send('Your lens are already off.')
    }

    //get targetCells
    let rows = await dailySheet.getRows();
    let rowNum = rows.length + 1;
    let endTimeCell = await getCell(dailySheet, "E", rowNum);
    let totalTimeCell = await getCell(dailySheet, "F", rowNum);
    
    //update row values
    const now = new Date();
    endTimeCell.value = date.format(now, 'H:mm');
    totalTimeCell.formula = `=E${rowNum} - D${rowNum}`
    await dailySheet.saveUpdatedCells();
    
    //update lensOn value
    overviewSheet.getCellByA1('C2').value = false;
    await overviewSheet.saveUpdatedCells();

    //send user confirmation message
    receivedMessage.react('👍');
  }
}

async function getRow(sheet) {
  let rows = await sheet.getRows();
  return rows[rows.length - 1];
}

async function getCell(sheet, colNum, rowNum) {
  await sheet.loadCells(`${colNum}${rowNum}:${colNum}${rowNum}`);
  cell = sheet.getCellByA1(`${colNum}${rowNum}`);
  return cell;
}