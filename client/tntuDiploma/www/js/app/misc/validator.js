
(function(){

    var Validator = {};

    Validator.showInvalidBubble = function(input,msg) {
        var id = input.id;
        var bubbleContainer = document.querySelector('[data-validation-for='+id+']');
        if (!bubbleContainer) throw ' bubble container not specified for input with id '+id;
        var bubbleMsgContainer = bubbleContainer.querySelector('.validationErrorContainer');
        if (!bubbleMsgContainer) throw 'specify bubble message container with class validationErrorContainer';
        bubbleMsgContainer.textContent = msg;
        Utils.showElement(bubbleContainer);
        var underlinedParent = Utils.getClosestParentByClass(input,'underlined');
        if (underlinedParent) underlinedParent.classList.add('error');
    };


    Validator.checkEmail = function(input,msg) {
        var p = /^[a-zA-Z0-9\+\.\_\%\-\+]{2,32}\@[a-zA-Z0-9][a-zA-Z0-9\-]{0,32}(\.[a-zA-Z][a-zA-Z\-]{1,6})+$/;
        var v = input.value;
        var res = v.match(p);
        var isMatch = (res && res[0] && res[0].length);
        if (isMatch) return false;
        else return msg;
    };

    Validator.checkEmpty = function(input,msg){
        if (!input.value) return msg;
        return false;
    };

    Validator.checkMaxLength = function(input,maxLength,msg) {
        if (input.value.length>maxLength) return msg;
        return false;
    };

    Validator.checkMinLength = function(input,minLength,msg) {
        if (input.value.length<minLength) return msg;
        return false;
    };

    Validator.checkRange = function(input,minlength,maxLength,msg) {
        return  Validator.checkMinLength(input,minlength,msg)||
                Validator.checkMaxLength(input,maxLength,msg);
    };

    Validator.checkName = function(input,msg) {
        var p = /^([а-яёіїєА-ЯЁІЇЄa-zA-Z- ]{0,64})$/;
        var res = input.value.match(p);
        var isMatch = (res && res[0] && res[0].length);
        if (isMatch) return false;
        return msg;
    };

    Validator.checkNameField = function(input) {
        return Validator.checkEmpty(input,Utils.parametrizeQuery(i18n.get('fieldIsEmpty'),{field:i18n.get('name')})) ||
               Validator.checkRange(input,i18n.get('incorrectSymbols'));
    };


    Validator.checkMailField = function(input) {
        return Validator.checkEmpty(input,Utils.parametrizeQuery(i18n.get('fieldIsEmpty'),{field:'e-mail'}))||
               Validator.checkEmail(input,i18n.get('fieldIsNotEmail'));
    };

    Validator.checkPasswordField = function(input,minLength,maxLength) {
        if (!(minLength && maxLength)) throw 'minLength and maxLength must be specified';
        return Validator.checkRange(input,minLength,maxLength,Utils.parametrizeQuery(i18n.get('enterFieldInRange'),{min:minLength,max:maxLength}))
    };


    window.Validator = Validator;

})();