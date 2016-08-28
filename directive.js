angular.module('haibh.unordered-sentence-game', [
  'ng-sortable',
  'ngDialog'
]).directive('unorderedSentenceGame', function () {
    var shuffleChars = [], // Get current words
      scoreIncrement = 100,
      interval = null,
      totalTime = 300,
      sentenceTime = 5000;

    var link = function ($scope, $element) { // create link
      $element.on('click', function (e) {
        e.stopPropagation();
      });
      $element.on('', function (e) {
      });
    };

    /*Timer Function*/
    var startTimer = function () {
      var self = this;
      this.stopTimer();
      interval = self.interval(function () {
        self.countDown -= 1;
        if (self.countDown <= 0) {
          self.stopTimer();
          self.timeOverDialog()
        }
      }, 1000)
    };

    var stopTimer = function () {
      this.interval.cancel(interval);
    };

    var replayTimer = function () {
      this.countDown = totalTime;
      interval = null;
      this.startTimer();
    };

    var getTemplateUrl = function () {
      return this.directiveRootPath + '/angular-unordered-sentence-game/templates/unordered-sentence.html';
    };

    var timeOverDialog = function () { // Time Over Dialog
      var self = this;
      this.stopTimer();
      this.popupTitle = 'Time up!';
      this.draggableObjects =  _.shuffle(this.model.Statement.split(' '));

      if (this.countDown <= 0) {
        this.interval.cancel(interval);
      }
      this.countDown = totalTime;

      this.ngDialog.openConfirm({
        template: 'timeOverId',
        className: 'ngdialog-theme-default',
        scope: this
      }).then(function (value) {
          self.startTimer();
        }, function (reason) {
          self.startTimer();
          self.randomWords();
          console.log("TimeOver modal promise rejected. Reason: " + reason);
        }
      );
    };

    var submitDialog = function () { // Submit Dialog
      this.stopTimer();
      interval = null;
      shuffleChars = this.draggableObjects.join('');
      if (shuffleChars == this.model.Statement) { //Checking Status
        this.isCorrect = true;
        this.scoreMark += (10 * scoreIncrement);
        this.submitMsg = 'Correct !';
        this.shuffeChars();
        this.countDown = totalTime;
      } else {
        this.scoreMark -= (2 * scoreIncrement);
        this.submitMsg = 'Sorry, the word you entered is not in our dictionary'
      }

      this.ngDialog.openConfirm({
        template: 'submitId',
        className: 'ngdialog-theme-default',
        scope: this
      }).then(function (value) {
          this.startTimer();
          console.log("Confirm");
        }, function (reason) {
          this.startTimer();
          console.log("Submit modal promise rejected. Reason: " + reason);
        }
      );
    };

    var hintDiaglog = function () { // Hint Dialog
      this.stopTimer();
      this.ngDialog.openConfirm({
        template: 'hintId',
        className: 'ngdialog-theme-default',
        scope: this
      }).then(function (value) {
          this.startTimer();
          console.log("Confirm");
        }, function (reason) {
          this.startTimer();
          console.log("Hint modal promise rejected. Reason: " + reason);
        }
      );
    };

    var randomWords = function () {
      var randomNumber = _.random(0, 3);
      var listOfWords = this.listOfWOrds;
      // console.log("List: " + listOfWords);
      console.log(listOfWords[randomNumber]);

      this.model.ID = randomNumber;
      this.model.Statement = listOfWords[randomNumber][0];
      this.model.Hint = listOfWords[randomNumber][1];

      this.letterCount = this.model.Statement.length;
      this.draggableObjects = _.shuffle(this.model.Statement.split(' '));

    };

    var windowResizeChange = function () {
      this.letterWidth = this.windowsInnerWidth / (this.letterCount + 5) + 'px';


      this.sortableItemInner = {
        'width': this.letterWidth
      };
    };

    var exitWordUnscramble = function () {
      try {
        if (Native && typeof Native == "function") {
          Native("dataCallback", quizID);
        }
      }
      catch (err) {
        //logError(err);
        console.log("ERROR FUNCTION")
      }
    };

    var init = function ($attrs, $scope, $element, $interval, $http, $window, ngDialog) {

      /*Test Randomword*/
      $scope.model = {
        ID: null,
        Statement: null,
        Hint: null
      };

      // var randomNumber = _.random(0, 3);
      // var listOfWords = $scope.listOfWOrds;
      // $scope.model.ID = randomNumber;
      // $scope.model.Statement = listOfWords[randomNumber][0];
      // $scope.model.Hint = listOfWords[randomNumber][1];

      /*// Declare $scope variable*/
      $scope.directiveRootPath = $attrs.directiveRootPath;
      $scope.modelSentence = 'This is an sentence'; // For detect sentence
      $scope.gameType = $attrs.gameType;
      $scope.correctWord = $scope.model.Statement;
      $scope.isCorrect = false;
      $scope.hintMsg = $scope.model.Hint;
      $scope.scoreMark = 0;
      $scope.ngDialog = ngDialog;
      $scope.interval = $interval;
      // $scope.shuffeChars = shuffleChars;
      $scope.countDown = totalTime;

      /*Declare function for $scope*/
      // $scope.shuffeChars = shuffeCharsFn;
      $scope.getTemplateUrl = getTemplateUrl;
      $scope.startTimer = startTimer;
      $scope.stopTimer = stopTimer;
      $scope.replayTimer = replayTimer;
      $scope.submitDialog = submitDialog;
      $scope.timeOverDialog = timeOverDialog;
      $scope.hintDiaglog = hintDiaglog;
      $scope.randomWords = randomWords;
      $scope.windowResizeChange = windowResizeChange;
      $scope.exitWordUnscramble = exitWordUnscramble;

      $scope.onDropComplete = function () { // Change position
        shuffleChars = $scope.draggableObjects.join(' ');
        // console.log(shuffleChars);
        // console.log($scope.model.Statement);

        if (shuffleChars == $scope.model.Statement){
          $scope.stopTimer();
          $scope.submitMsg = 'Correct !';
          $scope.isCorrect = true;
          $scope.scoreMark += (10 * scoreIncrement);
          $scope.draggableObjects = _.shuffle($scope.model.Statement.split(' '));
          $scope.countDown = totalTime;
          $scope.randomWords();

          $scope.ngDialog.openConfirm({
            template: 'submitId',
            className: 'ngdialog-theme-default',
            scope: this
          }).then(function () {
              $scope.replayTimer();
              console.log("Confirm");
            }, function (reason) {
              $scope.replayTimer();
              console.log("Submit modal promise rejected. Reason: " + reason);
            }
          );
        }
        else {
          $scope.scoreMark -= (2 * scoreIncrement);
        }
      };

      /*Running */
      $scope.randomWords(); // Change words
      $scope.hintMsg = $scope.model.Hint;
      $scope.draggableObjects = _.shuffle($scope.model.Statement.split(' '));

      /*Edit letter size*/
      $scope.letterWidth = $window.innerWidth / ($scope.letterCount + 5) + 'px';
      $scope.sortableItemInner = { // Defaull CSS for each letter
        'width': $scope.letterWidth
      };

      angular.element($window).bind('resize', function () {
        $scope.windowsInnerWidth = $window.innerWidth;
        $scope.windowResizeChange();
      });
    };

    return {
      controllerAs: 'unorderedSentenceGame',
      controller: ['$attrs', '$scope', '$element', '$interval', '$http', '$window', 'ngDialog', function ($attrs, $scope, $element, $interval, $http, $window, ngDialog) {
        $scope.$on('UnordereSentenceCtrlModelUpdated', function (event, data) {
          $scope.listOfWOrds = data;
          // randomWords();
          // console.log("data: " + $scope.listOfWOrds);
          init($attrs, $scope, $element, $interval, $http, $window, ngDialog);
        });
      }],
      template: '<ng-include src="getTemplateUrl()"></ng-include>',
      link: link
    };
  }
);
