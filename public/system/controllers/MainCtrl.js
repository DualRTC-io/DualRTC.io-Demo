'use strict';

define(['controllers/_controllers', 'services/PollSvc'], function(controllers) {

    controllers.controller('MainCtrl', ['$scope', '$location', 'Poll', 'polls',
        function($scope, $location, Poll, polls) {
            $scope.$parent.subTitle = 'Dual Monitor System based WebRTC';

            $scope.polls = polls.list;
            $scope.count = polls.count;
        }
    ]);
});