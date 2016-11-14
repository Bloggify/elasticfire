
# elasticfire

 [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/elasticfire.svg)](https://www.npmjs.com/package/elasticfire) [![Downloads](https://img.shields.io/npm/dt/elasticfire.svg)](https://www.npmjs.com/package/elasticfire) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> A flexibe and configurable module to connect Firebase with ElasticSearch.

## :cloud: Installation

```sh
$ npm i --save elasticfire
```


## :clipboard: Example



```js
const ElasticFire = require("elasticfire");

let ef = new ElasticFire({
    firebase: {
        apiKey: "AIzaSyAsFK9oDTtsCdqrHAfQKs8_TmNtBOoIkBY",
        authDomain: "emma-ea74d.firebaseapp.com",
        databaseURL: "https://emma-ea74d.firebaseio.com",
        storageBucket: "emma-ea74d.appspot.com",
        messagingSenderId: "95300595436"
    }
  , paths: [
       {
          path : "users",
          index: "firebase",
          type : "user"
       },
       {
          path  : "messages",
          index : "firebase",
          type  : "message",
          fields: ['msg', 'name'],
          filter: function(data) { return data.name !== 'system'; }
       }
    ]
});

ef.on("error", err => {
    console.error(err);
});
```

## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2013#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
