import * as unirest from 'unirest'
export default {
  namespaced: true,
  state: {
      userEmail: 'mickmickasis123@gmail.com',
      ApiToken: 'zCmK6wZeoKaF-W0ys_zOwCwMCV2E_fkzXWrLicGFeNoFROpN674pDoPLPmBSUYcznIk',
      authToken: '',
      countryList: [],
      cityList: [],
      regionList: [],
  },
  mutations: {
  },
  actions: {
   async getCountryApi ({state, commit}: any) {
    const headers = {
        "Accept": "application/json",
        "api-token": state.ApiToken,
        "user-email": state.userEmail
    }
    await fetch("https://www.universal-tutorial.com/api/getaccesstoken", { headers })
      .then(response => response.json())
      .then(data => {
          state.authToken = data.auth_token
      });
    },
    async getCountries ({state, commit}: any) {
        const headers = {
            "Authorization": "Bearer "+ state.authToken,
            "Accept": "application/json"
        }
        await fetch("https://www.universal-tutorial.com/api/countries", { headers })
          .then(response => response.json())
          .then(data => {
              state.countryList = data
          });
    },
    async getRegion ({state, commit}: any, payload: any) {
        const headers = {
            "Authorization": "Bearer "+ state.authToken,
            "Accept": "application/json"
        }
        await fetch("https://www.universal-tutorial.com/api/states/"+ payload.country, { headers })
          .then(response => response.json())
          .then(data => {
              state.regionList = data
          });
    },
    async getCities ({state, commit}: any, payload: any) {
        console.log(payload.region)
        const headers = {
            "Authorization": "Bearer "+ state.authToken,
            "Accept": "application/json"
        }
        await fetch("https://www.universal-tutorial.com/api/cities/"+ payload.region, { headers })
          .then(response => response.json())
          .then(data => {
              state.cityList = data
          });
    }
  },
  getters: {
  },
};
