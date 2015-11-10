window.onerror = function(message, url, lineNumber) {
    console.log("Error: "+message+" in "+url+" at line "+lineNumber);
};


(function(){

    var INITIAL_PAGE = 'main';

    Utils.onReady(function(){
        Utils.
            require([
                'js/app/misc/api.js',
                'js/app/misc/i18n.js',
                'js/app/misc/validator.js',
                'js/app/controllers/mainPageController.js'
            ]).
            then(function(){
                Api.makeBaseRequest();
                i18n.setLocale('ua');
                i18n.applyLocale();

                MainPageController.init();

                CommonController.showPage(INITIAL_PAGE);
            });

    });

})();