import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const request = require('request')
const progress = require('request-progress')
import {
    homedir
} from 'os';
import {
    getReleases
} from './github'
import {
    ipcMain
} from 'electron'
//import unzip from 'unzip';
const appDir = path.join(homedir(), '.dapp');

export let latestVersion = null;

export const setLatest = v => {
    latestVersion = v
}

export let currentVersion = null;
const parseVersion = v => v.replace(/\w/, '').split('.').map(d => parseInt(d));

export const compareVersions = (v1, v2) => {
    if (v1 === v2) return 0;

    const d1 = parseVersion(v1);
    const d2 = parseVersion(v2);
    console.log(d1, d2)
    for (let i = 0; i < d1.length; i++) {

        if (d1[i] == d2[i]) continue;
        return d1[i] > d2[i] ? 1 : -1;
    }
    return 0;
};
// request({
//     url: 'http://download.support.xerox.com/pub/docs/FlowPort2/userdocs/any-os/en/fp_dc_setup_guide.pdf',
//     method: 'GET'
// }).on('data', console.log)

export const runApp = () => {

}

export const updateApp = (mainWindow) => {
    console.log(latestVersion)
    console.log('aaa')
    let url = latestVersion.assets.filter(({
        name
    }) => {
        return name.indexOf('App') != -1
    })[0].browser_download_url;
   // url = 'http://download.support.xerox.com/pub/docs/FlowPort2/userdocs/any-os/en/fp_dc_setup_guide.pdf'
    console.log('download init from', url)
    progress(request({
        url,
        method: 'GET'
    }))
        .on('progress', p => {
            console.log('aaa' + p);
            mainWindow.webContents.send('download-progress', p);
        })
        .on('data', console.log)
        .on('error', console.error)
        .on('end', () => {
            console.log('finish');
            mainWindow.close();
        })
        .pipe(fs.createWriteStream(path.join(appDir, latestVersion.tag_name)));

    ipcRenderer.on('download-finish', res => {
        fs.writeFileSync(path.join(appDir, 'version'), latestVersion.tag_name);
        fs.mkdirSync(path.join(appDir, latestVersion.tag_name));
        fs.writeFileSync(path.join(appDir, latestVersion.tag_name, 'app.zip'));

        // fs.createReadStream(path.join(appDir, latestVersion.tag_name, 'app.zip')).pipe(unzip.Extract({
        //     path: path.join(appDir, latestVersion.tag_name, 'app')
        // }));
        currentVersion = latestVersion.tag_name
    })
};

export const checkUpdate = () => {
    console.log('checking update');
    return getReleases().then(releases => {
        console.log("Got releases")
        releases.forEach(r => {
            console.log(currentVersion, r.tag_name, )
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