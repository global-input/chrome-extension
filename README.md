# Global Input App Chrome Extension
This Chrome Extension allows you to use your mobile device to operate on websites and web applications that are loaded on your computer. You can carry out various mobile-to-computer operations like [Mobile Authentication](https://globalinput.co.uk/global-input-app/mobile-authentication), [Mobile Content Transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer), [Mobile Input & Control](https://globalinput.co.uk/global-input-app/mobile-input-control), and [Mobile Encryption](https://globalinput.co.uk/global-input-app/mobile-content-encryption). 

This extension comes preloaded with configurations for operating on some common websites including Google, GitHub, GitLab, Amazon+AWS, Dropbox, Apple, Twitter, Facebook, Digital Ocean, LinkedIn, Wordpress, Lucidchart, ProtonMail, to name a few. Creating a new configuration for a new website is a straight-forward process. You just need to specify how to locate the HTML elements that you would like to operate on using your mobile. 

Also, instead of using direct web page control, you can also transfer data between your mobile and the browser extension window using your clipboard as a go-between medium.

Furthermore, you can also encrypt/decrypt content using your mobile and transfer the resulting text back to your computer. 

## How to Install
This extension is developed using React JS.  You can run the following command in the project folder to create the necessary extension files in the ```build``` folder:

```
npm run build
```
Then, go to the Chrome Extensions window (load ```chrome://extensions``` on your browser), and click on the "Load unpacked" button there, which should pop up a File dialogue box. Please navigate to the ```build``` folder in the project folder and press the ```Select``` button.

This extension is also available in the [Chrome Web Store](https://chrome.google.com/webstore/detail/global-input-app/hcklienddlealndjnakkagefaelhnjkp?hl=en).