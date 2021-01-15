const axios = require("axios");

axios.get("https://axh6ghu8zb.execute-api.ap-northeast-1.amazonaws.com/dev")
    .then(res => {
    	console.log(res.data)
    })
    .catch(err => {
    	console.log(err)
    })