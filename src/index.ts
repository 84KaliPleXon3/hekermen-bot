'use strict'

import { Client, Message, Collection } from 'discord.js'
import { BaseCommandsConstructor, createCommand, BaseCommands } from './types/commands.base';
import Modules from './commands/index'
import config from './config'

class Ak47Bot extends Client{
  public commands: Collection<string, BaseCommands> = new Collection()
  constructor() {
    super()
  }

  loadCommands (commands: Array<BaseCommandsConstructor>) : void {
    commands.forEach((command) => {
      const cmd = createCommand(command, this)
      this.commands.set(cmd.command, cmd)
      console.log(`${cmd.name} Loaded ...`)
    })
  }
}

const client = new Ak47Bot()
client.loadCommands(Modules)

client.on('message', (message) => {
  const prefix = config.botOptions.prefix
  
  if (message.author.bot) return
  if (message.content.indexOf(prefix) !== 0) return

  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift()!.toLocaleLowerCase()

  const cmd = client.commands.get(command)
  if (!cmd) return

  cmd.run(message, args)
})

client.login(config.key.DISCORD_TOKEN)
