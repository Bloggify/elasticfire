const ES = require("elasticsearch");
var elasticsearch = require('elasticsearch');
const Faker = require("faker");

var client = new elasticsearch.Client({
    hosts: [
    {
        host: 'localhost',
        port: 9200,
        log: 'trace'
    }
    ]
});

//client.index({
//    index: 'firebase',
//    type: 'user',
//    id: '5FChmLr0djTMUMyqxlmGgVpqxuQ2',
//    body: {
//        profile: {
//            email: 'ben@email.com',
//            role: 'user'
//        }
//    }
//}, (err, data) => {
//    console.log(err, data);
//});

for (var i = 0; i < 1e3; ++i) {
    console.log(i);
    client.index({
        index: 'hunts',
        type: 'hunt',
        id: i + 1,
        body: {
            name: Faker.name.title()
        }
    }, function (error, response) {
        console.log(error || response);
    });
}
