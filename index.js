const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');

(
    async () => {
        const DB = {
            port: core.getInput('port'),
            host: core.getInput('host'),
            name: core.getInput('name'),
            user: core.getInput('user'),
            password: core.getInput('password'),
            source: core.getInput('source')
        };

        // print input data
        // core.info(`port :>> ${DB.port}`);
        // core.info(`host :>> ${DB.host}`);
        // core.info(`name :>> ${DB.name}`);
        // core.info(`user :>> ${DB.user}`);
        // core.info(`password :>> ${DB.password}`);
        // core.info(`source :>> ${DB.source}`);

        // active mysql 5.7 in ubuntu-lastest
        try {
            const res = execSync(`sudo /etc/init.d/mysql start --port=${DB.port}`);
            core.info(`active mysql :>> ${res}`);
        } catch (error) {
            core.error(`active mysql error :>> ${error.message}`);
            core.setFailed(error.message);
        }

        // import database by source
        try {
            const res = execSync(`mysql -P${DB.port} -h${DB.host} -uroot -proot -e "source ${DB.source}"`);
            core.info(`import database :>> ${res}`);
        } catch (error) {
            core.error(`import database error :>> ${error.message}`);
            core.setFailed(error.message);
        }

        // create user, and grant permission
        try {
            const res = execSync(`mysql -P${DB.port} -h${DB.host} -uroot -proot -e "CREATE USER '${DB.user}'@'${DB.host}' IDENTIFIED BY '${DB.password}'"`);
            core.info(`create user :>> ${res}`);
        } catch (error) {
            core.error(`create user error :>> ${error.message}`);
            core.setFailed(error.message);
        }

        try {
            const res = execSync(`mysql -P${DB.port} -h${DB.host} -uroot -proot -e "GRANT ALL ON * TO '${DB.user}'@'${DB.host}'" ${DB.name}`);
            core.info(`grant permission :>> ${res}`);
        } catch (error) {
            core.error(`grant permission error :>> ${error.message}`);
            core.setFailed(error.message);
        }
    }
)();
