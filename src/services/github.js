const octokit = require('@octokit/rest')()

import {
    repoName,
    repoOwner
} from '../config'

export const getReleases = () => {
    return octokit.repos.getReleases({
        owner: repoOwner,
        repo: repoName
    }).then(res => res.data);
}