import React, {useEffect, useState} from 'react';

import {MessageContainer} from '../app-layout';
export default ()=>(    
            <MessageContainer>
                The text box above contains the encrypted content that you can decrypt only using the same encryption key you have used when encrypting the content.
                You may press the "Copy" button to copy the content into your clipboard.
            </MessageContainer>
);
        