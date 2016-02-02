function DataApi() {}
DataApi.prototype.add_topic = function(topic) {};
DataApi.prototype.get_topics = function() {};
DataApi.prototype.get_topic_id = function(topic_id) {};

var MemoryDataApi = {
    db: {
        topics: [{
                'topicid': '100',
                'title': 'If you choose an answer to this question at random, what is the chance you will be correct?',
                'answers': [{
                    'id': '1',
                    'title': '25%',
                    'vote': 0
                }, {
                    'id': '2',
                    'title': '50%',
                    'vote': 0
                }, {
                    'id': '3',
                    'title': '60%',
                    'vote': 0
                }, {
                    'id': '4',
                    'title': '25%',
                    'vote': 0
                }],
                'state': 'opened',
                'time': 1212121221
            },

            {
                'topicid': '200',
                'title': '<p>What do you think about this glass?</p><img src = "http://s14.postimg.org/tpwkdie81/half_glass.jpg"/>',
                'answers': [{
                    'id': '1',
                    'title': 'Half Full',
                    'vote': 0
                }, {
                    'id': '2',
                    'title': 'Half empty',
                    'vote': 0
                }, {
                    'id': '3',
                    'title': 'Does not have enough ice',
                    'vote': 0
                }, {
                    'id': '4',
                    'title': 'Not a glass at all',
                    'vote': 0
                }],
                'state': 'opened',
                'time': 1212121221
            },

            {
                'topicid': '300',
                'title': 'What is more important, peace or freedom?',
                'answers': [{
                    'id': '1',
                    'title': 'Peace',
                    'vote': 0
                }, {
                    'id': '2',
                    'title': 'Freedom',
                    'vote': 0
                }],
                'state': 'opened',
                'time': 1212121221
            }
        ],
        users: []
    },
    get_topics: function(callback) {
    	var _this = this;
        // $.getJSON('https://api.mongolab.com/api/1/databases/pycademy_vote4all/collections/topics?apiKey=pqbchKrUy2Hnfoljl6bvmt5qYRUEgWpZ', function(res) {
        //     _this.db.topics = _this.db.topics.concat(res)
        //     console.log(_this.db.topics)
        //     if (callback)
        //         callback(_this.db.topics)
        // })

        if (callback)
            callback(this.db.topics)
    },
    get_topic_id: function(topicid, callback) {
        var res = this.get_topics(function(topics) {
            var res = topics.filter(function(n) {
                return n.topicid == topicid
            })
            if (callback)
                callback(res.length != 0 ? res[0] : [])
        })


    },
    add_topic: function(topic, callback) {
        var _this = this;
        this.get_topics(function(topics) {
            topic.topicid = ((topics.length + 1) * 100).toString()
            _this.db.topics.push(
                topic
            )
            // $.ajax({
            //     url: "https://api.mongolab.com/api/1/databases/pycademy_vote4all/collections/topics?apiKey=pqbchKrUy2Hnfoljl6bvmt5qYRUEgWpZ",
            //     data: JSON.stringify(topic),
            //     type: "POST",
            //     contentType: "application/json",
            //     success: function(r) {
            //         console.log('inserted')
            //     }
            // });

            if (callback)
                callback(topic)

        })
    },
    get_users: function(callback) {
        if (this.db.users.length == 0) {
            var list = [];
            for (var i = 1000; i <= 1050; i++) {
                this.db.users.push({
                    'email': i + '@pycademy.net',
                    'pass': '123456'
                });
            }
        }
        if (callback)
            callback(this.db.users)
    },
    is_auth: function(email, password, callback) {
        var usr = this.get_users(function(users) {
            var usr = users.filter(function(n) {
                return n.email == email && n.pass == password
            })
            if (callback)
                callback(usr.length == 1);
        })
    },
    make_vote: function(topicid, answerid, callback) {
        console.log(topicid)
        this.get_topic_id(topicid, function(t) {
            console.log(t)
            t.answers.filter(function(n) {
                return n.id == answerid
            })[0].vote++;
            if (callback)
                callback(t)
        })

    },
    close_topic: function(topicid, callback) {
        this.get_topic_id(topicid, function(t) {
            t.state = 'closed'
            if (callback)
                callback(t)
        })

    }
}
