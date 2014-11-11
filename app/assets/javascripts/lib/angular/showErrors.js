(function() {
    var showErrorsModule;

    showErrorsModule = angular.module('ui.bootstrap.showErrors', []);

    showErrorsModule.directive('showErrors', [
        '$timeout', 'showErrorsConfig', function($timeout, showErrorsConfig) {
            var getShowSuccess, getTrigger, linkFn;
            getTrigger = function(options) {
                var trigger;
                trigger = showErrorsConfig.trigger;
                if (options && (options.trigger != null)) {
                    trigger = options.trigger;
                }
                return trigger;
            };
            getShowSuccess = function(options) {
                var showSuccess;
                showSuccess = showErrorsConfig.showSuccess;
                if (options && (options.showSuccess != null)) {
                    showSuccess = options.showSuccess;
                }
                return showSuccess;
            };
            linkFn = function(scope, el, attrs, formCtrl) {
                var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses, trigger;
                blurred = false;
                options = scope.$eval(attrs.showErrors);
                showSuccess = getShowSuccess(options);
                trigger = getTrigger(options);
                inputEl = el[0].querySelector('.form-control[name]');
                inputNgEl = angular.element(inputEl);
                inputName = inputNgEl.attr('name');
                if (!inputName) {
                    throw "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class";
                }
                inputNgEl.bind(trigger, function() {
                    blurred = true;
                    return toggleClasses(formCtrl[inputName].$invalid);
                });
                scope.$watch(function() {
                    return formCtrl[inputName] && formCtrl[inputName].$invalid;
                }, function(invalid) {
                    if (!blurred) {
                        return;
                    }
                    return toggleClasses(invalid);
                });
                scope.$on('show-errors-check-validity', function(event, currentForm) {
                    if (currentForm[inputName]) {
                        return toggleClasses(currentForm[inputName].$invalid);
                    }
                });
                scope.$on('show-errors-reset', function() {
                    return $timeout(function() {
                        el.removeClass('has-error');
                        el.removeClass('has-success');
                        return blurred = false;
                    }, 0, false);
                });
                return toggleClasses = function(invalid) {
                    if (scope.showErrorsParams){
                        if (!scope.showErrorsParams.length) {
                            el.toggleClass('has-error', true);
                            formCtrl[inputName].popoverMessage = 'Se debe agregar al menos un elemento';
                        } else {
                            el.toggleClass('has-error', false);
                            formCtrl[inputName].popoverMessage = '';
                        }
                    } else {
                        el.toggleClass('has-error', invalid);

                        var $elementScope = angular.element(el).scope();
                        if(invalid) {
                            if (formCtrl[inputName].$error.required == true) {
                                formCtrl[inputName].popoverMessage = 'Este campo es requerido';
                            } else if (formCtrl[inputName].$error.minlength == true) {
                                formCtrl[inputName].popoverMessage = 'El campo no cumple con la longitud mínima';
                            } else if (formCtrl[inputName].$error.maxlength == true) {
                                formCtrl[inputName].popoverMessage = 'El campo no cumple con la longitud máxima';
                            } else {
                                formCtrl[inputName].popoverMessage = ''
                            }
                        } else {
                            formCtrl[inputName].popoverMessage = '';
                        }
                    }

                    if (showSuccess) {
                        return el.toggleClass('has-success', !invalid);
                    }

                };
            };
            return {
                restrict: 'A',
                require: '^form',
                compile: function(elem, attrs) {
                    if (!elem.hasClass('form-group')) {
                        throw "show-errors element does not have the 'form-group' class";
                    }
                    return linkFn;
                },
                scope: {
                    showErrorsParams: '=showErrorsParams'
                }
            };
        }
    ]);

    showErrorsModule.provider('showErrorsConfig', function() {
        var _showSuccess, _trigger;
        _showSuccess = false;
        _trigger = 'blur';
        this.showSuccess = function(showSuccess) {
            return _showSuccess = showSuccess;
        };
        this.trigger = function(trigger) {
            return _trigger = trigger;
        };
        this.$get = function() {
            return {
                showSuccess: _showSuccess,
                trigger: _trigger
            };
        };
    });

}).call(this);