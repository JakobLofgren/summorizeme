const axios = require("axios")

function summorizePage(page){
	return axios.post(`http://api.smmry.com/&SM_API_KEY=${process.env.SMMRY_access_token}&SM_URL=${page}`)
		.then(result => result.data.sm_api_content)
}

module.exports = {
	summorizePage,
}