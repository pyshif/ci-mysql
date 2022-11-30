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
        execSync(`sudo /etc/init.d/mysql start --port=${DB.port}`);

        // import database by source
        execSync(`mysql -P${DB.port} -h${DB.host} -uroot -proot -e "source ${DB.source}"`);

        // create user, and grant permission
        execSync(`mysql -P${DB.port} -h${DB.host} -uroot -proot -e "CREATE USER '${DB.user}'@'${DB.host}' IDENTIFIED BY '${DB.password}'"`);
        execSync(`mysql -P${DB.port} -h${DB.host} -uroot -proot -e "GRANT ALL ON * TO '${DB.user}'@'${DB.host}'" ${DB.name}`);

        // print databases, and users

        // try {
        //     core.notice("Start activing mysql...");
        // } catch (error) {
        //     core.setFailed(error.message);
        // }
    }
)();
