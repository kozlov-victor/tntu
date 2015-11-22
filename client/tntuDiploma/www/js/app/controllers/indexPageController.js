'use strict';

(function(){

    var IndexPageController = {};




    IndexPageController.init = function() {
        CommonController.registerControllerForPage(IndexPageController,'login');


    };

    IndexPageController.onPageShowed = function(options){
        console.log('index page showed with options',options);
    };


    window.IndexPageController = IndexPageController;

})();

