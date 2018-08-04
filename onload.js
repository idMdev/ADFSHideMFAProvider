// Copyright (c) Microsoft Corporation.  All rights reserved.

// This file contains several workarounds on inconsistent browser behaviors that administrators may customize.
"use strict";
var scriptSource = "https://alexpavstatic.blob.core.windows.net/adfsexternalscript/variables.js";
function loadExternal(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

var hideFunction = function () {
    //get the user ID from the page
    var userId = document.getElementById('mfaGreeting').innerText.split(" ")[1];

    //hiding for RP only
    if (optionHide == 'HidePerRP') {
        // Check whether the MFA provider to-be-hidden element is present on the page
        var mfaElement = document.getElementById(hideMethod);
        //get the current page URL. The relying party identifier is in the URL. Needs to be tested for various scenarios (IDP vs SP initiated, etc.)
        var urlHref = window.location.href;
        //Relying party name in URL safe format that we are detecting
        if (mfaElement && (urlHref.indexOf(uriOfRP) !== -1))  //if the MFA element is present AND the current page URL contains the identifier
        {
            //hide the desired MFA method. 
            document.getElementById(hideMethod).style.display = 'none';
        }
    }

    if (optionHide == 'HideForBoth') {
        // Check whether the undesired element is present on the page
        var mfaElement = document.getElementById(hideMethod);
        //get the current page URL. The relying party identifier is in the URL. Needs to be tested for various scenarios (IDP vs SP initiated, etc.)
        var urlHref = window.location.href;
        //Relying party name in URL safe format that we are detecting
        //if the MFA element is present AND the current page URL contains the identifier
        //as well as if the user is in the user list

        if (mfaElement && (urlHref.indexOf(uriOfRP) !== -1) && (pilotUsersArray.indexOf(userId !== -1))) {
            //hide the desired MFA method. 
            document.getElementById(hideMethod).style.display = 'none';
        }
    }

    if (optionHide == 'HidePerUser') {
        // Check whether the undesired element is present on the page
        var mfaElement = document.getElementById(hideMethod);
        if (mfaElement && (pilotUsersArray.indexOf(userId) !== -1)) {
            //hide the desired MFA method. 
            document.getElementById(hideMethod).style.display = 'none';
        }
    }
};

loadExternal(scriptSource, hideFunction);

// iPhone email friendly keyboard does not include "\" key, use regular keyboard instead.
// Note change input type does not work on all versions of all browsers.
if (navigator.userAgent.match(/iPhone/i) != null) {
    var emails = document.querySelectorAll("input[type='email']");
    if (emails) {
        for (var i = 0; i < emails.length; i++) {
            emails[i].type = 'text';
        }
    }
}

// In the CSS file we set the ms-viewport to be consistent with the device dimensions, 
// which is necessary for correct functionality of immersive IE. 
// However, for Windows 8 phone we need to reset the ms-viewport's dimension to its original
// values (auto), otherwise the viewport dimensions will be wrong for Windows 8 phone.
// Windows 8 phone has agent string 'IEMobile 10.0'
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(
        document.createTextNode(
            "@-ms-viewport{width:auto!important}"
        )
    );
    msViewportStyle.appendChild(
        document.createTextNode(
            "@-ms-viewport{height:auto!important}"
        )
    );
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

// If the innerWidth is defined, use it as the viewport width.
if (window.innerWidth && window.outerWidth && window.innerWidth !== window.outerWidth) {
    var viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=' + window.innerWidth + ', initial-scale=1.0, user-scalable=1');
}

// Gets the current style of a specific property for a specific element.
function getStyle(element, styleProp) {
    var propStyle = null;

    if (element && element.currentStyle) {
        propStyle = element.currentStyle[styleProp];
    }
    else if (element && window.getComputedStyle) {
        propStyle = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
    }

    return propStyle;
}

// The script below is used for downloading the illustration image 
// only when the branding is displaying. This script work together
// with the code in PageBase.cs that sets the html inline style
// containing the class 'illustrationClass' with the background image.
var computeLoadIllustration = function () {
    var branding = document.getElementById("branding");
    var brandingDisplay = getStyle(branding, "display");
    var brandingWrapperDisplay = getStyle(document.getElementById("brandingWrapper"), "display");

    if (brandingDisplay && brandingDisplay !== "none" &&
        brandingWrapperDisplay && brandingWrapperDisplay !== "none") {
        var newClass = "illustrationClass";

        if (branding.classList && branding.classList.add) {
            branding.classList.add(newClass);
        } else if (branding.className !== undefined) {
            branding.className += " " + newClass;
        }
        if (window.removeEventListener) {
            window.removeEventListener('load', computeLoadIllustration, false);
            window.removeEventListener('resize', computeLoadIllustration, false);
        }
        else if (window.detachEvent) {
            window.detachEvent('onload', computeLoadIllustration);
            window.detachEvent('onresize', computeLoadIllustration);
        }
    }
};

if (window.addEventListener) {
    window.addEventListener('resize', computeLoadIllustration, false);
    window.addEventListener('load', computeLoadIllustration, false);
}
else if (window.attachEvent) {
    window.attachEvent('onresize', computeLoadIllustration);
    window.attachEvent('onload', computeLoadIllustration);
}

// Function to change illustration image. Usage example below.
function SetIllustrationImage(imageUri) {
    var illustrationImageClass = '.illustrationClass {background-image:url(' + imageUri + ');}';

    var css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet) css.styleSheet.cssText = illustrationImageClass;
    else css.appendChild(document.createTextNode(illustrationImageClass));

    document.getElementsByTagName("head")[0].appendChild(css);
}



// Example to change illustration image on HRD page after adding the image to active theme:
// PSH> Set-AdfsWebTheme -TargetName <activeTheme> -AdditionalFileResource @{uri='/adfs/portal/images/hrd.jpg';path='.\hrd.jpg'}
//
//if (typeof HRD != 'undefined') {
//    SetIllustrationImage('/adfs/portal/images/hrd.jpg');
//}