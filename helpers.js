const axios = require("axios")
,	Jimp = require("jimp")
,	fs = require("fs")

function summorizePage ( page ) {
	return axios.post(`http://api.smmry.com/&SM_API_KEY=${process.env.SMMRY_access_token}&SM_URL=${page}`)
		.then(result => result.data.sm_api_content)
		.catch(err => new Error(err))
}

function generatePicture ( text,id ) {
	return new Promise(( resolve, reject ) => {
		new Jimp(1200, 1200, 0xffffffff, ( err, img ) => {
			if(err){
				return reject( err )
			}
			Jimp.loadFont( Jimp.FONT_SANS_32_BLACK )
			.then( font => {
				img
					.print( font, 10, 10, text, 1200 )
					.quality( 60 )
					.write( `${id}.jpg` )
				resolve(`${id}.jpg`)
			})
			.catch( err => {
				reject( err )
			})
		})
	})
}

function readFileAsync(file){
	return new Promise((resolve,reject) => {
		fs.readFile(file, (err, img) => {
			if(err) reject(err)
			resolve(img)
		})
	})
}

module.exports = {
	summorizePage,
	generatePicture,
	readFileAsync
}