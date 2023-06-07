function splitArray(array, numThreads) {
    const chunkSize = array.length/numThreads;
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
}

module.exports = splitArray;