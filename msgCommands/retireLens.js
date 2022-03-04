module.exports = {
  name: 'retireLens',
  description: 'User runs this command when they throw out a lens or a pair. Changes activeLeft or activeRight values, or both.',
  async execute(receivedMessage, args, doc) {
    //get sheets
    await doc.loadInfo(); // loads document properties and worksheets
    const overviewSheet = doc.sheetsByIndex[0];
    await overviewSheet.loadCells(`A2:E2`);

    //get targetSide
    let targetSide = getTargetSide(args);
    if (!targetSide) {
      return receivedMessage.channel.send("Target side must be \"left\" or \"right\". Don't include a target side in the command if it is both.");
    }

    //get targetCell(s)
    let leftCell = overviewSheet.getCellByA1(`A2`);
    let rightCell = overviewSheet.getCellByA1(`B2`);

    //update cells
    if (targetSide == "both") {
      leftCell.value++; 
      rightCell.value++;
    } else if (targetSide == "left") {
      leftCell.value++;
    } else {
      rightCell.value++;
    }
    await overviewSheet.saveUpdatedCells();

    //send user confirmation message
    receivedMessage.react('👍');
  }
}

function getTargetSide(args) {
  if (args.length > 0) {
    if (args[0] == "left" || args[0] == "l")
      targetSide = "left";
    else if (args[0] == "right" || args[0] == "r")
      targetSide = "right";
    else
      targetSide = null;
  } else {
    targetSide = "both"
  }
  return targetSide;
}