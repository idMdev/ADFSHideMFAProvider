// Sample code to hide a particular MFA method
//setup variables. hideMethod is the name of the element id presented for the MFA provider. uriOfRP is the URI of relying party as sent by the authentication redirect from the app to AD FS
var hideMethod = 'AzureMfaAuthentication';
//hiding options
//var optionHide = 'HidePerRP' (per relying party), 
//var optionHide = 'HidePerUser' (per defined array of users),
//var optionHide = 'HideForBoth' (both for RP and specific users)
var optionHide = 'HideForBoth';
//define array of UPNs that are whitelisted for use of Azure MFA
//not necessary/used for HidePerRP option
/////////////////////////
//WARNING: THIS WILL BE DELIVERED TO END USER BROWSER AND MAY RESULT IN INFORMATION DISCLOSURE
//PER USER RESTRICTIONS SHOULD NOT BE USED IN THE PRODUCTION ENVIRONMENT IF LEAKING OF USERNAMES TO CLIENT BROWSER IS A CONCERN
///////////////////////
var pilotUsersArray = [
    "jmorgan@azureidentity.us",
    "alexpav_local@alexpavtest.onmicrosoft.com"
];
var uriOfRP = 'urn%3Aalexpav%3Aadfs-app';
