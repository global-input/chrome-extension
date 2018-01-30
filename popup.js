document.addEventListener('DOMContentLoaded', function() {
      var globalInputButton = document.getElementById('enableGlobalInput');
      var messageContainer=document.getElementById('message');
      globalInputButton.addEventListener('click', function() {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, {action: "enable"}, function(response) {
                                  if(!response){
                                      messageContainer.innerHTML="Unable to communicate with the page content, please reload the page and try again";
                                  }
                                  else if(response.success){
                                      messageContainer.innerHTML="Global Input is now enabled! The page should be displaying a QR Code. Now you can scan it with the Global Input App on your mobile to connect to the page";
                                  }
                                  else{
                                    messageContainer.innerHTML=response.error+". If there is indeed a Sign in Form on the page, please contact us to add the identification of this form to the code or you can do it youself if you are are familiar with JavaScript codes.";
                                  }
                                  console.log(JSON.stringify(response));
                          });
                });
      });


});
