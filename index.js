const core = require('@actions/core');
const github = require('@actions/github');

(
    async () => {
        try {
            core.notice("Start activing mysql...");
        } catch (error) {
            core.setFailed(error.message);
        }
    }
)();