const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const quickSort = require('./quickSort');
const splitArray = require('./splitArr');
const generateRandomArray = require('./generateRandomArray');

function sortWithThreads(array, numThreads) {
  if (isMainThread) {
    const chunks = splitArray(array, numThreads);
    const workerPromises = chunks.map((chunk) =>
      new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: chunk,
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      })
    );

    return Promise.all(workerPromises).then((results) => {
      const sortedArray = results.flat();
      return quickSort(sortedArray);
    });
  } else {
    const chunk = workerData;
    const sortedChunk = quickSort(chunk);
    parentPort.postMessage(sortedChunk);
  }
}

const arrayLength = 1000; 
const numThreads = 8;
const array = generateRandomArray(arrayLength);

const run = async (array, numThreads) => {
  const start = performance.now();
  await sortWithThreads(array, numThreads)
  .then((sortedArray) => {
    console.log(sortedArray);
    const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
  })
  .catch((error) => {
    console.error(error);
  });
}

run(array, numThreads);