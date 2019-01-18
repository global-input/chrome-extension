# Global Input Chrome Extension
This Chrome Extension together with the [Global Input App](https://globalinput.co.uk) allows you to sign in to any websites or any web applications you are visiting in public view without revealing your passwords.  You may watch [this demo video](https://www.youtube.com/watch?v=jLIIrlEoQXM&t=3s) or [this tutorial video](https://www.youtube.com/watch?v=7-vavraSj-s) to find out more information about this feature.

This extension also allows you to transfer content securely between devices. When you type content on the form on the extension, the content will be transferred to your mobile, or vice versa.

Furthermore, you can also create Application Control Settings in the extension to use your mobile to operate on any web applications, for example, you can use your mobile to control a video player on a website. Again, you can do so by providing the identifier of the HTML elements that you would like to control or input from your mobile.  

This extension is powered by the [global-input-message](https://github.com/global-input/global-input-message) JavaScript library, which is for extending an application to have a secure mobile input and mobile control.

### Easy Installation
You can do one-click install from  
 [Global Input App extension from Chrome Store](https://chrome.google.com/webstore/detail/global-input-app/hcklienddlealndjnakkagefaelhnjkp)

### Manual Installation
You can also download the source code from this repository,  and then do the manual installation:

After downloading (git clone) the source code, run the following command in the source folder inside your terminal:
```
npm install
```
Above command will download the dependencies and append all the configurations files in the ```application-controls``` folder into a single file, which is ```extension/application-controls.js```.
This file defines the HTML elements of the web page that needs to be controlled from the Global Input App.

Then type the following URL in the address bar of your browser to go to the extension window:
```
chrome://extensions
```

Then, click on the "Load unpacked" button, which is located on the top of the "Extensions" window.  A File dialogue box should pop up to allow you to choose the extension folder. The extension folder is located inside the folder that you have downloaded the source code.

After the installation, you should be able to see a Global Input Icon at the right-hand side of the address bar of your Chrome browser. Please click on it to confirm that it is installed.

### How To Use

If a webpage is already loaded in a tab of your browser when you have installed the extension, you need to reload the page. Then click on the "Global Input App" icon,  which is located on the right-hand side of the address bar of your browser. Clicking on the icon should pop up a small window. Clicking on the "Connect to mobile" button should display a QR Code in the extension window.

You can now scan the QR code using the Global Input App (available in [iOS](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4) and [Android](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4)) with your mobile.

When you scan the QR Code using the Global Input App, a form control should be displayed on your mobile screen. Now you can use your mobile to operate on the page loaded on your Chrome browser running on your computer.

### Application Control Settiongs ###

The example websites that you can sign in without any extra Application Control settings are Google, GitHub, GitLab, Amazon+AWS, Dropbox, Apple, Twitter, Facebook, C9, Digital Ocean, Evernote, Heroku, Atlassian, join.me, JS BIN, JSFiddle, LinkedIn, Microsoft, Wordpress, Lucidchart, NpmJS, ProtonMail, Vultr, Wable, Wisepay, 123-reg etc. You can find the full list from the ```application-controls" folder if you have downloaded the source code. When you have found that the extension does not have Application Control Settings for some website/web applications, you can create one in the Application Control Settings window by specifying the identifier of the HTML elements in the web page.  In the extension window, click on the "Application Control Settings", where you can specify the HTML elements of the page that is currently loaded. In order to find the HTML element, you just need to right mouse click on the form elements and click on "inspect", then you can find the corresponding HTML elements.

If you operate without Application Control settings, you can use copy-paste operation to copy content from the form on the extension window to the website. You can also customise the form on the extension for the website as well. One advantage of using the form on the extension window is that you can also transfer content from your computer to your mobile as well.
