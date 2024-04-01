import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { readFile, readdir, stat } from "fs/promises";


const LIGHTS_SCRIPTS_DIR = "./bin/lights/"

enum SCRIPT_ARG_TYPES {
    "string",
    "rgb",
}

enum SCRIPT_RUN_RETURN_TYPES {
    "ERR_NO_SCRIPT",
    "SUCCESS"
}

interface ScriptInfo {
    file: string;
    name: string;
    arguments?: { name: string, type?: SCRIPT_ARG_TYPES };
    active: boolean;
}

class LightsController {
    subprocess: ChildProcessWithoutNullStreams | undefined; 
    activeScript: string = "";

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

            if (scriptName[0] == ".") {
                continue;
            }
            
            let meta: ScriptInfo = {
                file: scriptName,
                name: scriptName.split(".").slice(0, -1).join("."),
                active: scriptName == this.activeScript
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
            this.subprocess.off("exit", this.subprocessEnded);
            this.subprocess.kill();
        }

        this.activeScript = "";
    }

    subprocessEnded(code: any, signal: any) {
        this.activeScript = "";
    }

    async runScript(name: string, args: string[]): Promise<{"success": boolean, "message": SCRIPT_RUN_RETURN_TYPES}> {
        this.endScript();
        
        let availableScripts = await this.listScriptFiles();
        if (!availableScripts.includes(name)) {
            return {"success": false, "message": SCRIPT_RUN_RETURN_TYPES.ERR_NO_SCRIPT};
        }

        this.subprocess = spawn(LIGHTS_SCRIPTS_DIR + name); // TODO: figure out how to pass args safely
        this.activeScript = name;

        this.subprocess.on("exit", this.subprocessEnded)

        return {"success": true, "message": SCRIPT_RUN_RETURN_TYPES.SUCCESS}
    }
}

let controller: LightsController = new LightsController();

export default controller;