require("dotenv").config()

const Twitter = require("twitter")
,	fs = require("fs")
,	axios = require("axios")
,	winston = require("winston")
,	Jimp = require("jimp")
,	helpers = require("./helpers")
,	summorizePage = helpers.summorizePage
,	T = new Twitter({
		consumer_key: process.env.consumer_key,
		consumer_secret: process.env.consumer_secret,
		access_token_key: process.env.access_token_key,
		access_token_secret: process.env.access_token_secret
})
winston.level = "debug"
winston.add(winston.transports.File, { filename: "logs.txt" })

T.stream("user", (stream) => {

	stream.on("data", (event) => {
		winston.debug(JSON.stringify(event, null,2))
		if(event.entities.urls.length && event.entities.urls.length < 2){
			summorizePage(event.entities.urls[0].expanded_url)
			.then(result => {
				return new Promise((resolve,reject) => {
					new Jimp(1200, 1200, 0xffffffff, (err, img) => {
						if(err){
							return reject(err)
						}
						Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
						.then(font => {
							img
								.print(font, 10, 10, result, 1200)
								.quality(60)
								.write(`${event.id}.jpg`)
							resolve(`${event.id}.jpg`)
						})
						.catch(err => {
							winston.error(err)
							reject(err)
						})
					})
				})
			})
			// .then(imgName => {
			// 	console.log("imgName=", imgName)
			// 	const imageToUpload = fs.readFileSync(`${__dirname}/${imgName}`)
			// 	T.post("media/upload", { media_data: imageToUpload }, function (err, data) {
			// 		if(err)	return winston.error(err)
			// 		const mediaIdStr = data.media_id_string
			// 		const altText = "A picture with summorized text for the article provided."
			// 		const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
			// 		T.post("media/metadata/create", meta_params, function (err) {
			// 			if (err) return winston.error(err)
			// 			const params = { status: `Hey @${event.user.screen_name}, here's your picture. :) @summorizeme`, media_ids: [mediaIdStr] }
			// 			T.post(`statuses/${event.id}`, params, function (err, data, response) {
			// 				console.log(`err: ${err} data: ${data} response: ${response}`)
			// 			})
			// 		})
			// 	})
			// })
			// .then(imgName => {
			// 	console.log("imgName=", imgName)
			// 	const imageToUpload = fs.readFileSync(`${__dirname}/${imgName}`)
			// 	T.post("media/upload", {media: imageToUpload}, (err,media) => {
			// 		if(err)	return winston.error(err)
			// 		const status = {
			// 			statius: `Hey @${event.user.screen_name}, here's your picture. :) @summorizeme`,
			// 			media_ids: media.media_id_string
			// 		}
			// 		T.post(`statuses/filter${event.id}`, status, (err,tweet) => {
			// 			if(err)	return winston.error(err)
			// 			console.log("Tweet is", tweet)
			// 		})
			// 	})
			// })
			// .then(img => {
			// 	const imageToUpload = fs.readFileSync(`${__dirname}/${img}`)
			// 	T.post("/media/upload", {media: imageToUpload})
			// 		.then(media => T.post("status/filter", {track: }
			// 			`statuses/update, {
			// 			status: `Hey @${event.user.screen_name}, here's your picture. :) @summorizeme`,
			// 			media_ids: media.media_id_string
			// 		}))
			// 		.then(tweet => console.log("Tweet=", tweet))
			// 		.catch(err => winston.error(err))
			// })
			.then(img => {
				const imageToUpload = fs.readFileSync(`${__dirname}/${img}`)
				T.post("/media/upload", {media: imageToUpload})
				.then(media => T.post("statuses/update", {
					status: `Hey @${event.user.screen_name}, here's your picture. :) @summorizeme`,
					in_reply_to_status_id: event.id,
					media_ids: media.media_id_string
				}))
					.then(tweet => console.log("Tweet=", tweet))
					.catch(err => winston.error(err))
			})
			.catch(err => winston.error(err))
		}
	})

	stream.on("error", (err) => {
		winston.error(err)
		throw new Error(err)
	})
})