'use strict';

window.onerror = function(message, url, lineNumber) {
    console.log("Error: "+message+" in "+url+" at line "+lineNumber);
};


(function(){

    var INITIAL_PAGE = 'index';

    Utils.onReady(function(){
        Utils.
            require([
                'js/app/misc/i18n.js',
                'js/app/misc/validator.js',
                'js/app/controllers/loginPageController.js',
                'js/app/controllers/indexPageController.js'
            ]).
            then(function(){
                i18n.setLocale('ua');
                i18n.applyLocale();
                CommonController.init();

                LoginPageController.init();

                CommonController.showPage(INITIAL_PAGE);
            });

    });

})();