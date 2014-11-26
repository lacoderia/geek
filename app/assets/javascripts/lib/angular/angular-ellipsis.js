/**
 *	Angular directive to truncate multi-line text to visible height
 *
 *	@param bind (angular bound value to append) REQUIRED
 *	@param ellipsisAppend (string) string to append at end of truncated text after ellipsis, can be HTML OPTIONAL
 *	@param ellipsisSymbol (string) string to use as ellipsis, replaces default '...' OPTIONAL
 *	@param ellipsisAppendClick (function) function to call if ellipsisAppend is clicked (ellipsisAppend must be clicked) OPTIONAL
 *
 *	@example <p data-ellipsis data-ng-bind="boundData"></p>
 *	@example <p data-ellipsis data-ng-bind="boundData" data-ellipsis-symbol="---"></p>
 *	@example <p data-ellipsis data-ng-bind="boundData" data-ellipsis-append="read more"></p>
 *	@example <p data-ellipsis data-ng-bind="boundData" data-ellipsis-append="read more" data-ellipsis-append-click="displayFull()"></p>
 *
 */
angular.module('angular-ellipsis',[])

.directive('ellipsis', ['$timeout', '$window', function($timeout, $window) {

	return {
		restrict	: 'A',
		scope		: {
			ngBind				: '=',
			ellipsisAppend		: '@',
			ellipsisAppendClick	: '&',
			ellipsisSymbol		: '@',
            ellipsisId          : '='
		},
		compile : function(elem, attr, linker) {

			return function(scope, element, attributes) {
				/* Window Resize Variables */
				attributes.lastWindowResizeTime = 0;
				attributes.lastWindowResizeWidth = 0;
				attributes.lastWindowResizeHeight = 0;
				attributes.lastWindowTimeoutEvent = null;

				/* State Variables */
				attributes.isTruncated = false;

                /* Scope Variables */
                scope.originalAppendText = scope.ellipsisAppend;

				function buildEllipsis() {
					if (typeof(scope.ngBind) !== 'undefined') {
						var bindArray = scope.ngBind.split(" "),
							i = 0,
							ellipsisSymbol = (typeof(attributes.ellipsisSymbol) !== 'undefined') ? attributes.ellipsisSymbol : '&hellip;',
							appendString = (typeof(scope.ellipsisAppend) !== 'undefined' && scope.ellipsisAppend !== '') ? ellipsisSymbol + '&nbsp;<span>' + scope.ellipsisAppend + '</span>' : ellipsisSymbol;

						attributes.isTruncated = false;
						element.html(scope.ngBind);

						// If text has overflow
						if (isOverflowed(element)) {
							var bindArrayStartingLength = bindArray.length,
								initialMaxHeight = element[0].clientHeight;

							element.html(scope.ngBind + appendString);

							// Set complete text and remove one word at a time, until there is no overflow
							for ( ; i < bindArrayStartingLength; i++) {
								bindArray.pop();
								element.html(bindArray.join(" ") + appendString);

								if (element[0].scrollHeight < initialMaxHeight || isOverflowed(element) === false) {
									attributes.isTruncated = true;
									break;
								}
							}

							// If append string was passed and append click function included
							if (ellipsisSymbol != appendString && typeof(scope.ellipsisAppendClick) !== 'undefined' && scope.ellipsisAppendClick !== '' ) {
								element.find('span').bind("click", function (e) {
									scope.$apply(scope.ellipsisAppendClick);
								});
							}
						}
					}
				}

			   /**
				*	Test if element has overflow of text beyond height or max-height
				*
				*	@param element (DOM object)
				*
				*	@return bool
				*
				*/
				function isOverflowed(thisElement) {
					return thisElement[0].scrollHeight > thisElement[0].clientHeight;
				}

			   /**
				*	Watchers
				*/

				   /**
					*	Execute ellipsis truncate on ngBind update
					*/
					scope.$watch('ngBind', function () {
                        $timeout(function(){
                            buildEllipsis();
                        }, 0);
					});

				   /**
					*	Execute ellipsis truncate on ngBind update
					*/
					scope.$watch('ellipsisAppend', function () {
                        $timeout(function() {
                            buildEllipsis();
                        }, 0);
					});

				   /**
					*	When window width or height changes - re-init truncation
					*/
					angular.element($window).bind('resize', function () {
						$timeout.cancel(attributes.lastWindowTimeoutEvent);

						attributes.lastWindowTimeoutEvent = $timeout(function() {
							if (attributes.lastWindowResizeWidth != window.innerWidth || attributes.lastWindowResizeHeight != window.innerHeight) {
								buildEllipsis();
							}

							attributes.lastWindowResizeWidth = window.innerWidth;
							attributes.lastWindowResizeHeight = window.innerHeight;
						}, 75);
					});

                /**
                 *	Broadcasts
                 */

                    /**
                    *	Reset
                    */
                    scope.$on('ellipsis-add', function () {
                        scope.ellipsisAppend = scope.originalAppendText;
                    });

                    /**
                    *   Remove
                    */

                    scope.$on('ellipsis-remove', function (event, ellipsisId) {
                        if(scope.ellipsisId == ellipsisId) {
                            scope.ellipsisAppend = '';
                        }
                    });

			};
		}
	};
}]);