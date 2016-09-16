moonGuiApp.directive('statusBar',function(){
    return {
        restrict : 'E',
        templateUrl : 'component_templates/status-bar.html',
        scope : {
            connectionEstablished : '=',
            running : '=',
            statusMessage : '=',
            progressBar :'='
        }
    };
});