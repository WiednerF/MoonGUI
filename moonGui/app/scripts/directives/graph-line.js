moonGuiApp.directive('graphLine',function(){
    return {
        restrict : 'E',
        scope : {
            id : '@',
            title: '@',
            traces: '='
        },
        link:function($scope){
            function initGraph(){
                $scope.layout={
                    title: $scope.title
                };
                //TODO
                Plotly.newPlot($scope.id,$scope.traces,$scope.layout, {showLink: false,displaylogo: false});

            }
           initGraph();
        }
    };
});
