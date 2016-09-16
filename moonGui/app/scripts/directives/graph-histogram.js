moonGuiApp.directive('graphHistogram',function(){
    return {
        restrict : 'E',
        template : '<div id="histogram{{ id }}"></div>',
        scope : {
            id : '='
        },
        link:function(scope,element){
            function init(){
                element.html('<div id="histogram'+scope.id+'"></div>');
                scope.$on('$viewContentLoaded', initGraph());
            }
            function initGraph(){
                var x = [];
                for (var i = 0; i < 500; i ++) {
                    x[i] = Math.random();
                }

                var data = [
                    {
                        x: x,
                        type: 'histogram',
                        marker: {
                            color: 'rgba(100,250,100,0.7)',
                        },
                    }
                ];
                //TODO
                Plotly.newPlot('histogram'+scope.id, data);
            }
            init();
            //TODO

        }
    };
});
