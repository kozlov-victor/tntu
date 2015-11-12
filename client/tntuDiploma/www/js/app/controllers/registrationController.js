'use strict';

(function(){

    var RegistrationController = {};

    var emailInput = Utils.byId('registrationEmail');
    var passwordInput = Utils.byId('registrationPassword');
    var nameInput = Utils.byId('registrationName');


    RegistrationController.init = function() {
        CommonController.registerControllerForPage(RegistrationController,'registration');
        Utils.onClick('btnRegister',function(){

            emailInput.value = emailInput.value.trim();
            passwordInput.value = passwordInput.value.trim();
            nameInput.value = nameInput.value.trim();

            var nameCheck = Validator.checkNameField(nameInput);
            if (nameCheck) {
                Validator.showInvalidBubble(nameInput,nameCheck);
                return;
            }
            var emailCheck = Validator.checkMailField(emailInput);
            if (emailCheck) {
                Validator.showInvalidBubble(emailInput,emailCheck);
                return;
            }
            var passwordCheck = Validator.checkPasswordField(passwordInput,5,26);
            if (passwordCheck) {
                Validator.showInvalidBubble(passwordInput,passwordCheck);
            }
            if (!Utils.byId('IAgree').checked) {
                Utils.alert(i18n.get('acceptEula'));
                return;
            }
            Api.
                register(nameInput.value,emailInput.value,passwordInput.value).
                then(function(data){
                    var resp = JSON.parse(data);
                    if (resp.success) {
                        var credentials = resp.credentials;
                        Api.setCredentials(credentials);
                        CommonController.showPage('main');
                    } else {
                        Utils.alert(resp.message);
                    }
                });
        });
    };

    RegistrationController.onPageShowed = function() {

    };

    RegistrationController.onPageClosed = function() {

    };

    window.RegistrationController = RegistrationController;

})();