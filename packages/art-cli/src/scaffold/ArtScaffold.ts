import qs from 'qs';
import chalk from 'chalk';
import { join } from 'path';
import { existsSync } from 'fs';
import { series } from 'async';

export default class ArtScaffold {
  /**
   * constructor
   * @param {String} solutionName e.g react-activity
   * @param {String} scaffoldType react | vue
   */
  constructor(projectName, scaffoldType) {
    this.projectName = projectName;
    this.scaffoldType = scaffoldType;
    this.projectDescription = '';

    // Give all supported scaffold types.
    this.scaffoldsAvailable = [];

    // Which scaffold current we choosen.
    this.scaffoldChoosen = '';
    this.scaffoldFrom = '';
    this.scaffoldTo = process.cwd();

    // Project information.
    this.moduleName = '';
  }

  public projectName: string;
  public scaffoldType: string;
  public projectDescription: string;
  public scaffoldFrom: string;
  public scaffoldTo: string;
  public projectVirtualPath: string;
  public scaffoldChoosen: string;
  public moduleName: string;
  public query: string;
  public scaffoldsAvailable: string[];

  public setScaffoldType(scaffoldType: string) {
    if (scaffoldType) {
      this.scaffoldType = scaffoldType;
    }
  }

  public setProjectName(solutionName) {
    this.projectName = solutionName;
  }

  public setScaffoldFrom(scaffoldFrom) {
    this.scaffoldFrom = scaffoldFrom;
  }

  public setProjectDescription(description) {
    this.projectDescription = description;
  }

  public setProjectVirtualPath(projectVirtualPath) {
    this.projectVirtualPath = projectVirtualPath || '';
  }

  public setScaffoldChoosen(scaffoldChoosen) {
    this.scaffoldChoosen = scaffoldChoosen || '';
  }

  public setModuleName(moduleName) {
    this.moduleName = moduleName || '';
  }

  public setQueryString(query) {
    this.query = query || {};
  }

  public getScaffoldsAvailable() {
    return this.scaffoldsAvailable || [];
  }

  public getQueryString() {
    const queryStr = qs.stringify(this.query);
    return queryStr ? '?' + queryStr : '';
  }

  public getToken() {
    return {
      scaffoldType: this.scaffoldType,
      projectDescription: this.projectDescription || '',
      projectVirtualPath: this.projectVirtualPath || '',
      projectName: this.projectName,
      moduleName: this.moduleName,
      scaffoldsAvailable: this.scaffoldsAvailable,
      queryString: this.getQueryString()
    };
  }

  public createScaffoldProject() {
    console.log(chalk.cyan(`create scaffold [${this.scaffoldType}] project starting...`));
    if (this.inArtWorkspace()) {
      return console.log(
        chalk.red('The directory contains files that could conflict.'),
        chalk.red('\nTry using a new directory and exec art create project -s="scaffold".')
      );
    }
    if (!this.scaffoldType) {
      return console.log(
        chalk.red('the property [scaffoldType] is required!')
      );
    }

    this.setScaffoldFrom(this.scaffoldFromCwd(this.scaffoldType));

    const asyncQueue = [
      this.syncConfigFiles.bind(this),
      this.syncArtConfig.bind(this),
      this.syncServerFiles.bind(this),
      this.syncClientFiles.bind(this)
    ];

    return new Promise((resolve, reject) => {
      series(asyncQueue, (err, result) => {
        if (err) {
          reject(err);
        } else { resolve(result); }
      });
    });
  }

  public createScaffoldModule() {
    console.log(chalk.cyan(`create scaffold [${this.scaffoldType}] module starting...`));
    if (!this.inArtWorkspace()) {
      return console.log(
        chalk.red('You must run `art create module -s=""` within existed art workspace')
      );
    }

    if (!this.scaffoldType) {
      return console.log(
        chalk.red('the property [scaffoldType] is required!')
      );
    }

    this.setScaffoldFrom(this.scaffoldFromCwd(this.scaffoldType));

    const asyncQueue = [
      this.syncClientFiles.bind(this),
      this.syncArtConfig.bind(this)
    ];

    return new Promise((resolve, reject) => {
      series(asyncQueue, (err, result) => {
        if (err) {
          reject(err);
        } else { resolve(result); }
      });
    });
  }

  public inArtWorkspace() {
    return existsSync(join(this.scaffoldTo, 'art.config.js'));
  }

  private scaffoldFromCwd(scaffoldType) {
    return join(__dirname, '../../templates/', scaffoldType);
  }

  public syncConfigFiles(callback) {
    require(`./${this.scaffoldType}/syncConfigFiles.js`).call(
      this,
      this.scaffoldFrom,
      this.scaffoldTo,
      callback
    );
  }

  public syncArtConfig(callback) {
    require(`./${this.scaffoldType}/syncArtConfig.js`).call(
      this,
      this.scaffoldFrom,
      this.scaffoldTo,
      callback
    );
  }

  public syncServerFiles(callback) {
    require(`./${this.scaffoldType}/syncServerFiles.js`).call(
      this,
      join(this.scaffoldFrom, 'server'),
      join(this.scaffoldTo, 'server'),
      callback
    );
  }

  public syncClientFiles(callback) {
    require(`./${this.scaffoldType}/syncClientScaffold.js`).call(
      this,
      join(this.scaffoldFrom, 'client'),
      join(this.scaffoldTo, 'client'),
      callback
    );
  }

}