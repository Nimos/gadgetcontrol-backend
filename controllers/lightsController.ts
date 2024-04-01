import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { readFile, readdir, stat } from "fs/promises";


const LIGHTS_SCRIPTS_DIR = "./bin/lights/"

enum SCRIPT_ARG_TYPES {
    string,
    rgb,
}

interface ScriptInfo {
    file: string;
    name: string;
    arguments?: {name: string, type?: SCRIPT_ARG_TYPES};
}

class LightsController {
    subprocess: ChildProcessWithoutNullStreams | undefined; 

    constructor() {
        console.log("Creating Lights Controller")
    }
    
    async listScriptFiles(): Promise<string[]> {
        return readdir(LIGHTS_SCRIPTS_DIR);
    }

    async listScripts(): Promise<ScriptInfo[]> {
        const scripts = await this.listScriptFiles();

        const results: ScriptInfo[] = [];

        for (let scriptName of scripts) {
            let fileStat = await stat(LIGHTS_SCRIPTS_DIR + scriptName)
            if (fileStat.isDirectory()) {
                continue;
            }

            let extension = scriptName.split(".").pop();
            if (extension == "json") {
                continue;
            }
            
            let meta: ScriptInfo = {
                file: scriptName,
                name: scriptName.split(".").slice(0, -1).join(".")
            };

            if (scripts.includes(scriptName + ".json")) {
                let infoFile = await readFile(LIGHTS_SCRIPTS_DIR + scriptName + ".json", "utf8")
                meta = {
                    ...meta,
                    ...JSON.parse(infoFile)
                }
            }
            
            results.push(meta);
        }

        return results;
    }

    endScript() {
        if (this.subprocess && !this.subprocess.killed) {
            this.subprocess.kill();
        }
    }

    runScript(name: string, args: string[]) {
        this.endScript();        
    }
}

let controller: LightsController = new LightsController();

export default controller;