import * as request from 'request'
import * as fs from 'fs';
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

export const removeFolder = (path) => {
    return new Promise((resolve) => {
        require('rimraf')(path, resolve);
    })
}

export const remakeDir = async (dir) => {
    if (fs.existsSync(dir)) {
        console.log("Found target version directory, removing");
        await removeFolder(dir)
        console.log("Directory Removed")
    }
    fs.mkdirSync(dir);
}

export const downloadApp = (url, archiveFile, onprogress) => {
    return new Promise((resolve, reject) => {
        require('request-progress')(request({
            url,
            method: 'GET'
        }))
            .on('progress', onprogress)
            .on('error', reject)
            .on('end', resolve)
            .pipe(fs.createWriteStream(archiveFile))
    })
}