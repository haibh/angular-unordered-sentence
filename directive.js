angular.module('haibh.unordered-sentence-game', [
  'ng-sortable',
  'ngDialog'
]).directive('unorderedSentenceGame', function () {

    var link = function ($scope, $element) { // create link
      $element.on('click', function (e) {
        e.stopPropagation();
      });
      $element.on('', function (e) {
      });
    };

    return {
      controllerAs: 'unorderedSentenceGame',
      controller: ['$attrs', '$scope', '$element', '$interval', 'ngDialog', function ($attrs, $scope, $element, $interval, ngDialog) {

        /*Directive URL*/
        $scope.directiveRootPath = $attrs.directiveRootPath;
        $scope.getTemplateUrl = function () {
          return $scope.directiveRootPath + '/angular-unordered-sentence-game/templates/unordered-sentence.html';
        };


        /*Declare local variable*/
        var shuffleChars = []; // Get current words
        var scoreIncrement = 100;
        var totalTime = 3000000;
        var sentenceTime = 5000;

        /* Declare $scope variable*/
        $scope.modelSentence = 'This is an sentence'; // For detect sentence
        $scope.gameType = $attrs.gameType;
        $scope.correctWord = $scope.model.Statement;
        $scope.isCorrect = false;
        $scope.hintMsg = $scope.model.Hint;
        $scope.scoreMark = 0;

        /*Show Hide Section*/
        $scope.startVisible = false; //Show and Hide Start Section
        $scope.startShowHide = function () {
          $scope.startVisible = $scope.startVisible ? false : true;
        };

        $scope.instructionVisible = false; //Show and Hide Instruction Section
        $scope.instructionShowHide = function () {
          $scope.instructionVisible = $scope.instructionVisible ? false : true;
        };

        $scope.scoreVisible = false; //Show and Hide Score Section
        $scope.scoreShowHide = function () {
          $scope.scoreVisible = $scope.scoreVisible ? false : true;
        };

        $scope.gameVisible = false; // Show and Hide Game Section
        $scope.gameShowHide = function () {
          $scope.gameVisible = $scope.gameVisible ? false : true;
        };

        $scope.shuffeChars = function () { // Shuffle Character
          var charsArray = _.shuffle($scope.model.Statement.split($scope.gameType == 'word' ? '' : ' ')); // Shuffle original word
          // console.log(charsArray);
          $scope.draggableObjects = charsArray;
        };
        $scope.shuffeChars();

        $scope.onDropComplete = function () { // Change position
          shuffleChars = $scope.draggableObjects.join('');
          console.log(shuffleChars);
        };


        /*Add timer*/
        $scope.countDown = totalTime;
        var interval = null;

        $scope.startTimer = function () {
          $scope.stopTimer();
          interval = $interval(function () {
            $scope.countDown -= 10;
            if ($scope.countDown <= 0) {
              $scope.stopTimer();
              $scope.scoreShowHide();
              $scope.gameShowHide();
            }
          }, 10)
        };

        $scope.stopTimer = function () {
          $interval.cancel(interval);
        };

        $scope.replayTimer = function () {
          $scope.countDown = totalTime;
          interval = null;
          $scope.startTimer();
        };

        /* Add Popup from ngDialog */
        $scope.timeOverDialog = function () { // Time Over Dialog
          $scope.stopTimer();
          $scope.popupTitle = 'Time up!';
          $scope.shuffeChars();
          console.log("CountDown: " + $scope.countDown);
          console.log("Interval: " + interval)
          if ($scope.countDown <= 0) {
            $interval.cancel(interval);
          }
          $scope.countDown = totalTime;

          ngDialog.openConfirm({
            template: 'timeOverId',
            className: 'ngdialog-theme-default',
            scope: $scope
          }).then(function (value) {
              $scope.startTimer();
              console.log("Confirm");
            }, function (reason) {
              $scope.startTimer();
              console.log("TimeOver modal promise rejected. Reason: " + reason);
            }
          );
        };

        $scope.submitDialog = function () { // Submit Dialog
          $scope.stopTimer();
          interval = null;
          shuffleChars = $scope.draggableObjects.join('');
          if (shuffleChars == $scope.model.Statement) { //Checking Status
            $scope.isCorrect = true;
            $scope.scoreMark += (10 * scoreIncrement);
            $scope.submitMsg = 'Correct !';
            $scope.shuffeChars();
            $scope.countDown = totalTime;
          } else {
            $scope.scoreMark -= (2 * scoreIncrement);
            $scope.submitMsg = 'Sorry, the word you entered is not in our dictionary'
          }

          ngDialog.openConfirm({
            template: 'submitId',
            className: 'ngdialog-theme-default',
            scope: $scope
          }).then(function (value) {
              $scope.startTimer();
              console.log("Confirm");
            }, function (reason) {
              $scope.startTimer();
              console.log("Submit modal promise rejected. Reason: " + reason);
            }
          );
        };

        $scope.hintDiaglog = function (rel) { // Hint Dialog
          $scope.stopTimer();
          ngDialog.openConfirm({
            template: 'hintId',
            className: 'ngdialog-theme-default',
            scope: $scope
          }).then(function (value) {
              $scope.startTimer();
              console.log("Confirm");
            }, function (reason) {
              $scope.startTimer();
              console.log("Hint modal promise rejected. Reason: " + reason);
            }
          );
        };

      }],
      template: '<ng-include src="getTemplateUrl()"></ng-include>',
      link: link
    };
  }
);
