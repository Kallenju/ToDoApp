/* eslint-disable import/prefer-default-export */

class HTTPError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HTTPError';
    this.response = response;
  }
}

export { HTTPError };
