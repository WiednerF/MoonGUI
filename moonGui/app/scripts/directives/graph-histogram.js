moonGuiApp.directive('graphHistogram',function(){
    return {
        restrict : 'E',
        scope : {
            id : '@',
            points: '=',
            title: '@',
            yaxis: '=',
            xaxis: '=',
            binx: '='
        },
        link:function($scope){
            function init(){
                initGraph();
            }
            function initGraph(){
                $scope.data = [
                    {
                        x: $scope.points,
                        type: 'histogram',
                        autobinx: false,
                        xbins: $scope.binx
                    }
                ];
                $scope.layout = {
                    title: $scope.title,
                    bargap: 0.05,
                    bargroupgap: 0.2,
                    xaxis: $scope.xaxis,
                    yaxis: $scope.yaxis
                }
                Plotly.newPlot($scope.id,[$scope.data],$scope.layout, {showLink: false,displaylogo: false});

            }
            init();
            $scope.$watch('points.length', function () {//Must use apply for getting changes
                var update =  {
                    x: [$scope.points],
                    type: 'histogram',
                    autobinx: false,
                    xbins: $scope.binx
                };
                var elem = document.getElementById($scope.id);
                Plotly.restyle(elem,update);
            }, true);


        }
    };
});
