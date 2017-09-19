# Global input chrome extension


This is for enabling chrome to support the Global Input software so that you can use your mobile to login instead of typing on the computer screen. Since your mobile will remember your password and auto-fill the form, you can speed up the login process. For example, when you go to confluence page, it will display a QR code,  so that you can connect with the Global Input mobile app (available in [iOS](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4) and [Android](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4)) to your the confluence just by poing the phone camera to the QR code.

At the moment it supports confluence, JIRA and gitlab, github and Lucidchart.

### Installation

download the files in this repository into a folder:

 ```git clone git@github.com:global-input/chrome-extension.git```


And then click on the "tools" (three dots on the right hand side of the chrome) to open the tools menu and and select ```More Tools``` and then ```extensions```, and then click on ```Load unpacked extensions...``` button to open the file section menu, select the folder that you have download the chrome extension into, and then click on ```select``` button.

### Test

You can visit any confluence page, for example [our confluence](https://iterativesolution.co.uk/confluence), you should see a QR code. When you scan it with Global Input App, you should see a login form on your mobile as well.
