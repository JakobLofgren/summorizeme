# summorizeme

A twitter bot for summorizing articles. Using [Twitter](https://www.npmjs.com/package/twitter) and [SMMRY](http://smmry.com).

## Usage

If you want to run this bot, you need to set process.env variables.
I use [dotenv](https://www.npmjs.com/package/dotenv), but pick your poision.
The bot depends on these settings:

| process.env.X       | expected values                        |
|---------------------|----------------------------------------|
| consumer_key        | twitter consumer key                   |
| consumer_secret     | twitter consumer secret                |
| access_token_key    | twitter access token key               |
| access_token_secret | twitter access token secret            |
| SMMRY_access_token  | [SMMRY](http://smmry.com) access token |


## How it works

1. Person tweets @ the bot, bot sends the article to SMMRY API
2. SMMRY returns a summorized version, bot chucks it as text onto an image it created via [Jimp](https://www.npmjs.com/package/jimp)
3. Bot uploads image to Twitter, then tweets back with image and likes the original tweet.

# Side note:

### What I learned:

1. Building bots is very easy, when other people have already done the hard work. I just fused the wires togheter.

2. I ran into the too big number - problem, JavaScript has. Luckily, Twitter provides strings for large numbers.

3. Documentation can really screw you over. I got an error code from Twitter's API that the documentation said meant: "Suspended". Luckily, I did not get suspended and they had just made an routing error.


