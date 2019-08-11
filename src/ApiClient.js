class ApiClient {
  constructor() {
    this.basePath = `http://localhost:4000`;

    this.token = undefined;

    this.defaultOpts = {
      method: 'GET'
    };

    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  async callApi(path, httpMethod = 'GET', bodyParams = undefined) {
    const headers = Object.assign({}, this.defaultHeaders, {
      Authorization: this.token
    });

    const opts = Object.assign({}, this.defaultOpts, {
      method: httpMethod,
      headers: headers
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

  async deleteBilling(id) {
    return await this.callApi(`/billings/${id}`, 'DELETE');
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
