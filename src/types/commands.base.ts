'use strict'

import { Message, Client } from 'discord.js'

export interface BaseCommandsConstructor {
  new (client: Client) : BaseCommands
}

export interface BaseCommands {
  readonly name: string
  readonly description: string
  readonly command: string
  run (message: Message, arg: Array<string>) : void
}

export function createCommand (
  ctor: BaseCommandsConstructor, client: Client
  ) : BaseCommands {
    return new ctor(client)
}