let express = require('express');
let router = express.Router();

const { get_db_connect,close_db_connect,update_item,get_item,delete_item } = require("biz9-data-server");

router.get('/connect', function(req, res, next) {
    let db_connect = {};
    let data_config = {
        APP_TITLE_ID:'mongo_database_app_title_id',
        MONGO_IP:"0.0.0.0",
        MONGO_USERNAME_PASSWORD:"",
        MONGO_PORT_ID:"27019",
        MONGO_SERVER_USER:"admin",
        MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
        SSH_KEY:"",
        REDIS_URL:"0.0.0.0",
        REDIS_PORT_ID:"27019",
    };
    let item =
        {
            data_type: 'dt_blank',
            id: 0,
            title: 'title_6100',
            first_name: 'first_name_6100',
            last_name: 'last_name_6100',
            user_name: 'user_name_6100',
            test_group_id: 6100
        };
    async.series([
        // get_db_connect
        function(call){
            console.log('BiZ9-Test-Connect');

            get_db_connect(data_config).then(([error,data]) => {
                db_connect = data;
                call();
            }).catch(error => {
                console.log("Biz9-Connect-Connect-Error "+ error);
                call([error,null]);
            });
        },
        // update_item
        function(call){
            console.log('BiZ9-Test-Update-Item');

            let data_type = 'dt_blank';
            let id = 0;

            update_item(db_connect,data_type,item).then(([error,data]) => {
                item = data;
                console.log(data);
                /*
                data = {
                    data_type: 'dt_blank',
                    id: 'f54d788f-9fcb-4def-889f-5b7562741c99',
                    title: 'title_6100',
                    first_name: 'first_name_6100',
                    last_name: 'last_name_6100',
                    user_name: 'user_name_6100',
                    test_group_id: 6100,
                    date_create: '2025-02-10T17:55:31.629Z',
                    date_save: '2025-02-10T17:55:31.632Z',
                    app_title_id: 'mongo_database_app_title_id',
                    source: 'DB'
                }
                */
                call();
            }).catch(error => {
                console.log("Biz9-Connect-Update-Item-Error "+ error);
                call([error,null]);
            });
        },
        // get_item
        function(call){
            console.log('BiZ9-Test-Get');

            let data_type = item.data_type;
            let id = item.id;

            get_item(db_connect,data_type,id).then(([error,data]) => {
                item = data;
                console.log(data);
                /*
                    data = {
                        _id: new ObjectId('67aa3e232d2366b62ef8988a'),
                        data_type: 'dt_blank',
                        id: '34739855-fe74-45f5-a4d1-10f73c98cb88',
                        title: 'title_6100',
                        first_name: 'first_name_6100',
                        last_name: 'last_name_6100',
                        user_name: 'user_name_6100',
                        test_group_id: 6100,
                        date_create: '2025-02-10T17:57:55.024Z',
                        date_save: '2025-02-10T17:57:55.026Z',
                        source: 'DB'
                    }
                    */
                call();
            }).catch(error => {
                console.log("Biz9-Connect-Get-Item-Error "+ error);
                call([error,null]);
            });
        },
        // delete_item
        function(call){
            console.log('BiZ9-Test-Delete');

            let data_type = item.data_type;
            let id = item.id;

            delete_item(db_connect,data_type,id).then(([error,data]) => {
                item = data;
                console.log(data);
                /*
                data = {
                    data_type: 'dt_blank',
                    id: 'ab70a896-5d65-422d-b12f-0c701f2cc95d',
                    cache_del: true,
                    db_del: true
                }
                */
                call();
            }).catch(error => {
                console.log("Biz9-Connect-Delete-Item-Error "+ error);
                call([error,null]);
            });
        },
        // get_item_2
        function(call){
            console.log('BiZ9-Test-Get-2');

            let data_type = item.data_type;
            let id = item.id;

            get_item(db_connect,data_type,id).then(([error,data]) => {
                item = data;
                console.log(data);
                /*
                data = {
                    data_type: 'dt_blank',
                    id: 'a99a3d27-0a87-4fb3-9d5a-7bb66748f0bb',
                    app_title_id: 'mongo_database_app_title_id',
                    source: 'NOT-FOUND'
                }
                */
                call();
            }).catch(error => {
                console.log("Biz9-Connect-Get-Item-2-Error "+ error);
                call([error,null]);
            });
        },
        // close_db_connect
        function(call){
            console.log('BiZ9-Test-Connect');

            close_db_connect(db_connect).then(([error,data]) => {
                call();
            }).catch(error => {
                console.log("Biz9-Connect-Close-Error "+ error);
                call([error,null]);
            });
        },
    ],
        function(err, result){
            res.send({item:item});
            res.end();
        });
});
module.exports = router;

