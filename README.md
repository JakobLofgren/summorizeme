# summorizeme

A twitter bot for summorizing articles.

## Usage

If you want to run this bot, you need to set process.env variables.
The bot depends on these settings:

| process.env.X       | expected values                        |
|---------------------|----------------------------------------|
| consumer_key        | twitter consumer key                   |
| consumer_secret     | twitter consumer secret                |
| access_token_key    | twitter access token key               |
| access_token_secret | twitter access token secret            |
| SMMRY_access_token  | [SMMRY](http://smmry.com) access token |


## How it works

Somebody tweets at the bot with an article. (Currently just supporting one article per tweet!)

The bot posts a link to SMMRY to summorize the article, takes the returned text and generates a picture containing the text.

The bot then uploads the picture to twitter and responds to the tweet with said picture.


# What I learned:

Building "bots" is suprisingly easy, with the easy to plug in modules there are. Along with cool API's such as SMMRY.

I also ran into one a problem I've never run into before. Storing numbers larger than whatever the limit is. 
I originally stored my own ID in a variable and checked if tweets tweeted @ the bot were it's own tweets. Unfortunately the large number didn't work and it spammed itself with several messages before I noticed. Luckily, Twitter also sends out id_str for lazy people like me.