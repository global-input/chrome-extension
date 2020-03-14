import React, { useState } from 'react';


import ProvideContentOnComputer from './ProvideContentOnComputer';
import ProvideContentOnMobile from './ProvideContentOnMobile';
import SendToMobile from './SendToMobile';
import LoadResultOnMobile from './LoadResultOnMobile';
import ACTIONS from './ACTIONS';

export default ({ globalInputApp, toMobileIntegrationHome }) => {
    const [action, setAction] = useState(ACTIONS.COMPOSE_CONTENT_ON_COMPUTER);
    const [content, setContent] = useState('');
    const [encryptedContent, setEncryptedContent] = useState('');

    switch (action) {
        case ACTIONS.SEND_TO_MOBILE: {
            const props = { setAction, content, globalInputApp, encryptedContent, setEncryptedContent, toMobileIntegrationHome };
            return (<SendToMobile {...props} />);
        }
        case ACTIONS.COMPOSE_CONTENT_ON_COMPUTER: {
            const props = {
                content, setContent, globalInputApp,
                toMobileIntegrationHome, setAction
            };
            return (<ProvideContentOnComputer {...props} />);
        }
        case ACTIONS.COMPOSE_CONTENT_ON_MOBILE: {
            const props = {
                content, setContent, globalInputApp,
                toMobileIntegrationHome, setAction
            };
            return (<ProvideContentOnMobile {...props} />);

        }
        case ACTIONS.LOAD_RESULT_ON_MOBILE: {
            const props = {
                globalInputApp,
                toMobileIntegrationHome, setAction, encryptedContent
            };
            return (<LoadResultOnMobile {...props} />);
        }


        default:
    }
};















