# BiZ9 Data Server
**The BiZ9-Data-Server Package** is an **object-relational mapper** (ORM) that lets you build a clean, portable, reusable, and high-level data access layer with [**Node.js**](http://Node.js) for data driven applications. The package consists of **create**, **read**, **update** and **destroy** (CRUD) methods to handle data access and manipulations. The framework is fast and used for rapid application development for scaling applications from 0 to millions of records seamlessly and effortless. New data is written and persisted to the [**MongoDB**](https://www.mongodb.com/) tables/collections. Fetching data is obtained from the server cache memory using [**Redis**](https://redis.io/). Using **MongoDB** with **Redis** speeds up the overall application tremendously.
This framework is used as a [data access component] for **mobile** and **website applications**. It is best suited to be used as a package within [**Express.js**](http://Express.js). It can also be utilized for other **Javascript** based applications.

This framework is used as a **data access component** for **mobile** and **website applications**. It is best suited to be used as a package within [**Express.js**](http://Express.js). It can also be utilized for other **Javascript** based applications.

**The BiZ9-Data-Server** is the **ORM** solution currently promoted for use with [**React**](https://react.dev/), [**React-Native**](https://reactnative.dev/), [**Angular**](https://angular.dev/), and web based projects as a component of the [**data access stack**](https://angular.dev/).

![Mongo and Redis Chart](https://github.com/biz9framework/biz9-data-server/blob/main/img/mongo-redis.jpg?raw=true)

## Installation
Use the [npm](https://npm.com) installer to install.

```bash
npm i biz9-data-server
```

## Required
* [MongoDB](https://www.mongodb.com/docs/manual/installation/)
* [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)

## Contents
* [Example with Express.js](#expressjsexample)
* [get_db_connect](#get_db_connect)
* [close_db_connect](#close_db_connect)
* [update_item](#update_item)
* [get_item](#get_item)
* [delete_item](#delete_item)
* [get_item_list](#get_item_list)
* [update_item_list](#update_item_list)
* [delete_item_list](#delete_item_list)
* [Credit](#credit)

### <a id="expressjsexample"></a>Example with Express.js
```node
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

// - index.js start - //

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
     SERVICE_HOST_TYPE:"single" /* options = single, multiple*/
 };
 let dynamic_title = {
     app_title_id:'my_dynamic_app_title_id'
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

         get_db_connect(data_config, dynamic_title).then(([error,data]) => {
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
// - index.js end - //

```

* [get_db_connect](#get_db_connect)
### <a id="get_db_connect"></a>Get DB
    Intialize and open Db connection.
#### Params
- Data config / DB configuration settings / object
    ```javascript
    let data_config = {
        APP_TITLE_ID:'mongo_database_title',
        MONGO_IP:"0.0.0.0",
        MONGO_USERNAME_PASSWORD:"",
        MONGO_PORT_ID:"27019",
        MONGO_SERVER_USER:"admin",
        MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
        SSH_KEY:"",
        REDIS_URL:"0.0.0.0",
        REDIS_PORT_ID:"27019",
        SERVICE_HOST_TYPE:"single" /* options: single, multiple */
    };
    ```
- dynamic_app_title_id / Dynamic app title id based on SERVICE_HOST_TYPE / options: single, multiple. / object
    ```javascript
    let dynamic_title = {
        app_title_id:'my_dynamic_app_title_id'
    };
    ````

#### Returns
- error / Error message / string
- db_connect / Open client Db connection / object
#### Example
```javascript
let db_connect = {};
let data_config = {
    APP_TITLE_ID:'mongo_database_title',
    MONGO_IP:"0.0.0.0",
    MONGO_USERNAME_PASSWORD:"",
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:"admin",
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019",
    SERVICE_HOST_TYPE:"single" /* options: single, multiple */
};
let dynamic_app_title_id = {
app_title_id:'my_dynamic_app_title_id'
};

get_db_connect(data_config, dynamic_app_title_id).then(([error,data]) => {
    db_connect = data;
}).catch(error => {
    console.log(error);
});

```

### <a id="close_db_connect"></a>close_db_connect
Close Db connection.
#### Params
- db_connect / Open client Db connection / object
#### Returns
- error / Error message / string
- db_connect / Closed client Db connection / object
#### Example
```javascript
close_db_connect(db_connect).then(([error,data]) => {
}).catch(error => {
    console.log(error);
});
```

### <a id="get_item"></a>get_item
Get a data item.
#### Params
- db_connect / Open client Db connection / object
- data_type / collection title / string
- id / ( optional ) / Primary key / GUID
#### Returns
- error / Error message / string
- item / Data item / object
#### Example
```javascript
let data_type="dt_blank";
let id="d31facf1-769e-48a6-a7d2-6c349e4b808e";
get_item(db_connect,data_type,id).then(([error,data]) => {
    data = {
        data_type: 'dt_blank',
        id: 'd31facf1-769e-48a6-a7d2-6c349e4b808e',
        title: 'title_450',
        first_name: 'first_name_450',
        last_name: 'last_name_450',
        user_name: 'user_name_450',
        test_group_id: 450,
        date_create: '2025-02-10T02:16:46.137Z',
        date_save: '2025-02-10T02:16:46.138Z',
        app_title_id: 'mongo_database_title',
        source: 'CACHE'
    };
}).catch(error => {
    console.log(error);
});
```

### <a id="update_item"></a>update_item
Create and or update data item.
#### Params
- db_connect / Open client Db connection / object
- id / Primary key / GUID
- data_type / collection title / string
- item / data item  / object
#### Returns
- error / Error message / string
- item / Data item / object
#### Example
```javascript
let data_type="dt_blank";
let id = 0; // Intialize new data item, id = 0
//let id="9f1aeca3-b466-4cae-af4e-35b3fe9f31a1";  // Get exsisting data item. Guid
let item = {
    id: id,
    data_type:data_type,
    title: 'title_438',
    first_name: 'first_name_438',
    last_name: 'last_name_438',
    user_name: 'user_name_438',
    test_group_id: 438
};
update_item(db_connect,data_type,id,item).then(([error,data]) => {
        data = {
            data_type: 'dt_blank',
            id: '9f1aeca3-b466-4cae-af4e-35b3fe9f31a1',
            title: 'title_438',
            first_name: 'first_name_438',
            last_name: 'last_name_438',
            user_name: 'user_name_438',
            test_group_id: 438,
            date_create: '2025-02-10T02:16:46.137Z',
            date_save: '2025-02-10T02:16:46.138Z',
            app_title_id: 'mongo_database_title',
            source: 'DB'
        }
}).catch(error => {
    console.log(error);
});
```

### <a id="delete_item"></a>delete_item
Delete data item.
#### Params
- db_connect / Open client Db connection / object
- data_type / Collection title / string
- id / Primary key / GUID
#### Returns
- error / Error message / string
- data / Empty data item. / object
#### Example
```bash
let data_type="dt_blank";
let id="d31facf1-769e-48a6-a7d2-6c349e4b808e";
delete_item(db_connect,data_type,id).then(([error,data]) => {
        data =
        {
            data_type: 'dt_blank',
            id: 'd31facf1-769e-48a6-a7d2-6c349e4b808e',
            cache_del: true,
            db_del: true
        };
}).catch(error => {
    console.log(error);
});
```

### <a id="delete_item_list"></a>delete_item_list
Delete data items.
#### Params
- db_connect / Open client Db connection / object
- filter_object / Filter  / object
- data_type / Collection title / string
#### Returns
- error / Error message / string
- data / Empty data list / list
#### Example
```javascript
let data_type = "dt_blank";
let sql = {data_type:data_type}; //filter field and value
delete_item_list(db_connect,data_type,sql).then(([error,data]) => {
    data = [];
}).catch(error => {
    console.log(error);
});
```

#### <a id="credit"></a>Credits

#### Company
- **BiZ9 Framework LLC**

#### Code
- [BiZ9 Framework Github](https://github.com/biz9framework)

#### E-mail
- certifiedcoderz@gmail.com

#### The BiZ9 Framework 🦾
![BiZ9 Framework Logo](https://github.com/biz9framework/biz9-art/blob/bbdba253e9b36e9eb88ce76d4982f09ee1379e05/biz9-framework/logo/logox400.png)

**The BiZ9 Framework** is a developer friendly platform for building premium, polished, fast, professional and scalable business applications using the lastest rapid application development tools and techniques. The framework consists of libraries, commands, scripts, and packages for creating, maintaining, testing, and deploying both **mobile** and **website applications**. The primary 3rd party framework used are [**React**](https://react.dev/), [**React Native**](https://reactnative.dev/), [**Node.js**](http://Node.js), [**ExpressJS**](https://expressjs.com/), [**MongoDB**](https://www.mongodb.com/), [**Nginx**](https://nginx.org/), [**Redis**](https://redis.io/), [**Git**](https://git-scm.com/), and [**Bash**](https://www.gnu.org/software/bash/). [The BiZ9 Framework] focus is to be precise, routine, rapid, and customizable. The primary target devices for **The BiZ9 Framework** are [**Apple iOS**](https://developer.apple.com/), [**Android**](https://www.android.com/), [**Chrome**](https://www.google.com/chrome/), [**Safari**](https://www.apple.com/safari/), [**Firefox**](https://www.mozilla.org/en-US/firefox/), and [**Edge**](https://www.microsoft.com/en-us/edge/?form=MA13FJ). Other 3rd party Application Programming Interfaces (API) that are pre included are [**Amazon Web Service**](https://aws.amazon.com/), [**Stripe**](https://stripe.com/) and [**Bravely**](https://workbravely.com/).

- [Biz9 Framework GitHub](https://github.com/biz9framework)
- [Biz9 Framework Blog](https://bossappz.medium.com/what-is-the-biz9-framework-29731c49ad79)
- [BoSS Mobile App Youtube Demo](https://youtu.be/W_ZUmwZMFoc?si=4b5_6q9vPgi1IxPL)

#### TaNK9 Code 👽
**Brandon Poole Sr** also known as **‘TaNK’** is a technical lead and full stack software engineer with over 19 years of professional experience. He was born and raised in **Atlanta, Ga** and graduated with a [**Computer Information Systems Bachelor of Science Degree**] from [**Fort Valley State University**](https://www.fvsu.edu/). He is proficient in [**ASP.NET C#**](http://ASP.NET), [**ASP.NET MVC**](https://dotnet.microsoft.com/en-us/apps/aspnet/mvc), [**.NET Core**](https://dotnet.microsoft.com/en-us/download), [**Microsoft SQL Server**](https://www.microsoft.com/en-us/sql-server), [**IIS Web Server**](https://learn.microsoft.com/en-us/iis/get-started/introduction-to-iis/iis-web-server-overview), [**Node.js**](http://Node.js), [**React**](https://react.dev/), [**React Native**](https://reactnative.dev/), [**Framework7**](https://framework7.io/), [**Redis**](https://redis.io/), [**Amazon Web Services**](https://aws.amazon.com/), [**Apple iOS**](https://developer.apple.com/ios/), [**Android SDK**](https://developer.android.com/studio), [**MongoDB**](https://www.mongodb.com/), [**Redis**](https://redis.io/), [**NGINX**](https://nginx.org/), and [**Git**](https://git-scm.com/). He has worked as a software developer for Fortune 500 companies such as [**The Boeing Company**](https://www.boeing.com/), [**Georgia Pacific**](https://www.gp.com/), [**Colonial Pipeline**](https://www.colpipe.com/), [**Home Depot**] and [**United Parcel Services**].

He is sometimes referred to as “the real Tank” from the movie [**The Matrix**](https://www.imdb.com/title/tt0133093/).

- [Tank9Code Blog](https://medium.com/@tank9code/about-brandon-poole-sr-ac2fe8e06a09)
- [Tank9Code Twitter](https://instagram.com/tank9code)
- [Tank9Code Instagram](https://instagram.com/tank9code)
- [Tank9Code Youtube](https://youtube.com/@tank9code)

#### TagZ:
##### #BoSSAppZ
##### #BiZ9Framework
##### #EBook
##### #Mobile
##### #Apple
##### #Android
##### #IOS
##### #Linux
##### #AmazonWebServices
##### #AppMoneyNoteZ
##### #TaNK9Code
##### Thank you for your time.
#####  Looking forward to working with you.
### License
[MIT](https://choosealicense.com/licenses/mit/)
