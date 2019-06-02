class ApiClient {
  constructor() {
    this.basePath = `http://localhost:4000`;

    this.defaultOpts = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  async callApi(path, httpMethod = 'GET', bodyParams = undefined) {
    const opts = Object.assign({}, this.defaultOpts, {
      method: httpMethod
    });

    if (bodyParams) {
      Object.assign(opts, {
        body: JSON.stringify(bodyParams)
      });
    }

    return await fetch(`${this.basePath}${path}`, opts);
  }

  async createBilling(params) {
    return await this.callApi('/billings', 'POST', params);
  }

  async fetchGames() {
    return await this.callApi('/games', 'GET');
  }

  async fetchBillings() {
    return await this.callApi('/billings', 'GET');
  }
}

ApiClient.instance = new ApiClient();
export default ApiClient;
