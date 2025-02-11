// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { Terminal } from '@rushstack/node-core-library';

import { IScopedLogger } from '@rushstack/heft';
import {
  ISubprocessRunnerBaseConfiguration,
  SubprocessRunnerBase
} from '@rushstack/heft/lib/utilities/subprocess/SubprocessRunnerBase';

export interface IStorybookRunnerConfiguration extends ISubprocessRunnerBaseConfiguration {
  resolvedStartupModulePath: string;
}

// TODO: Why must this be a different name from the logger in StorybookPlugin.ts?
const TASK_NAME: string = 'heft-storybook-runnner';

export class StorybookRunner extends SubprocessRunnerBase<IStorybookRunnerConfiguration> {
  private _logger!: IScopedLogger;
  private _terminal!: Terminal;

  public get filename(): string {
    return __filename;
  }

  public async invokeAsync(): Promise<void> {
    this._logger = await this.requestScopedLoggerAsync(TASK_NAME);
    this._terminal = this._logger.terminal;

    this._terminal.writeLine('Launching ' + this._configuration.resolvedStartupModulePath);

    require(this._configuration.resolvedStartupModulePath);

    this._terminal.writeVerboseLine('Completed synchronous portion of launching startupModulePath');
  }
}
