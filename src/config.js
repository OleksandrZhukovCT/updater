const os = require('os');
const path = require('path');
let execs = {
    windows: "OraOra.exe",
    linux: "Desktop Application",
    mac: "Desktop Application"
}

export const repoOwner = 'OleksandrZhukovCT';
export const repoName = 'ora';

export const platform = () => {
    if (os.platform().indexOf('darwin') != -1) {
        return 'mac'
    } else if(os.platform().indexOf('win') != -1) {
        return 'windows'
    } else {
        return 'linux'
    }
} 
export const exec = () => execs[platform()]

export const archiveType = '.zip'

export const appDir = path.join(process.cwd(), '.dapp')