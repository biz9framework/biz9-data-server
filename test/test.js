/*

* Express.JS BiZ9-Service Sample App

* Required
    - $ npm i mocha
    - $ npm i express
    - $ npm i axios

* Test Files
    - app.js = app Express server configuration file.
    - test.js = Mocha test sample.
    - index.js = controller for url

* $> mocha -g 'connect' test.js

*/

const axios = require('axios');
const { get_db_connect,close_db_connect,update_item,get_item,delete_item } = require("biz9-data-server");

describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        console.log('TEST-Connect-Start');
        let item_test =
            {
                data_type: 'dt_blank',
                id: 0,
                title: 'title_6100',
                first_name: 'first_name_6100',
                last_name: 'last_name_6100',
                user_name: 'user_name_6100',
                test_group_id: 6100
            };
        let url = "http://localhost:1901/connect?app_title_id=dynamic_app_title_id";
        axios.get(url, {
            data: item_test
        })
            .then(function (response) {
                console.log(response.data.cloud_error);
                console.log(response.data.cloud_data);
                console.log('BIZ9-TEST-CONNECT-SUCCESS');
            })
            .catch(function (error) {
                console.log("TEST-BIZ9-Connect-ERROR"+ " " + error);
            });
    });
});


