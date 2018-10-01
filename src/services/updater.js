import * as fs from 'fs';
import * as path from 'path';
import { execFileSync, execSync } from 'child_process'
import { appDir, archiveType, platform, execPath } from '../config';
import { compareVersions, downloadApp, remakeDir, unzip } from '../utils'

import { getReleases } from './github'

export let latestVersion = null;
export let currentVersion = null;

export const runApp = () => {
    let version = fs.readFileSync(path.join(appDir, 'version')).toLocaleString();
    console.log("Running the app:", version);
    console.log(`open ${path.join(appDir, version, execPath())}`)
    if(platform() === 'mac'){
        
        execSync(`open ${path.join(appDir, version, execPath())}`)
    }else{
        execFileSync(path.join(appDir, version, execPath()))
    }
}

export const updateApp = async (mainWindow) => {
    console.log(latestVersion)

    let assets = latestVersion.assets.filter(({
        name
    }) => {
        if (platform() === 'mac') {
            return name.indexOf('mac') != -1
        } else if (platform() === 'windows') {
            return name.indexOf('win') != -1
        } else {
            return name.indexOf('linux') != -1
        }
    });
    
    console.log(assets)
    let url = assets[0].browser_download_url;
    console.log('download init from', url)

    const versionDir = path.join(appDir, latestVersion.tag_name);
    const archiveFile = path.join(versionDir, 'app' + archiveType);
    
    await remakeDir(versionDir);

    downloadApp(url, archiveFile, p => mainWindow.webContents.send('download-progress', p))
        .then(() => {
            unzip(archiveFile, versionDir).then(files => {
                console.log('done!', files);
                mainWindow.close();
                currentVersion = latestVersion.tag_name;
                fs.writeFileSync(path.join(appDir, 'version'), latestVersion.tag_name);
                runApp()
            });
        })
};

export const checkUpdate = () => {
    console.log('checking update');
    return getReleases().then(releases => {
        console.log("Got releases")
        releases.forEach(r => {
            console.log(currentVersion, r.tag_name)
            if (compareVersions(currentVersion, r.tag_name) == -1) {
                console.log('Found ' + r.tag_name)
                if (latestVersion == null) {
                    latestVersion = r;
                } else {
                    if (compareVersions(latestVersion.tag_name, r.tag_name) == -1) {
                        latestVersion = r;
                    }
                }
            }
        });
        if (latestVersion) console.log('Latest version: ' + latestVersion.tag_name, 'Current :' + currentVersion);
        return !!latestVersion
    })
}

export const initialize = () => {
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir);
        fs.writeFileSync(path.join(appDir, 'version'), 'v0.0.0');
    }
    let version = fs.readFileSync(path.join(appDir, 'version')).toLocaleString();
    currentVersion = version;
};