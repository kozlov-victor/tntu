
(function(){

    // http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
    var TemplateEngine = function(html, options) {
        var match;
        var re = /<%(.+?)%>/g,
            reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
            code = 'with(obj) { var r=[];\n',
            cursor = 0,
            result;
        var add = function(line, js) {
            js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        };
        while(match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
        try { result = new Function('obj', code).apply(options, [options]); }
        catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
        return result;
    };

    var Utils = {};

    var _resolveElement = function(elOrId) {
        var res;
        if (elOrId.toUpperCase) res = document.querySelector('#'+elOrId);
        else res = elOrId;
        return res;
    };

    Utils.__resolveElement = _resolveElement;

    Utils.objectToQuery = function(o) {
        if (!o) return '';
        var paramsArr = [];
        for (var key in o) {
            paramsArr.push([key,o[key]]);
        }
        return paramsArr.map(function(item){return [item[0]+'='+item[1]]}).join('&');
    };

    Utils.Ajax = new function() {
        var Request = function(data) {
            data.method = data.method || 'get';
            var postBody = Utils.objectToQuery(data.data);
            if (postBody && data.method=='get') data.url+='?'+postBody;
            var xhr=new XMLHttpRequest();
            console.log('invoked ajax with url',data.url);
            xhr.onreadystatechange=function() {
                //console.log(xhr.readyState,xhr.status);
                if (xhr.readyState==4) {
                    if ( xhr.status==200 || xhr.status==0) {
                        //console.log('accepted',xhr.responseText);
                        if (data.success) data.success(xhr.responseText);
                    } else {
                        if (data.error) data.error({status:xhr.status,error:xhr.statusText});
                    }
                }
            };
            xhr.open(data.method,data.url,true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            if (data.beforeSend) {
                data.beforeSend(xhr);
            }
            xhr.send(postBody);
        };

        this.send = function(data) {
            new Request(data);
        }
    };

    Utils.parametrizeQuery = function(query,params) {
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var val = params[key];
                key = '{'+key+'}';
                query =query.split(key).join(val);
            }
        }
        return query;
    };

    Utils.delegate = function(elTarget,strEvent,strEvtSelector,fn) {
        elTarget.addEventListener(strEvent,function(e){
            console.log('delegated for',elTarget);
            var selectorElements = document.querySelectorAll(strEvtSelector);
            var eventElements = [e.target];
            var curr = e.target;
            while (curr.parentNode) {
                eventElements.push(curr.parentNode);
                curr = curr.parentNode;
            }
            Array.prototype.some.call(selectorElements,function(selectorElement){
                var res = false;
                Array.prototype.some.call(eventElements,function(eventElement){
                    if (selectorElement==eventElement) {
                        fn && fn(e);
                        res = true;
                        return true;
                    }
                });
                return res;
            });
        });
    };

    Utils.forEachEl = function(selector,callBack) {
        Array.prototype.forEach.call(document.querySelectorAll(selector),function(el){
            callBack(el);
        });
    };

    Utils.onReady = function(callBack) {
        var isCallBackInvoked = false;
        var run = function() {
            if (isCallBackInvoked) return;
            isCallBackInvoked = true;
            CommonController.
                init().
                then(callBack);
        };
        window.addEventListener('load',function(){
            var platform = navigator.platform||'';
            platform = platform.toLowerCase();
            if (!window.cordova) run(); // to run on desktop
        });
        document.addEventListener('deviceready', function(){
            run();
        }, false);
    };

    Utils.require = function (arr) {
        var q = new Utils.Queue();
        return new Promise(function (accept, reject) {
            q.onResolved = function () {
                accept();
            };
            arr.forEach(function (url) {
                q.addTask();
                Utils.Ajax.send({
                    url: url,
                    success: function (data) {
                        (new Function(data))();
                        q.resolveTask();
                    }
                });
            });
        });
    };

    Utils.centerVertical = function(el,centerRelativeToEl,elPosition){
        var parent = centerRelativeToEl || el.parentNode;
        var pH;
        if (centerRelativeToEl==window) pH = window.innerHeight;
        else pH = parseInt(getComputedStyle(parent).height);
        var elH = parseInt(getComputedStyle(el).height);
        var pos = (pH-elH)/2;
        el.style.position=elPosition||'relative';
        el.style.top = pos + 'px';
        el.style.visibility = 'visible';
    };


    Utils.byId = function(id) {
        return document.getElementById(id);
    };

    Utils.showElement = function(el,display) {
        el = _resolveElement(el);
        el.style.display = display||'initial';
    };

    Utils.getClosestParentByClass = function(el,classNameOfClosest) {
        var parent = el.parentNode;
        while(parent) {
            if (parent.classList.contains(classNameOfClosest)) return parent;
            parent = parent.parentNode;
        }
    };

    Utils.hideElement = function(el) {
        el = _resolveElement(el);
        el.style.display = 'none';
    };

    Utils.showDialog = function(contentId,options){
        options = options||{};
        var isModal = options.isModal==undefined?true:options.isModal;
        var shader;
        if (isModal) {
            var h = screen.height;
            if (!Utils.byId('shader')) {
                shader = document.createElement('div');
                shader.style.cssText = 'width:100%;height:'+h+'px;background-color:rgba(0,0,0,0.5);position:absolute;top:0;left:0;z-index:100;';
                shader.id='shader';
                document.body.appendChild(shader);
            } else {
                shader = Utils.byId('shader');
                Utils.showElement(shader);
            }
        }
        var contentEl = Utils.byId(contentId);
        Utils.showElement(contentEl,'block');
        Utils.centerVertical(contentEl,window,'absolute');
    };

    Utils.hideDialog = function(contentId) {
        var shader = Utils.byId('shader');
        var contentEl = Utils.byId(contentId);
        shader && Utils.hideElement(shader);
        contentEl.style.top='100px';
        Utils.hideElement(contentEl);
    };

    Utils.alert = function(txt) {
        Utils.byId('alertDialogContent').textContent = txt;
        Utils.showDialog('alertDialog');
    };

    Utils.showSpinner = function(){
        Utils.showDialog('spinnerDialog',{isModal:false});
    };



    Utils.hideSpinner = function() {
        Utils.hideDialog('spinnerDialog');
    };

    Utils.onClick = function(el,fn) {
        el = _resolveElement(el);
        if ('ontouchstart' in el) {
            el.ontouchstart = function(e){
                e.stopPropagation();
                e.preventDefault();
                fn && fn();
            };
        } else {
            el.onclick = function(e){
                e.stopPropagation();
                e.preventDefault();
                fn && fn(e);
            };
        }

    };

    Utils.onMouseUp = function(el,fn) {
        el = _resolveElement(el);
        if ('ontouchstart' in el) {
            el.ontouchend = function(e){
                e.stopPropagation();
                e.preventDefault();
                fn && fn(e);
            };
        } else {
            el.onmouseup = function(e){
                e.stopPropagation();
                e.preventDefault();
                fn && fn(e);
            };
        }
    };

    Utils.onMouseDown = function(el,fn) {
        el = _resolveElement(el);
        if ('ontouchstart' in el) {
            el.ontouchstart = function(e){
                e.stopPropagation();
                e.preventDefault();
                fn && fn(e);
            };
        } else {
            el.onmousedown = function(e){
                e.stopPropagation();
                e.preventDefault();
                fn && fn(e);
            };
        }

    };

    Utils.loadScript = function(url,callBack,error) {
        Utils.Ajax.send({
            url:url,
            success:function(data){
                console.log('loaded data: ',data);
                (new Function(data))();
                callBack();
            },
            error:function(){
                error();
            }
        });
    };

    Utils.endsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    Utils.doAutocomplete = function(inputId,dataSourceFn) {
        var input = Utils.byId(inputId);
        var acContainer = document.querySelector('[data-autocomplete-for="'+input.id+'"].autocompleteList');
        var arr = [];
        if (input.value) arr = dataSourceFn(input.value);
        acContainer.innerHTML = '';
        arr.forEach(function(el){
            var item = document.createElement('div');
            item.className = 'autocompleteItem';
            item.textContent = el['name'];
            item.data = el;
            acContainer.appendChild(item);
        });
        acContainer.onclick = function(e) {
            var el = e.target;
            acContainer.innerHTML = '';
            var elData = el.data;
            if (elData) {
                input.data = elData;
                Utils.val(input,el.data['name']);
            }
        }
    };

    Utils.val = function(input,value){
        console.log('Utils.val invoked with',input,value);
        input.value = value;
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        input.dispatchEvent(evt);
    };

    Utils.checkNumericInput = function(input,event){
        var l = input.getAttribute('maxlength');
        if (l && input.value.length>l) return false;
        return event.charCode >= 48 && event.charCode <= 57;
    };

    var templates = {};
    Utils.fromTemplate = function(templateUrl,options) {
        return new Promise(function(resolve,reject){
            var _generate = function(tmpl){
                options.i18n = Utils.i18n.getAll();
                resolve(TemplateEngine(tmpl,options));
            };
            if (templates[templateUrl]) {
                _generate(templates[templateUrl]);
            }
            else {
                Utils.Ajax.send({
                    url:templateUrl,
                    success:function(templateStr){
                        templates[templateUrl]=templateStr;
                        _generate(templateStr);
                    }
                });
            }
        });
    };

    Utils.formatDate = function(timestamp) {
        var d = new Date(timestamp);
        var date = d.getDate();
        var month = Utils.i18n.get('month'+d.getMonth());
        return date+'&nbsp;'+month;
    };

    var scrollTimerId;

    Utils.observeListOverScrollDown = function(containerId,onOverScrolledFn) {

        var mainEl = document.querySelector('main');
        var _onScroll = function(e){
            var lastEl = document.querySelector('#'+containerId+' [data-has-next="true"]');
            if (!lastEl) return;
            if (lastEl.getBoundingClientRect().top<screen.height) {
                console.log('captured overScroll');
                if (lastEl.ajaxed) return;
                lastEl.ajaxed = true;
                console.log('onOverscrollfn before invoked');
                onOverScrolledFn();
            }
        };
        var lastTop = mainEl.scrollTop;
        if ('ontouchmove' in mainEl) {
            console.log('ontouchmove');
            scrollTimerId = setInterval(function(){
                if (lastTop!=mainEl.scrollTop) {
                    lastTop = mainEl.scrollTop;
                    _onScroll();
                }
            },100);
        } else {
            mainEl.onscroll = function(e){_onScroll(e)};
        }

    };

    Utils.stopObserverListOverScroll = function() {
        console.log('stopObserverListOverScroll invoked');
        var mainEl = document.querySelector('main');
        if ('ontouchmove' in mainEl) {
            clearInterval(scrollTimerId);
        } else {
            mainEl.onscroll = null;
        }
    };

    Utils.mergeObject = function(target,source){
        for (var key in source) {
            target[key]=source[key];
        }
        return target;
    };

    var getNumOfProperties = function(o) {
        var n = 0;
        for (var key in o) n++;
        return n;
    };

    Utils.equal = function(o1,o2) {
        if (getNumOfProperties(o1)!=getNumOfProperties(o2)) return false;
        for (var key in o1) {
            if (o1[key]!=o2[key]) return false;
        }
        return true;
    };

    Utils.applyToHash = function(options) {
        var hash = '#'+Utils.objectToQuery(options);
        history.replaceState(undefined,undefined,hash);
    };

    var _i18n = {
        _locale:'ru',
        setBundle: function(name,obj){
            _i18n[name]=obj;
        },
        get: function(key){
            return _i18n[_i18n._locale][key];
        },
        getAll:function() {
            return _i18n[_i18n._locale];
        },
        setLocale: function(locale) {
            _i18n._locale = locale;
        },
        applyLocale: function(){
            Utils.forEachEl('[data-msg]',function(el){
                var key = el.getAttribute('data-msg');
                el.textContent = _i18n.get(key);
            });
            Utils.forEachEl('[data-msg-placeholder]',function(el){
                var key = el.getAttribute('data-msg-placeholder');
                el.setAttribute('placeholder',_i18n.get(key));
            });
        }
    };
    Utils.i18n = _i18n;

    Utils.Queue = function(){
        var self = this;
        this.size = function(){
            return tasksTotal;
        };
        this.onResolved = null;
        var tasksTotal = 0;
        var tasksResolved = 0;
        this.addTask = function() {
            tasksTotal++;
        };
        this.resolveTask = function(){
            tasksResolved++;
            if (tasksTotal==tasksResolved) {
                if (self.onResolved) self.onResolved();
            }
        };
    };

    Utils.clone = function(o) {
        var res = {};
        for (var key in o) {
            res[key]=o[key];
        }
        return res;
    };

    Utils.toggleClass = function(el,className) {
        el.classList.toggle(className);
    };

    window.Utils = Utils;


    //--------------CommonController-------------------

    var KEY_WORD_PAGE_ID = 'kw_pageId';
    var EXECUTE = 'execute';

    var CommonController = {};

    var retinaPrefix = (function () {
        var retinaPrefix;
        var devicePixelRatio = window.devicePixelRatio || 1;
        if (window.innerWidth>740) devicePixelRatio = 2;
        if (window.innerWidth>2000) devicePixelRatio = 3;
        switch (devicePixelRatio) {
            case 1:
                retinaPrefix = '';
                break;
            case 2:
                retinaPrefix = '@2x';
                break;
            default:
                retinaPrefix = '@3x';
                break;
        }
        return retinaPrefix;
    })();


    var applyRetinaToImages = function () {
        var DOT_PNG = '.png';
        Utils.forEachEl('img', function (img) {
            if (img.processed) return;
            img.processed = true;
            if (Utils.endsWith(img.src,'.gif')) return;
            img.src = img.src.split(DOT_PNG)[0] + retinaPrefix + DOT_PNG;
        });
    };

    var initAsyncImages = function() {
       Utils.forEachEl('[data-image-async="true"]',function(el){
           var imgSuccess = el.querySelector('[data-image="success"]');
           var imgError = el.querySelector('[data-image="error"]');
           var imgPending = el.querySelector('[data-image="pending"]');
           if (imgSuccess) {
               imgSuccess.onload = function() {
                   if (imgError) imgError.classList.add('noDisplay');
                   if (imgSuccess) imgSuccess.classList.remove('noDisplay');
                   if (imgPending) imgPending.classList.add('noDisplay');
               };
               imgSuccess.onerror = function() {
                   if (imgError) imgError.classList.remove('noDisplay');
                   if (imgSuccess) imgSuccess.classList.add('noDisplay');
                   if (imgPending) imgPending.classList.add('noDisplay');
               };
           }
       });
    };


    var hideSb = function () {
        window.StatusBar && window.StatusBar.hide();
    };

    var autoCloseDialogs = function() {
        Utils.forEachEl('[data-close-dialog="true"]',function(el){
            if (el.processedAutoClose) return;
            el.processedAutoClose = true;
            var dialog = Utils.getClosestParentByClass(el,'dialog');
            Utils.onClick(el,function(){
                Utils.hideDialog(dialog.id);
            });
        });
    };


    var initInputAutoClear = function () {
        Utils.forEachEl('[data-clearable="true"]', function (el) {
            if (el.processedAutoClear) return;
            el.processedAutoClear = true;
            var elName = el.getAttribute('name');
            var imgClear = document.querySelector('[data-clear=' + elName + ']');
            var imgFor = document.querySelector('[data-for=' + elName + ']');
            var closestRow = Utils.getClosestParentByClass(el,'underlined');
            var validationContainer = document.querySelector('[data-validation-for=' + elName + ']');
            var onValueChanged = function () {
                if (el.value) {
                    imgClear && Utils.showElement(imgClear);
                    imgFor && Utils.hideElement(imgFor);
                } else {
                    imgClear && Utils.hideElement(imgClear);
                    imgFor && Utils.showElement(imgFor);
                }
                closestRow && closestRow.classList.remove('error');
                validationContainer && Utils.hideElement(validationContainer);
            };
            el.addEventListener('keyup', function () {
                onValueChanged();
            });
            el.addEventListener('change',function(){
                onValueChanged();
            });
            el.addEventListener('focus',function() {
                closestRow.classList.add('active');
                onValueChanged();
            });
            el.addEventListener('blur',function(){
                closestRow.classList.remove('active');
            });
            if (!imgClear) return;
            imgClear.onclick = function () {
                Utils.val(el,'');
                if (el.id) localStorage.removeItem(el.id);
                el.data = null;
                el.onValueChangedEvt && el.onValueChangedEvt();
                onValueChanged();
            }
        });
    };

    var getTextAreaRows = function(ta) {
        var options = {
            recalculateCharWidth: true,
            charsMode: "random",
            fontAttrs: ["font-family", "font-size", "text-decoration", "font-style", "font-weight"]
        };

        var masterCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var counter;

        ta = Utils.__resolveElement(ta);

        var value = ta.value;
        switch (options.charsMode) {
            case "random":
                // Build a random collection of characters
                options.chars = "";
                masterCharacters += ".,?!-+;:'\"";
                for (counter = 1; counter <= 12; counter++) {
                    options.chars += masterCharacters[(Math.floor(Math.random() * masterCharacters.length))];
                }
                break;
            case "alpha":
                options.chars = masterCharacters;
                break;
            case "alpha_extended":
                options.chars = masterCharacters + ".,?!-+;:'\"";
                break;
            case "from_ta":
                // Build a random collection of characters from the textarea
                if (value.length < 15) {
                    options.chars = masterCharacters;
                } else {
                    for (counter = 1; counter <= 15; counter++) {
                        options.chars += value[(Math.floor(Math.random() * value.length))];
                    }
                }
                break;
            case "custom":
                // Already defined in options.chars
                break;
        }

        // Decode chars
        //if (!options.chars.slice) {
        options.chars = options.chars.split('');
        //}

        // Generate a span after the textarea with a random ID
        var id = "";
        for (counter = 1; counter <= 10; counter++) {
            id += (Math.floor(Math.random() * 10) + 1);
        }

        var span = document.createElement('span');
        span.id='spp';
        window.span = span;
        document.body.appendChild(span);
        span.style.visibility = 'hidden';
        span.style.display = 'inline-block';

        // Apply the font properties of the textarea to the span class
        options.fontAttrs.forEach(function(v){
            span.style[v]=getComputedStyle(ta)[v];
        });
        // Get the number of lines
        var lines = value.split("\n");
        var linesLen = lines.length;

        var averageWidth;

        // Check if the textarea has a cached version of the average character width
        if (options.recalculateCharWidth) {
            // Get a pretty good estimation of the width of a character in the textarea. To get a better average, add more characters and symbols to this list
            var chars = options.chars;

            var charLen = chars.length;
            var totalWidth = 0;

            chars.forEach(function(v){
                span.textContent = v;
                totalWidth+=parseInt(getComputedStyle(span).width);
            });

            // Store average width on textarea
            averageWidth = Math.ceil(totalWidth / charLen);
        }

        // We are done with the span, so kill it
        span.remove();

        // Determine missing width (from padding, margins, borders, etc); this is what we will add to each line width
        var missingWidth = (ta.clientWidth - parseInt(getComputedStyle(ta).width)) * 2;

        // Calculate the number of lines that occupy more than one line
        var lineWidth;

        var wrappingLines = 0;
        var wrappingCount = 0;
        var blankLines = 0;

        lines.forEach(function(v){
            // Calculate width of line
            lineWidth = ((v.length + 1) * averageWidth) + missingWidth;
            // Check if the line is wrapped
            if (lineWidth >= ta.clientWidth) {
                // Calculate number of times the line wraps
                wrappingCount += Math.floor(lineWidth / ta.clientWidth);
                wrappingLines++;
            }

            if (v && v.trim() === "") {
                blankLines++;
            }
        });

        var ret = {};
        ret["actual"] = linesLen;
        ret["wrapped"] = wrappingLines;
        ret["wraps"] = wrappingCount;
        ret["visual"] = linesLen + wrappingCount;
        ret["blank"] = blankLines;

        return ret;
    };


    var resolveDataOnClick = function() {
        Utils.forEachEl('[data-onclick]', function (el) {
            var code = el.getAttribute('data-onclick');
            var fn = new Function(code);
            Utils.onClick(el,function(){
                fn.apply(el);
            });
        });
    };

    var initAutocomplete = function() {
        Utils.forEachEl('[data-autocomplete-for]',function(el){
            if (el.processedAutoComplete) return;
            el.processedAutoComplete = true;
            var input = Utils.byId(el.getAttribute('data-autocomplete-for'));
            input.setAttribute('autocomplete','off');
            var acContainer = document.querySelector('[data-autocomplete-for="'+input.id+'"].autocompleteList');
            var calcPopupMaxHeight = function() {
                var acTop = acContainer.getBoundingClientRect().top;
                var footer = Utils.byId('footer');
                var footerHeight = parseInt(footer && getComputedStyle(footer).height)||0;
                var height = window.innerHeight - footerHeight - acTop;
                height*=0.85;
                acContainer.style.maxHeight = height + 'px';
            };
            input.addEventListener('focus',function(e){
                calcPopupMaxHeight();
            });
            window.addEventListener('resize',function(){
                calcPopupMaxHeight();
            });
            window._onResizeCustomEv = function(){
                console.log('_onResizeCustomEv');
                calcPopupMaxHeight();
            };
            var fnName = el.getAttribute('data-autocomplete-function');
            if (!fnName) throw 'not specified function with attr '+el.getAttribute('data-autocomplete-for')+' for autocomplete';
            if (!input) throw 'not specified input with attr '+el.getAttribute('data-autocomplete-for')+' for autocomplete';
            var invokeFnFromAttribute = function() {
                (new Function(fnName+'()'))();
            };
            input.addEventListener('keyup',function(e){
                console.log('input keyup');
                invokeFnFromAttribute();
            });
            input.addEventListener('focus',function() {
                Utils.forEachEl('[data-autocomplete-for]',function(el){
                    if (el.getAttribute('data-autocomplete-for')!=input.id) el.innerHTML = '';
                })
            });
            input.onValueChangedEvt = function() {
                console.log('input onValueChangedEvt');
                invokeFnFromAttribute();
            };
        });
    };

    var initCheckBoxes = function(){
        Utils.forEachEl('.iSwitch',function(el){
            if (el.initCheckBoxes) return;
            el.initCheckBoxes = true;
            var input = Utils.byId(el.dataset['for']);
            if (input && input.checked) el.classList.add('switchOn');
            Utils.onMouseDown(el,function(e){
                el.x = e.clientX;
                console.log(el.x);
                el.classList.toggle('switchOn');
                if (input) {
                    input.checked = !input.checked;
                }
            });
        })
    };


    var initAutoSave = function() {
        Utils.forEachEl('[data-autosave]',function(input){
            if (input.processedAutoSave) return;
            input.processedAutoSave = true;
            var id = input.id+'';
            var valFromLs = localStorage.getItem(id);
            if (valFromLs) {
                try {
                    var obj = JSON.parse(valFromLs);
                    obj.name && (input.value = obj.name);
                    input.data = obj;
                    if (input.onValueChangedEvt) input.onValueChangedEvt();
                } catch(e){
                    localStorage.removeItem(id);
                }
            }
            var onChanged = function(){
                if (!id) throw 'input id must be specified if data-autosave attribute present';
                if (!input.data) input.data = {};
                input.data.name=input.value;
                localStorage.setItem(id,JSON.stringify(input.data));
            };
            input.addEventListener('change',function(){
                onChanged();
            });
            input.triggerChange = function(){
                onChanged();
            }
        });
    };

    var initHashRouter = function() {
        location.hash = '#';
        window.addEventListener('hashchange',function(){
            console.log('hash changed');
            if (Utils.__ignoreHash__) {
                delete Utils.__ignoreHash__;
                return;
            }
            var hash = location.hash;
            hash = hash.replace('#','');
            var options = {};
            hash.split('&').map(function(item){
                var pair = item.split('=');
                options[pair[0]]=decodeURIComponent(pair[1]);
            });
            if (options[KEY_WORD_PAGE_ID]) {
                var page = options[KEY_WORD_PAGE_ID];
                console.log('showing page',page,options);
                _showPage(page,options);
            }
        })
    };

    var observeVirtualKeyboard = function() {
        document.addEventListener('focusin', function(e) {
            setTimeout(function(){
                window.Keyboard && window.Keyboard.shrinkView(true);
                CommonController.recalculateMainHeight();
                window._onResizeCustomEv && window._onResizeCustomEv();
            },10);
        });
        document.addEventListener('focusout', function(e) {
            setTimeout(function(){
                window.Keyboard && window.Keyboard.shrinkView(false);
                CommonController.recalculateMainHeight();
                window._onResizeCustomEv && window._onResizeCustomEv();
            },10);
        });
    };

    var resolveIncludes = function(){
        return new Promise(function(resolve,reject){
            if (!document.querySelectorAll('[data-include]').length) resolve();
            var q = new Utils.Queue();
            q.onResolved = function(){
                resolve();
            };
            Utils.forEachEl('[data-include]',function(el){
                var url = el.getAttribute('data-include');
                q.addTask();
                if (!url) {
                    console.error(el);
                    throw 'specify value as url of data-include attribute at element';
                }
                Utils.Ajax.send({
                    url:url,
                    success:function(html){
                        q.resolveTask();
                        el.innerHTML = html;
                    }
                });
            });
        });
    };

    CommonController.applyComponents = function() {
        applyRetinaToImages();
        autoCloseDialogs();
        initInputAutoClear();
        initAutocomplete();
        initAutoSave();
        initAsyncImages();
        resolveDataOnClick();
        initCheckBoxes();
        CommonController.recalculateMainHeight();
    };

    CommonController.init = function () {
        hideSb();
        initHashRouter();
        observeVirtualKeyboard();
        return new Promise(function(resolve,reject){
            resolveIncludes().
                then(function(){
                    CommonController.applyComponents();
                    navigator.splashscreen && navigator.splashscreen.hide();
                    resolve();
                });
        });

    };

    var lastShowedPageId = null;
    var _showPage = function (pageId,options) {
        var oldCtrl;
        if (pageControllerMap[lastShowedPageId]) {
            oldCtrl = pageControllerMap[lastShowedPageId];
            oldCtrl.scrollY = document.querySelector('main').scrollTop;
            oldCtrl.onBeforePageClosed && oldCtrl.onBeforePageClosed();
        }
        var pageEl = document.getElementById(pageId);
        if (!pageEl) throw 'no page with pageId '+pageId;
        Utils.forEachEl('.page', function (el) {
            if (el.id == pageId) el.classList.add('active');
            else el.classList.remove('active');
        });
        if (pageEl.getAttribute('data-center-vertical') == 'true') {
            Utils.centerVertical(pageEl);
        }
        oldCtrl && oldCtrl.onPageClosed && oldCtrl.onPageClosed();
        if (pageControllerMap[pageId]) {
            var ctrl = pageControllerMap[pageId];
            if (!ctrl.onPageShowed) throw 'specify onPageShowed function in controller registered for page '+pageId;
            document.querySelector('main').scrollTop = ctrl.scrollY||0;
            ctrl.onPageShowed(options);
        }
        CommonController.recalculateMainHeight();
        lastShowedPageId = pageId;
    };

    Utils.waitForImagesLoads = function(nodeArr){
        return new Promise(function(resolve,reject){
            var q = new Utils.Queue();
            Array.prototype.forEach.call(nodeArr,function(img){
                if (img.complete) return;
                q.addTask();
                img.onload = q.resolveTask;
            });

            if (!q.size()) resolve();
            q.onResolved = resolve;
        });
    };

    CommonController.showPage = function(pageId,options) {
        options = options||{};
        options[KEY_WORD_PAGE_ID]=pageId;
        console.log('CommonController.showPage');
        console.log(pageId,options);
        var locationParams = [];
        if (options) {
            for (var key in options) {
                locationParams.push(key+'='+(options[key]==undefined?'':encodeURIComponent(options[key])));
            }
        }
        var locationHashString = '#'+locationParams.join('&');
        console.log('locationHashString',locationHashString);
        console.log('current hash',locationHashString);
        location.hash = locationHashString;
    };

    var pageControllerMap = {};
    CommonController.registerControllerForPage = function(controller,pageId){
        pageControllerMap[pageId] = controller;
    };

    CommonController.recalculateMainHeight = function() {
        var h = window.innerHeight -
            Utils.byId('header').clientHeight -
            Utils.byId('subHeader').clientHeight -
            Utils.byId('subFooter').clientHeight -
            Utils.byId('footer').clientHeight;
        document.querySelector('main').style.height = h +'px';
        setTimeout(function(){
            window.scrollTo(0,0);
        },10);
    };



    window.CommonController = CommonController;

})();


