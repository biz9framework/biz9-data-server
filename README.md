# BiZ9-Data
**BiZ9-Data** is a object-relational mapper **(ORM)** that lets you build a clean, portable, and high-level data access layer with Node.js for data driven applications. It is the engine compartment to the [**BiZ9 Framework**](https://github.com/biz9framework). The primary libriaries are [**MongoDB**](https://www.mongodb.com/) which is a cross-platform, document-oriented database and [**Redis**](https://redis.io/), an in-memory storage, used as a distributed, in memory key-value database. **BiZ9-Data** is the **ORM** solution currently promoted for use with [**React**](https://react.dev/), [**React-Native**](https://reactnative.dev/), [**Angular**](https://angular.dev/), and [**Express.js**](http://Express.js) based projects as part of the data access stack.
## Installation
Use the [npm](https://npm.com) installer to install.

```bash
npm i biz9-data-server
```
## Required
* [MongoDB](https://www.mongodb.com/docs/manual/installation/)
* [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)
* [biz9_config](#biz9_config)

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
    // Expressjs index.js
    How to use:
    $ npm install express
    $ npm i  async
    $ npm i  biz9-adapter
    $ npm i  biz9-utility

    let express = require('express');
    let router = express.Router();
    const async = require("async");
    const { get_db_connect, close_db_connect, update_item, get_item, delete_item } = require("biz9-data-server");
    const { get_new_item, get_data_config } = require("biz9-adapter");
    const { w_error, get_id, set_form_item, error_append } = require("biz9-utility");

    // save in root file of project. filename =  biz9_config
    let biz9_config = {
        APP_TITLE_ID:'mongo_database_title',
             MONGO_IP:"0.0.0.0",
             MONGO_USERNAME_PASSWORD:"",
             MONGO_PORT_ID:"27019",
             MONGO_SERVER_USER:"admin",
             MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
             SSH_KEY:"",
             REDIS_URL:"0.0.0.0",
             REDIS_PORT_ID:"27019",
             BIZ_MAP:false,
             SERVICE_HOST_TYPE:"single"
        };

    // service_host_type options multiple for dynamic for multiple applications, single for single application. app_title_id = mongoDB database title.
    let dynamic_title = {
        app_title_id:'my_dynamic_app_title_id'
    };

    router.post("/update_form/", function(req, res) {
        let cloud_error = null;
        let db_connect,cloud_data = {};
        cloud_data.item = set_form_item(mongo_collection_title,0,req.body); # params = mongo_collection, field_id, 0 is default
        let biz9_config = get_biz9_config();
        async.series([
                //get mongoDB connection
                function(call){
                get_db_connect(get_data_config(biz9_config,dynamic_title)).then(([error,data]) => {
                        cloud_error=error_append(cloud_error,error);
                        db_connect = data;
                        call();
                        }).catch(error => {
                            w_error("Biz9-Service-Server-Crud-Update-Form-Connect",error);
                            call([error,null]);
                        });
                },
                //update data item
                function(call){
                let item = {id:0,data_type:"dt_blank",first_name:"BoB", last_name:"Smith"};
                update_item(db_connect,cloud_data.item.data_type,cloud_data.item).then(([error,data]) => {
                        cloud_error=error_append(cloud_error,error);
                        cloud_data.item = data;
                        call();
                        }).catch(error => {
                            w_error("Biz9-Service-Server-Crud-Update-Form-Update-Item",error);
                            call([error,null]);
                        });
                },
                //get data Item
                function(call){
                    let data_type="dt_blank";
                    //let id="d31facf1-769e-48a6-a7d2-6c349e4b808e"; #get exsisting data object. Guid type
                    let id = get_new_item("dt_blank", 0); # intialize new data object.
                        get_item(db_connect,cloud_data.item.data_type,cloud_data.item.id).then(([error,data]) => {
                            cloud_error=error_append(cloud_error,error);
                            cloud_data.item = data;
                            call();
                        }).catch(error => {
                            w_error("Biz9-Service-Server-Crud-Update-Form-Get-Item",error);
                            call([error,null]);
                        });

                },
                //close mongoDB connection
                function(call){
                    close_db_connect(db_connect).then(([error,data]) => {
                        cloud_error=error_append(cloud_error,error);
                        call();
                    }).catch(error => {
                        w_error("Biz9-Service-Server-Crud-Update-Form-Connect-Close",error);
                        call([error,null]);
                    });
                }
        ],
        function(err, result){
            res.send({cloud_error,cloud_data});
            res.end();
        });
});
```

### <a id="biz9_config"></a>biz9_config
The BiZ9 Config file which contains application configuration information.
#### Params
- none
#### Example
```bash
VERSION='1.0.0'
TITLE='Project-Title';
APP_TITLE_ID='mongo_database_title';
PROJECT_ID='19';
PORT_ID="1901";
REPO="git@github.com:biz9framework/biz9-service-server.git";
BRANCH="main";
MONGO_IP="0.0.0.0";
MONGO_USERNAME_PASSWORD="";
MONGO_PORT_ID="27019";
MONGO_SERVER_USER="admin";
MONGO_CONFIG_FILE_PATH='/etc/mongod.conf';
SSH_KEY="";
REDIS_URL="0.0.0.0";
REDIS_PORT_ID="27019";
BIZ_MAP=false;
SERVICE_HOST_TYPE="single";
~
```

* [get_db_connect](#get_db_connect)
### <a id="get_db_connect"></a>Get DB
    tbd
#### Params
    - biz9_config_file. Data config properties. Save this file in project root directory. Use get_data_config(data_config_file, default_app_title_id) to parse.
    biz9_config_file = {
APP_TITLE_ID:'mongo_database_title',
             MONGO_IP:"0.0.0.0",
             MONGO_USERNAME_PASSWORD:"",
             MONGO_PORT_ID:"27019",
             MONGO_SERVER_USER:"admin",
             MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
             SSH_KEY:"",
             REDIS_URL:"0.0.0.0",
             REDIS_PORT_ID:"27019",
             BIZ_MAP:false,
             SERVICE_HOST_TYPE:"single"
};
- dynamic_app_title_id. If SERVICE_HOST_TYPE property equal 'multiple' make database table unique via app_title_id value.
dynamic_title = {
app_title_id:'my_dynamic_app_title_id'
}
#### Returns
- db_connect / open client database connection / database object
#### Example
```javascript
let cloud_error = null;
let db_connect,cloud_data = {};
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
             BIZ_MAP:false,
             SERVICE_HOST_TYPE:"single"
};
let dynamic_app_title_id = {
app_title_id:'my_dynamic_app_title_id'
};

//option 1
get_db_connect(get_data_config(biz9_config_file,dynamic_app_title_id)).then(([error,data]) => {
    cloud_error=error_append(cloud_error,error);
    db_connect = data;
    }).catch(error => {
        w_error("Biz9-Service-Server-Crud-Update-Connect",error);
    });
});

//option 2
get_db_connect(data_config, {}).then(([error,data]) => {
    cloud_error=error_append(cloud_error,error);
    db_connect = data;
    }).catch(error => {
        w_error("Biz9-Service-Server-Crud-Update-Connect",error);
    });
});

