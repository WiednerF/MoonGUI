describe('Directive: status-bar',function(){
    var $compile, $rootScope, element, scope;

    beforeEach(module('bmApp'));

    beforeEach(inject(function(_$compile_,_$rootScope_){
        $compile=_$compile_;
        $rootScope=_$rootScope_;
    }));

    beforeEach(function(){
        scope = $rootScope.$new();

        scope.connect = true;
        scope.running = true;
        scope.message = "test";
        scope.progress = {show : false, value: 10, max: 100};

        element = $compile('<status-bar connection-established="connect" running="running" status-message="message" progress-bar="progress"></status-bar>')(scope);
    });

    //TODO
});
