import { importEnvironmentVariables, validateEnvironmentVariables } from "./utils/environment";

importEnvironmentVariables();
validateEnvironmentVariables();

import Wakeword from "./voice";

// tslint:disable-next-line:no-unused-expression
new Wakeword();

import "./hotkey";
import "./obs";

