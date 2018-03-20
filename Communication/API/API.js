import ApiConnection from './ApiConnection';

import config from '../../env';

export default new ApiConnection( 
    config.api.protocol, 
    config.api.hostname, 
    config.api.port, 
    config.api.basePath,
    config.api.loginPath,
    config.api.logoutPath 
);