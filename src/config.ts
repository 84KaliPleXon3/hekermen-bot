'use strict'

const dotenv = require('dotenv')
dotenv.config()

export default {
  botOptions: {
    prefix: '!ak47'
  },
  key: {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    SHODAN_TOKEN: process.env.SHODAN_TOKEN
  }
}