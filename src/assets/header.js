// assets/header.js
window.umConsentManager = {
    //mode: 'prod', // values: 'prod', 'dev'
    //customManager: {
    //    enabled: true,
    //    alwaysShow: true
        //enabled   : false,
        //alwaysShow: false,
        //rootDomain: false,
        //preferencePanel: {
        //    beforeCategories: false, // HTML
        //    afterCategories: false   // HTML
        //}
    //},
    privacyUrl: 'https://lib.umich.edu/about-us/policies/library-privacy-statement',
    //onConsentChange: ({ cookie }){},
    googleAnalyticsID: false, // e.g. G-XXXXXXXXXX
    //cookies: {
    //    necessary: [], // {name: '', domain: '', regex: ''}
    //    analytics: []
    //}
};
(function() {
  var script = document.createElement('script');
  script.src = 'https://umich.edu/apis/umconsentmanager/consentmanager.js';
  script.async = true; // Enables asynchronous loading
  document.head.appendChild(script);
})();
