class KnexAbortError extends Error {
  constructor(message) {
    super(message);
    this.name = 'KnexAbortError';
  }
}

function abortOnSignal(promise, abortSignal) {
  return new Promise(function (resolve, reject) {
    function onAbort() {
      reject(new KnexAbortError('abort signal fired'));
    }
    if (abortSignal.aborted) {
      onAbort();
      return;
    }
    abortSignal.addEventListener('abort', onAbort);

    function wrappedResolve(value) {
      abortSignal.removeEventListener('abort', onAbort);
      resolve(value);
    }

    function wrappedReject(err) {
      abortSignal.removeEventListener('abort', onAbort);
      reject(err);
    }

    promise.then(wrappedResolve, wrappedReject);
  });
}

module.exports.KnexAbortError = KnexAbortError;
module.exports.abortOnSignal = abortOnSignal;
