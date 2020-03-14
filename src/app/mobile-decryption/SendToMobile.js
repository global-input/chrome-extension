import React, { useEffect, useState } from 'react';

import { InputWithCopy, TextButton, MessageContainer, FormContainer } from '../app-layout';

import ACTIONS from './ACTIONS';

const fields = {
    content: {
        id: "content",
        label: "Content",
        type: 'decrypt',
        value: ''
    },
    info: {
        type: "info",
        value: 'The decrypted content is sent to to the browser extension window (on your computer).'
    },
    loadOnMobile: {
        id: "loadOnMobile",
        label: "Load On Mobile",
        type: "button",
        viewId: "row1"
    },
    finish: {
        id: "finish",
        label: "Finish",
        type: "button",
        viewId: "row1"
    },
};

const defaultEncryptionKeyName = "general";
const initData = value => {
    const fContent = { ...fields.content, value };
    return {
        action: "input",
        dataType: "form",
        key: defaultEncryptionKeyName,
        form: {
            title: "Content Encryption",
            fields: [fContent, fields.info, fields.loadOnMobile, fields.finish]
        }
    };
};


export default ({ setAction, content, globalInputApp, decryptedContent, setDecryptedContent, toMobileIntegrationHome }) => {
    useEffect(() => {
        globalInputApp.setInitData(initData(content));
    }, []);
    useEffect(() => {
        const { field } = globalInputApp;
        if (!field) {
            return;
        }
        switch (field.id) {
            case fields.loadOnMobile.id:
                setAction(ACTIONS.LOAD_RESULT_ON_MOBILE);
                break;

            case fields.finish.id:
                toMobileIntegrationHome();
                break;

            case fields.content.id:
                if(field.value){
                    setDecryptedContent(field.value);
                }
                else{
                    setAction(ACTIONS.FAILED);
                }
                
                break;
        }
    }, [globalInputApp.field]);

    if (decryptedContent) {
        return (
            <FormContainer title="Decrypted Content">

                <InputWithCopy id="decryptedContent" readOnly={true}
                    label="Decrypted Content"
                    type={"textarea"}
                    value={decryptedContent} />
                <TextButton onClick={() => {
                    toMobileIntegrationHome()
                }
                } label='Finsih' />
                <MessageContainer>
                The text box contains the decrypted content. 
                You can press the "Copy" button to copy the content into your clipboard.                
            </MessageContainer>

            </FormContainer>
        );

    }
    else {
        return(<MessageContainer title="Decrypting Content">
    Please follow the instruction on your mobile to decrypt the content. 
    On your mobile, you can press the "Show" button to view the content it has received.
    Select the encryption key that you would like to use with the decryption. 
    If you have multiple encryption keys, the key with the name "{defaultEncryptionKeyName}" will be selected automatically. 
    Finally, press the "Decrypt" button there to decrypt the content.

  </MessageContainer>);
    }
};