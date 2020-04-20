'use strict'

import { Message, Client } from 'discord.js'
import { chunk } from 'lodash'
const { search } = require('shodan-client')

import { BaseCommands } from '../types/commands.base'
import config from './../config'

export default class Shodan implements BaseCommands {
  // Command properties
  readonly name: string = 'Shodan'
  readonly command: string = 'shodan'
  readonly description: string = 'Shodan Search API'

  private client: Client
  constructor (client: Client) {
    this.client = client
  }

  async run (message: Message, args: Array<string>) {
    const title = `**${this.name}** - *${this.description}*`
    const commandPrefix = `${config.botOptions.prefix} ${this.command}`

    // Stop function execution if empty arguments
    // Send usage example command
    const isArgsEmpty = args.length < 1
    if (isArgsEmpty) {
      let helpMessage = `${title}\n`
      helpMessage += `usage: \`${commandPrefix} (page:default=1) [query...]\`\n`
      helpMessage += `example: \`${commandPrefix} laravel port:8080\`\nor\n`
      helpMessage += `\`${commandPrefix} page=2 laravel port:8080\`\n`
      message.channel.send(helpMessage)
      return
    }

    // Paging logic
    // Check if args[0] is page, else join all args
    let page = '1'
    let query = args.join(" ")
    const isPaging = args[0].match(/(?<=page=).*?(?= |$)/)
    if (isPaging) {
      page = isPaging[0]
      query = args.slice(1).join(" ")
    }

    // Calling Shodan API
    let response
    try {
      response = await search(query, config.key.SHODAN_TOKEN, { page })
    } catch (err) {
      message.channel.send(`Sorry, Error cuk!`)
      return
    }

    // Set header and footer
    let header = `Reply for ${message.author.username}\n` 
    header += `Parameter: page=${page} query="${query}"\n---\n\n`
    let footer = `\n\n---\nPage: ${page}, `
    footer += `Result: ${response.matches.length}, `
    footer += `Total: ${response.total}`

    // check if response empty
    // then send empty message reply
    if (response.matches < 1) {
      message.channel.send(header + "Empty ...", { code: 'asciidoc' })
      return
    }

    // chunk request per 50 ip
    let responseChunk: Array<any> = chunk(response.matches, 50)
    responseChunk.forEach((chunk, index) => {
      let itemJoined = chunk
        .map((item: any) => `${item.ip_str}:${item.port}`)
        .join('\n')
      const isFirst = index === 0
      const isLast = (index+1) >= responseChunk.length
      if (isFirst) itemJoined = header + itemJoined
      if (isLast) itemJoined = itemJoined + footer 
      message.channel.send(itemJoined, { code: 'asciidoc' })
    })
  }
}
