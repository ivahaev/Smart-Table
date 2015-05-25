ng.module('smart-table')
  .directive('stPipe', ['stConfig', '$timeout', function (config, $timeout) {
    return {
      require: 'stTable',
      scope: {
        stPipe: '='
      },
      link: {

        pre: function (scope, element, attrs, ctrl) {

          var pipePromise = null;
          var counter = 0;
          var interval = setInterval(function(){
            if (ng.isFunction(scope.stPipe)) {
              clearInterval(interval);
              ctrl.preventPipeOnWatch();
              ctrl.pipe = function () {

                if (pipePromise !== null) {
                  $timeout.cancel(pipePromise)
                }

                pipePromise = $timeout(function () {
                  scope.stPipe(ctrl.tableState(), ctrl);
                }, config.pipe.delay);

                return pipePromise;
              };
              ctrl.pipe();
            } else {
              counter++;
              if (counter === 50) {
                clearInterval(interval);
              }
            }
          }, 100);

        },

        post: function (scope, element, attrs, ctrl) {
          ctrl.pipe();
        }
      }
    };
  }]);
