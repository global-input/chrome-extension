# Global Input App Chrome Extension
This is a Global Input App Chrome Extension, for introducing mobile integrations to websites and applications using the [Global Input App](https://globalinput.co.uk).  It provides you with the following functionalities:

 - [Mobile Authentication](https://globalinput.co.uk/global-input-app/mobile-authentication): this feature allows you to sign in to websites and web applications using your [Global Input App](https://globalinput.co.uk),  effectively turning password-based authentications into password-less authentications. This will protect your passwords from prying eyes and cameras when you are signing in to websites in public view. [This demo video](https://www.youtube.com/watch?v=jLIIrlEoQXM&t=3s) and [this tutorial video](https://www.youtube.com/watch?v=7-vavraSj-s) shows how to use this feature.
 - [Mobile Content Transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer): this feature allows you to transfer content securely between your mobile and computers.
 - [Mobile Input & Control](https://globalinput.co.uk/global-input-app/mobile-input-control):  the Application Control Settings in the extension allows you to specify HTML elements in the page that you would like to interact using your mobile. For example, you can use your mobile to control video players.

This extension uses the [GIA JS Extension](https://github.com/global-input/global-input-message). The Chrome extension plays the role of  proxy between the web page and the GIA, hence if an application has already embedded [the GIA JS Extension](https://github.com/global-input/global-input-message), then users do not need to use the Chrome extension for using the GIA to operate on it.

### Chrome Store
Install the Chrome Extension on [Chrome Store](https://chrome.google.com/webstore/detail/global-input-app/hcklienddlealndjnakkagefaelhnjkp)

If you are a developer, you may prefer to download the source code and install it yourself on your Chrome Browser:

After downloading (git clone) the source code, run the following command to download the dependencies:
```
npm install
```
Above command will download the dependencies and append all the configurations files in the ```application-controls``` folder into  ```extension/application-controls.js```.
This files defines the HTML elements of the web page that needs to be controlled from the Global Input App. You also defines them in the Application Control Settings in the extension window.
Type the following URL in the address bar of your browser to go to the extension window:
```
chrome://extensions
```

Then, click on the "Load unpacked" button, which is located on the top of the "Extensions" window.  A File dialogue box should pop up, allowing you to choose the folder. The extension folder is located inside the folder that you have downloaded the source code.

After the installation, you should be able to see a Global Input Icon at the right-hand side of the address bar of your Chrome browser.  

### How To Use

If a webpage is already loaded in a tab of your browser when you have installed the extension, you need to reload the page. Then click on the "Global Input App" icon,  which is located on the right-hand side of the address bar of your browser. Clicking on the icon should pop up a small window. Clicking on the "Connect to mobile" button should display a QR Code in the extension window.

You can now scan the QR code using the Global Input App with your mobile.

When you scan the QR Code using the Global Input App, a form control should be displayed on your mobile screen. Now you can use your mobile to operate on the page loaded on your Chrome browser running on your computer.

You can directly operate on many websites such as Google, GitHub, GitLab, Amazon+AWS, Dropbox, Apple, Twitter, Facebook, C9, Digital Ocean, Evernote, Heroku, Atlassian, join. me, JS BIN, JSFiddle, LinkedIn, Microsoft, Wordpress, Lucidchart, NpmJS, ProtonMail, Vultr, Wable, Wisepay, 123-reg etc. You can find the full list from the ```application-controls``` folder if you download the source code. If you have found that the extension is not enabled for some website, you can enable it in the Application Control Settings window by specifying the identifier of the HTML elements on the web page.  In the extension window, click on the "Application Control Settings", and then click on "Enable" button to go the application control settings editor, where you can specify the HTML elements of the page that you would like to control with your mobile. In order to find the HTML element, you just need to right mouse click on the form elements and click on "inspect", then you can find the corresponding HTML elements.

Without enabling the application control for a website, you can still transfer data securely from/to extension  using your mobile and do copy and paste operation.  You can also customise the form on the extension for the website to match the form displayed on the website. One advantage of using the form on the extension window is that you can also transfer content from your computer to your mobile as well.
