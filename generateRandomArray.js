function generateRandomArray(length){
    const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random()*10000));
  }

  return arr;
}

module.exports = generateRandomArray;