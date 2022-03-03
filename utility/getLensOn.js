function getLensOn(overviewSheet) {
  let lensOn = overviewSheet.getCellByA1(`C2`).value;
  return lensOn;
}

module.exports = getLensOn;