// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { BaseInstallAction } from './BaseInstallAction';
import { IInstallManagerOptions } from '../../logic/base/BaseInstallManager';
import { RushCommandLineParser } from '../RushCommandLineParser';
import { SelectionParameterSet } from '../SelectionParameterSet';

export class InstallAction extends BaseInstallAction {
  public constructor(parser: RushCommandLineParser) {
    super({
      actionName: 'install',
      summary: 'Install package dependencies for all projects in the repo according to the shrinkwrap file',
      documentation:
        'The "rush install" command installs package dependencies for all your projects,' +
        ' based on the shrinkwrap file that is created/updated using "rush update".' +
        ' (This "shrinkwrap" file stores a central inventory of all dependencies and versions' +
        ' for projects in your repo. It is found in the "common/config/rush" folder.)' +
        ' If the shrinkwrap file is missing or outdated (e.g. because project package.json files have' +
        ' changed), "rush install" will fail and tell you to run "rush update" instead.' +
        ' This read-only nature is the main feature:  Continuous integration builds should use' +
        ' "rush install" instead of "rush update" to catch developers who forgot to commit their' +
        ' shrinkwrap changes.  Cautious people can also use "rush install" if they want to avoid' +
        ' accidentally updating their shrinkwrap file.',
      parser
    });
  }

  /**
   * @override
   */
  protected onDefineParameters(): void {
    super.onDefineParameters();

    this._selectionParameters = new SelectionParameterSet(this.rushConfiguration, this);
  }

  protected buildInstallOptions(): IInstallManagerOptions {
    return {
      debug: this.parser.isDebug,
      allowShrinkwrapUpdates: false,
      bypassPolicy: this._bypassPolicyParameter.value!,
      noLink: this._noLinkParameter.value!,
      fullUpgrade: false,
      recheckShrinkwrap: false,
      networkConcurrency: this._networkConcurrencyParameter.value,
      collectLogFile: this._debugPackageManagerParameter.value!,
      variant: this._variant.value,
      // Because the 'defaultValue' option on the _maxInstallAttempts parameter is set,
      // it is safe to assume that the value is not null
      maxInstallAttempts: this._maxInstallAttempts.value!,
      // These are derived independently of the selection for command line brevity
      pnpmFilterArguments: this._selectionParameters!.getPnpmFilterArguments()
    };
  }
}
