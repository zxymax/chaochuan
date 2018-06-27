const configClient = require("cloud-config-client");

function configLoader (options = {endpoint: 'http://localhost:8888', name: 'push-transit-server', profiles: []}) {
    return new Promise((resolve, reject) => {
        configClient.load(options)
            .then(config => {
                resolve(config)
            })
            .catch(err =>{
                reject(err)
            });
    });
}

module.exports = configLoader;