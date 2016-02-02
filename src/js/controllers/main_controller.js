pubnub = PUBNUB({
    publish_key: 'pub-c-1e129a7f-8a26-4a51-a73a-236e0819d85c',
    subscribe_key: 'sub-c-08445c68-c943-11e5-a9b2-02ee2ddab7fe'
})


app = angular.module('MyApp.controllers.Main', []);
app.db = MemoryDataApi
app.filter('unsafe', function($sce) {
    return $sce.trustAsHtml;
});
app.controller('MainController', function($scope, $location, $templateCache) {
    //Check user authorization
    $scope.signed = false
    if (!$scope.signed) {
        $location.path('login')
    }
});

app.controller('loginCtrl', function($scope, $location) {
    $scope.user = {
        'email': '1000@pycademy.net',
        'password': '123456'
    }
    $scope.login = function() {
        db.is_auth($scope.user.email, $scope.user.password, function(is_auth) {
            if (is_auth) {
                $scope.$parent.signed = true
                app.user_email = $scope.user.email;
                $location.path('/')
            }
            $scope.user = {}
        })
    }
})
app.controller('createCtrl', function($scope, $location) {

    $scope.topic = {}
    $scope.create = function() {
        var answers = $scope.topic.answers.split(',').map(function(x) {
            return {
                'id': 1,
                'title': x.trim(),
                'vote': 0
            }
        });
        for (a in answers) {
            answers[a].id = (a + 1).toString()
        }
        var new_topic = {
            'title': $scope.topic.title,
            'answers': answers,
            'state': 'opened',
            'time': Date.now()
        }
        db.add_topic(new_topic, function(t) {
                $scope.topic = {}
                $location.path('vote').search({
                    'topicid': new_topic.topicid
                })
            })
            // $scope.topic = {}
            // $location.path('vote').search({
            //     'topicid': new_topic.topicid
            // })
    }
});
app.controller('topicsCtrl', function($scope) {
    $scope.topics_loaded = false
    db.get_topics(function(topics) {
        $scope.topics = topics
        $scope.topics_loaded = true
        $scope.$apply()
    })
});
app.controller('voteCtrl', function($scope, $routeParams, $location) {
    $scope.params = $routeParams;
    $scope.topic_loaded = false;
    db.get_topic_id($routeParams.topicid, function(t) {
        $scope.topic_loaded = true;
        $scope.topic = t
        if ($scope.topic.state == 'closed') {
            $location.path('result').search({
                topicid: $scope.topic.topicid
            })
        } 


    })


    function _vote(topic, answer_id) {
        topic.answers.filter(function(n) {
            return n.id == answer_id
        })[0].vote++;
    }
    $scope.vote = function(answer_id) {
        //call server to update this
        console.log(answer_id)
        db.make_vote($scope.topic.topicid, answer_id, function(t) {
            pub({
                'topicid': $scope.topic.topicid,
                'action': 'vote',
                'answer_id': answer_id,
                'email':app.user_email
            })
        })

    }
    $scope.get_total_vote = function() {
        return $scope.topic.answers.reduce(function(s, n) {
            return n.vote + s
        }, 0);
    }

    function _close_vote() {
        $scope.topic.state = 'closed'
        $location.path('result').search({
            topicid: $scope.topic.topicid
        })

    }
    $scope.close_vote = function() {
        //call server to close vote
        //console.log($scope.get_total_vote())
        if ($scope.get_total_vote() > 30) {
            pub({
                'topicid': $scope.topic.topicid,
                'action': 'close'
            })
            db.close_topic($scope.topic.topicid, function(t) {
                    _close_vote()
                })
                //_close_vote()
        }


    }
    pubnub.subscribe({
        channel: "vote4all_" + $scope.topic.topicid,
        message: function(msg) {
            console.log(msg)
            if (msg.action == 'vote' && app.user_email != msg.email) {
                $scope.topic.answers.filter(function(n) {
                    return n.id == msg.answer_id
                })[0].vote++;


                $scope.$apply()
            } else if (msg.action == 'close') {
                _close_vote()
                $scope.$apply()
            }
        }
    })

    function pub(msg) {
        pubnub.publish({
            channel: "vote4all_" + $scope.topic.topicid,
            message: msg,
            callback: function(m) {
                console.log('CALL BACK ' + m)
            }
        })
    }
    //console.log($routeParams)
});
app.controller('resultCtrl', function($scope, $routeParams, $location) {
    $scope.params = $routeParams;
    db.get_topic_id($routeParams.topicid, function(t) {
        $scope.topic = t
        if ($scope.topic.state == 'opened') {
            $location.path('vote').search({
                topicid: $scope.topic.topicid
            })
        } 
    })


});
