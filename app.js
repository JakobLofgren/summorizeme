require("dotenv").config()

const Twitter = require("twitter")
,	winston = require("winston")
,	fs = require("fs")
,	helpers = require("./helpers")
,	summorizePage = helpers.summorizePage
,	generatePicture = helpers.generatePicture
,	readFileAsync = helpers.readFileAsync
,	T = new Twitter({
		consumer_key: process.env.consumer_key,
		consumer_secret: process.env.consumer_secret,
		access_token_key: process.env.access_token_key,
		access_token_secret: process.env.access_token_secret
})

winston.level = "debug"
winston.add(winston.transports.File, { filename: "logs.txt" })

let pics = []

T.stream("user", (stream) => {
	stream.on("data", (event) => {
		winston.debug(event)
		if(event.entities.urls.length && event.entities.urls.length < 2){
			summorizePage(event.entities.urls[0].expanded_url)
			.then(result => generatePicture(result, event.id_str))
			.then(generatedPicture => readFileAsync(generatedPicture))
			.then(fileBuffer => T.post("media/upload", {media: fileBuffer}))
			.then(media => T.post("statuses/update", {
				status: `Hey @${event.user.screen_name}, here's your summorized pic 🤞 \n \n Remember to follow @summorizeme`,
				in_reply_to_status_id: event.id_str,
				media_ids: media.media_id_string
			}))
			.then(() => T.post("favorites/create", {
				id: event.id_str
			}))
			.then(() => {
				pics.push(event.id_str)
				console.log("Pics=", pics)
				if(pics.length > 10){
					pics.map((c, i) => {
						if(i > 10){
							fs.unlinkSync(`${c}.jpg`)
						}
					})
				}
			})
			.catch(err => winston.error(err, JSON.stringify(err, null, 2)))
		} 
		else if(event.entities.urls.length && event.entities.urls.length > 1){
			T.post("statuses/update", {
				status: `Hey @${event.user.screen_name}, I can only do 1 link per tweet. Sorry 😕 \n \n @summorizeme`,
				in_reply_to_status_id: event.id_str
			})
			.then(() => T.post("favorites/create", {
				id: event.id_str
			}))
		} else {
			if(event.user.id_str === "816221605282062336") return 
			else {
				T.post("statuses/update", {
					status: `Hey @${event.user.screen_name}, it seems you broke the rules. Read how it works here [LINK]`,
					in_reply_to_status_id: event.id_str
				})
				.then(() => T.post("favorites/create", {
					id: event.id_str
				}))
			}
		}
	})

	stream.on("error", (error) => {
		winston.error(`Stream error: ${error}, stringified: ${JSON.stringify(error, null, 2)}`)
		process.exit(1)
	})
})