```

### <a id="close_db_connect"></a>close_db_connect
Close and dispose Mongo database connection.
#### Params
- db_connect ( required ) / open client database connection / database object
#### Returns
- db_connect / Closed client database connection / database object
#### Example
```javascript
close_db_connect(db_connect).then(([error,data]) => {
    cloud_error=error_append(cloud_error,error);
    }).catch(error => {
        w_error("Biz9-Service-Server-Crud-Update-Connect-Close",error);
    });
});
```

### <a id="update_item"></a>update_item
Create and or update record in table database.
#### Params
- db_connect ( required ) / open client database connection / database object
- id ( required ) / primary key / GUID, 0 for new item
- data_type ( required ) / table name / string, ex = 'dt_blank'
- data_item ( required ) / data item object to be saved / object
#### Example
```javascript
let cloud_error = null;
let db_connect,cloud_data = {};
var cloud_data.item = {id:0, data_type:"dt_blank", first_name:"BoB", last_name:"Smith"};
update_item(db_connect,cloud_data.item.data_type,cloud_data.item).then(([error,data]) => {
    cloud_error = error_append(cloud_error,error);
    cloud_data.item = data;
}).catch(error => {
    w_error("Biz9-Service-Server-Crud-Update-Update-Item",error);
});
```

### <a id="get_item"></a>get_item
Get record from table in database by primary key field.
#### Params
- db_connect ( required ) / open client database connection / database object
- data_type ( required ) / table name / string
- id ( optional, recommended ) / primary key of record in table from database / Guid
- title_url ( optional ) / Title url of the title of the data item / string
#### Example
```javascript
let db_connect = {};
let data_type="dt_blank";
let id="d31facf1-769e-48a6-a7d2-6c349e4b808e"; #get exsisting data object. Guid
let item = get_new_item("dt_blank", id); # intialize new object item
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
        source: 'DB'
    };
}).catch(error => {
    w_error("Biz9-Service-Server-Crud-Update-Get-Item",error);
});
```

### <a id="update_item"></a>update_item
Create and or update record in table database.
#### Params
- db_connect ( required ) / open client database connection / database object
- id ( required ) / primary key / GUID
- data_type ( required ) / table name / string
- item ( required ) / data item object to be saved / object
#### Returns
- item / Data item of updated record. On create record, id field unique GUID is generated / object
#### Example
```javascript
let data_type="dt_blank";
//let id="9f1aeca3-b466-4cae-af4e-35b3fe9f31a1"; #get exsisting data object. Guid
let item = get_new_item("dt_blank", id); # intialize new object item
update_item(db_connect,data_type,id).then(([error,data]) => {
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
    w_error("Biz9-Service-Server-Crud-Update-Item",error);
});
```

### <a id="delete_item"></a>delete_item
Delete data item from table in database by filter.
#### Params
-- db_connect ( required ) / open client database connection / database object
- data_type ( required ) / table name / string
- id ( required ) / primary key / GUID
- item ( required ) / data item object to be saved / object
#### Returns
- item / Empty record from table in database. / object
#### Example
```bash
let db_connect = {};
let data_type="dt_blank";
let id="d31facf1-769e-48a6-a7d2-6c349e4b808e"; #get exsisting data object. Guid
let item = get_new_item("dt_blank", id); # intialize new object item
delete_item(db_connect,data_type,id).then(([error,data]) => {
        data =
        {
data_type: 'blank_biz',
id: '9f1aeca3-b466-4cae-af4e-35b3fe9f31a1',
cache_del: true,
db_del: true
};
}).catch(error => {
    w_error("Biz9-Service-Server-Crud-Delete-Item",error);
    });
});
```

### <a id="delete_item_list"></a>delete_item_list
Delete records in table by filter.
#### Params
- filter_object ( required ) / filter by properties object / object
- data_type ( required ) / table name / string
#### Returns
- data / empty data list / list
#### Example
```javascript
let data_type = "dt_blank";
let sql = {data_type:"blank_biz"}; #filter field and value
delete_item_list(db_connect,data_type,sql).then(([error,data]) => {
    data = [];
}).catch(error => {
    w_error("Biz9-Service-Server-Crud-Delete-Item-List",error);
});
```

### <a id="9_blank"></a>9_blank
tbd
#### Params
- none
#### Returns
- null
#### Example
```bash
-- n/a --
```

#### <a id="credit"></a>Credits

#### Company
- **BiZ9 Framework LLC**

#### Code
- [BiZ9 Framework Github](https://github.com/biz9framework)

#### E-mail
- certifiedcoderz@gmail.com

#### The BiZ9 Framework 🦾
**The BiZ9 Framework** is a developer friendly platform for building premium, polished, fast, professional and scalable business applications using the lastest rapid application development tools and techniques. The framework consists of libraries, commands, scripts, and packages for creating, maintaining, testing, and deploying both **mobile** and **website applications**. The primary 3rd party framework used are [React](https://react.dev/), [React Native](https://reactnative.dev/), [Node.js](http://Node.js), [ExpressJS](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [Nginx](https://nginx.org/), [Redis](https://redis.io/), [Git](https://git-scm.com/), and [Bash](https://www.gnu.org/software/bash/). [The BiZ9 Framework] focus is to be precise, routine, rapid, and customizable. The primary target devices for **The BiZ9 Framework** are [Apple iOS](https://developer.apple.com/), [Android](https://www.android.com/), [Chrome](https://www.google.com/chrome/), [Safari](https://www.apple.com/safari/), [Firefox](https://www.mozilla.org/en-US/firefox/), and [Edge](https://www.microsoft.com/en-us/edge/?form=MA13FJ). Other 3rd party Application Programming Interfaces (API) that are pre included are [Amazon Web Service](https://aws.amazon.com/), [Stripe](https://stripe.com/) and [Bravely](https://workbravely.com/).

- [Biz9 Framework GitHub](https://github.com/biz9framework)
- [Biz9 Framework Blog](https://bossappz.medium.com/what-is-the-biz9-framework-29731c49ad79)
- [BoSS Mobile App Youtube Demo](https://youtu.be/W_ZUmwZMFoc?si=4b5_6q9vPgi1IxPL)

#### TaNK9 Code 👽
**Brandon Poole Sr** also known as **‘TaNK’** is a technical lead and full stack software engineer with over 19 years of professional experience. He was born and raised in **Atlanta, Ga** and graduated with a [Computer Information Systems Bachelor of Science Degree] from [Fort Valley State University](https://www.fvsu.edu/). He is proficient in [ASP.NET C#](http://ASP.NET), [ASP.NET MVC](https://dotnet.microsoft.com/en-us/apps/aspnet/mvc), [.NET Core](https://dotnet.microsoft.com/en-us/download), [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server), [IIS Web Server](https://learn.microsoft.com/en-us/iis/get-started/introduction-to-iis/iis-web-server-overview), [Node.js](http://Node.js), [React](https://react.dev/), [React Native](https://reactnative.dev/), [Framework7](https://framework7.io/), [Redis](https://redis.io/), [Amazon Web Services](https://aws.amazon.com/), [Apple iOS](https://developer.apple.com/ios/), [Android SDK](https://developer.android.com/studio), [MongoDB](https://www.mongodb.com/), [Redis](https://redis.io/), [NGINX](https://nginx.org/), and [Git](https://git-scm.com/). He has worked as a software developer for Fortune 500 companies such as [The Boeing Company](https://www.boeing.com/), [Georgia Pacific](https://www.gp.com/), [Colonial Pipeline](https://www.colpipe.com/), [Home Depot] and [United Parcel Services].

He is sometimes referred to as “the real Tank” from the movie [The Matrix](https://www.imdb.com/title/tt0133093/).

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
