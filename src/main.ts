const requestPromise = require('request-promise');
const requestOptions = require('./configs/requestOption').requestOptions;

init();

function init(): void {
  sendRequest();
}

function sendRequest(): string | boolean {
  return requestPromise(requestOptions)
    .then((response: Response) => {
      console.log('request resolve');
      console.log(`
      offerCount: ${response.data.offerCount}
      offersSerialized: ${response.data.offersSerialized.length}
      `);
    })
    .catch(() => {
      console.log('request rejected');
    });
}
