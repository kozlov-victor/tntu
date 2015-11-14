'use strict';

(function(){

    var LoginPageController = {};




    LoginPageController.init = function() {
        CommonController.registerControllerForPage(LoginPageController,'login');

        Utils.onClick('btnLogin',function(){
            var emailInput = Utils.byId('email');
            var passwordInput = Utils.byId('pass');
            var emailCheck = Validator.checkMailField(emailInput);
            if (emailCheck) {
                Validator.showInvalidBubble(emailInput,emailCheck);
                return;
            }
            var passwordCheck = Validator.checkPasswordField(passwordInput,5,26);
            if (passwordCheck) {
                Validator.showInvalidBubble(passwordInput,passwordCheck);
                return;
            }
            Api.
                authorize(emailInput.value,passwordInput.value).
                then(function(data){
                    var credentials = JSON.parse(data);
                    console.log(credentials);
                    if (credentials.status!=200) {
                        Utils.alert(credentials.message);
                    } else {
                        console.log('authorizated');
                        var cr = credentials.data.udata;
                        cr.token = credentials.data.token;
                        Api.setCredentials(cr);
                    }
                });
        });


    };

    LoginPageController.onPageShowed = function(options){

    };


    window.LoginPageController = LoginPageController;

})();
