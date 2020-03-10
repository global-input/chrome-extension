export const getGlobalInputSettings=()=>{
    const globalInputSettings={
        url:   localStorage.getItem("iterative.globaliputapp.url"),
        apikey:localStorage.getItem("iterative.globaliputapp.apikey"),
    };
    if(!globalInputSettings.url){
        globalInputSettings.url="https://globalinput.co.uk";
    }
    if(!globalInputSettings.apikey){
        globalInputSettings.apikey="k7jc3QcMPKEXGW5UC";
    }
    return globalInputSettings;
  };

export const saveSettings=settings=>{
    
    const original=getGlobalInputSettings();
    if(settings.url && settings.url.trim() !== original.url){
        localStorage.setItem("iterative.globaliputapp.url",settings.url.trim());
    }
    if(settings.apikey && settings.apikey.trim() !== original.apikey){
        localStorage.setItem("iterative.globaliputapp.apikey",settings.apikey.trim());
    }
}