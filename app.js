require("dotenv").config()

const Twitter = require("twitter")
,	fs = require("fs")
,	winston = require("winston")
,	helpers = require("./helpers")
,	summorizePage = helpers.summorizePage
,	generatePicture = helpers.generatePicture
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
				.then(result => generatePicture(result, event.id))
				.then(() => T.post("media/create", {
					media: fs.readFileSync(`${__dirname}/${event.id}.jpg`)
				}))
				.then(media => T.post("statuses/update", {
					status: `Hey @${event.user.screen_name}, here's your summorized pic. :) \n \n Remember to follow @summorizeme`,
					in_reply_to_status_id: event.id_str,
					media_ids: media.media_id_string
				}))
				.then(() => T.post("favorites/create", {
					id: event.id_str
				}))
				.catch(err => winston.error(err))
		} else {
			if(event.user.id_str === "816221605282062336"){
				return
			} else {
				T.post("statuses/update", {
					status: `Hey @${event.user.screen_name}, it seems you broke the rules. Read how it works here [LINK]`,
					in_reply_to_status_id: event.id
				})
			}
		}
	})
	stream.on("error", (err) => {
		winston.error(err)
		throw new Error(err)
	})
})