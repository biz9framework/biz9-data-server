/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Base
*/
const async = require('async');
const { get_title_url,w_error } = require("biz9-utility");
const {get_new_item,set_biz_item} = require("biz9-app");
const {get_db_connect_main,check_db_connect_main,close_db_connect_main,update_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,count_item_list_main} = require('./mongo/index.js');
const {get_cache_connect_main,close_cache_connect_main,get_cache_string_main,delete_cache_string_main,set_cache_string_main} = require('./redis/index.js');
const DB_TITLE='DB';
const CACHE_TITLE='CACHE';
const NOT_FOUND_TITLE='NOT-FOUND';
const get_db_connect_adapter = (db_name) => {
    return new Promise((callback) => {
        get_db_connect_main(db_name).then(([error,data]) => {
            callback([error,data]);
        }).catch(error => {
            w_error("Data-Adapter-Get-DB-Adapter",error);
            callback([error,null]);
        });
    });
}
const close_db_connect_adapter = (db_connect) => {
    return new Promise((callback) => {
        close_db_connect_main(db_connect).then(([error,data])=> {
            callback([error,data]);
        }).catch(error => {
            w_error("Data-Adapter-Close-DB-Connect-Adapter",error);
            callback([error,null]);
        });
    });
}
const check_db_connect_adapter = (db_connect) => {
    return check_db_connect_main(db_connect);
}
const update_item_list_adapter = (db_connect,item_data_list,options) => {
    return new Promise((callback) => {
        let cache_connect = {};
        let item_data_new_list = [];
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Update-Item-List-Adapter",error);
                    callback([error,null]);
                });
            },
            function(call){
                async.forEachOf(item_data_list,(item,key,go)=>{
                    for(property in item[key]){
                        if(property!='id'&&property!='data_type'){
                            if(!item[key][property]){
                                delete item[key][property];
                            }
                        }
                    }
                    go();
                }, error => {
                    if(error){
                        error=error;
                    }
                    call();
                });
            },
            function(call){
                async.forEachOf(item_data_list,(item,key,go)=>{
                    if(item){
                        update_item_main(db_connect,item.data_type,item).then(([error,data]) => {
                            item.id=data.id;
                            if(data){
                                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(item.data_type,data.id)).then(([error,data]) => {
                                    go();
                                }).catch(error => {
                                    w_error("Data-Adapter-Update-Item-List-2",error);
                                    callback([error,null]);
                                });
                            }else{
                                go();
                            }
                        }).catch(error => {
                            w_error("Data-Adapter-Update-Item-List-3",error);
                            callback([error,null]);
                        });
                    }else{
                        go();
                    }
                }, error => {
                    if(error){
                        error=error;
                    }
                    call();
                });
            },
            async function(call) {
                for(const item of item_data_list) {
                    const [error,data] = await set_biz_item(item,options);
                    item_data_new_list.push(data);
                }
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Update-Item-List-4-Error",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            callback([error,item_data_new_list]);
        }).catch(error => {
            w_error("Data-Adapter-Update-Item-List-5",error);
            callback([error,null]);
        });
    });
}
const update_item_adapter = (db_connect,data_type,item_data,options) => {
    return new Promise((callback) => {
        let cache_connect = {};
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Update-Item-Adapter",error);
                    callback([error,null]);
                });
            },
            function(call) {
                if(item_data.photo_obj){
                    delete item_data.photo_obj;
                }
                if(item_data.date_obj){
                    delete item_data.date_obj;
                }
                if(item_data.title){
                    item_data.title_url=get_title_url(item_data.title);
                }
                call();
            },
            function(call){
                update_item_main(db_connect,data_type,item_data).then(([error,data]) => {
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Update-Item-Adapter-2",error);
                    callback([error,null]);
                });
            },
            function(call){
                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(item_data.data_type,item_data.id)).then(([error,data]) => {
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Update-Item-Adapter-3",error);
                    callback([error,null]);
                });
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Update-Item-Adapter-4",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            set_biz_item(item_data,options).then(([error,data]) => {
                callback([error,data]);
            }).catch(error => {
                w_error("Data-Adapter-Update-Item-Adapter-5-Error",error);
                callback([error,null]);
            });
        }).catch(error => {
            w_error("Data-Adapter-Update-Item-Adapter-END",error);
            callback([error,null]);
        });
    });
}
const get_item_list_adapter = (db_connect,data_type,sql,sort_by,page_current,page_size,options) => {
    return new Promise((callback) => {
        let cache_connect = {};
        let item_data_count = 0;
        let item_id_list = [];
        let item_data_list = [];
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    w_error("Get-Item-List-Adapter",error);
                    callback([error,null]);
                });
            },
            function(call) {
                get_id_list_main(db_connect,data_type,sql,sort_by,page_current,page_size).then(([error,total_count,data_list]) => {
                    error=error;
                    item_data_count=total_count;
                    item_id_list=data_list;
                    call();
                }).catch(error => {
                    w_error("Get-Item-List-Adapter-2",error);
                    callback([error,null]);
                });
            },
            async function(call) {
                for(const item of item_id_list) {
                    [error,data] = await get_item_cache_db(cache_connect,db_connect,data_type,item.id,options);
                    if(data){
                        item_data_list.push(data);
                    }
                }
            },
        ]).then(result => {
            callback([error,item_data_list,item_data_count,Math.round(item_data_count/page_size+1)]);
        }).catch(error => {
            w_error("Get-Item-List-Adapter-3",error);
            callback([error,null]);
        });
    });
}
const get_item_adapter = (db_connect,data_type,id,options) => {
    return new Promise((callback) => {
        let cache_connect = {};
        let cache_found = false;
        let cache_key_list = null;
        let item_data = get_new_item(data_type,id);
        let cache_string_list = [];
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    w_error("Adapter-Get-Item-Adapter",error);
                    callback([error,null]);
                });
            },
            function(call) {
                get_item_cache_db(cache_connect,db_connect,data_type,id,options).then(([error,data]) => {
                    item_data = data;
                    call();
                }).catch(error => {
                    w_error("Adapter-Get-Item-Adapter-2",error);
                    callback([error,null]);
                });
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    w_error("Adapter-Get-Item-Adapter-3",error);
                    callback([error,null]);
                });
            }
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            w_error("Adapter-Get-Item-Adapter-4",error);
            callback([error,null]);
        });
    });
}
const set_cache_item = (cache_connect,data_type,id,item_data) => {
    return new Promise((callback) => {
        let cache_string_str = '';
        let prop_list = [];
        async.series([
            function(call) {
                for (prop in item_data) {
                    if(prop != '_id'){
                        prop_list.push({title:prop,value:item_data[prop]});
                    }
                }
                call();
            },
            async function(call) {
                for(const item of prop_list) {
                    cache_string_str=cache_string_str+item.title+',';
                    await set_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item.title), item.value);
                }
            },
            function(call) {
                    set_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id),cache_string_str).then(([error,data]) => {
                        call();
                    }).catch(error => {
                        w_error("Data-Adapter-Set-Cache-Item",error);
                        callback([error,null]);
                    });
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            w_error("Data-Adapter-Set-Cache-Item-2",error);
            callback([error,null]);
        });
    });
}
const delete_item_adapter = (db_connect,data_type,id) => {
    return new Promise((callback) => {
        let cache_connect = {};
        let item_data = get_new_item(data_type,id);
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    w_error("Adapter-Get-Item-Adapter",error);
                    callback([error,null]);
                });
            },
            function(call) {
                delete_item_cache_db(cache_connect,db_connect,data_type,id).then(([error,data]) => {
                    item_data = data;
                    call();
                }).catch(error => {
                    w_error("Adapter-Get-Item-Adapter-2",error);
                    callback([error,null]);
                });
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    w_error("Adapter-Get-Item-Adapter-3",error);
                    callback([error,null]);
                });
            }
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            w_error("Adapter-Get-Item-Adapter-4",error);
            callback([error,null]);
        });
    });
}
const get_item_cache_db = (cache_connect,db_connect,data_type,id,options) => {
    return new Promise((callback) => {
        let cache_found = false;
        let cache_key_list = null;
        let item_data = get_new_item(data_type,id);
        let cache_string_list = [];
        async.series([
            function(call) {
                get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id)).then(([error,data]) => {
                    cache_key_list=data;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Get-Item-Cache-DB",error);
                    callback([error,null]);
                });
            },
            async function(call) {
                if(cache_key_list!=null){
                    cache_string_list =cache_key_list.split(',');
                }
                for(const item of cache_string_list) {
                    if(item){
                        const [error,val] = await get_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item));
                        if(val){
                            item_data[item] = val;
                            cache_found=true;
                        }else{
                            item_data[item] = null;
                        }
                    }
                }
            },
            function(call){
                if(cache_found){
                    item_data.source=CACHE_TITLE;
                    call();
                }
                else{
                    get_item_main(db_connect,data_type,id).then(([error,data]) => {
                        if(data){
                            set_cache_item(cache_connect,data_type,id,data).then(([error,data]) => {
                                item_data = data;
                                item_data.source = DB_TITLE;
                                call();
                            }).catch(error => {
                                w_error("Data-Adapter-Get-Item-Cache-DB-2",error);
                                callback([error,null]);
                            });
                        }else{
                            item_data.source = NOT_FOUND_TITLE;
                            call();
                        }
                    }).catch(error => {
                        w_error("Data-Adapter-Get-Item-Cache-DB-3",error);
                        callback([error,null]);
                    });
                }
            },
        ]).then(result => {
            set_biz_item(item_data,options).then(([error,data]) => {
                callback([error,data]);
            }).catch(error => {
                w_error("Data-Adapter-Get-Item-Cache-DB-4",error);
                callback([error,null]);
            });
        }).catch(error => {
            w_error("Data-Adapter-Get-Item-Cache-DB",error);
            callback([error,null]);
        });
    });
}
const delete_item_list_adapter = (db_connect,data_type,sql) => {
    return new Promise((callback) => {
        let cache_connect = {};
        let item_id_list = [];
        let item_data_new_list = [];
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Delete-Item-List-Adapter",error);
                    callback([error,null]);
                });
            },
            function(call) {
                get_id_list_main(db_connect,data_type,sql,{},0,9999).then(([error,total_count,data_list]) => {
                    error=error;
                    total_count=total_count;
                    item_id_list=data_list;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Delete-Item-List-Adapter-2",error);
                    callback([error,null]);
                });
            },
            function(call){
                delete_item_list_main(db_connect,data_type,sql).then(([error,data]) => {
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Delete-Item-List-Adapter",error);
                    callback([error,null]);
                });
            },
            async function(call) {
                var list = [];
                for(const item of item_id_list) {
                    [error,data] = await delete_item_cache_db(cache_connect,db_connect,data_type,item.id);
                    item_data_new_list.push(data);
                }
            },
        ]).then(result => {
            callback([error,item_data_new_list]);
        }).catch(error => {
            w_error("Data-Adapter-Delete-Item-List-Adapter-3",error);
            callback([error,null]);
        });
    });
}
const delete_item_cache_db = (cache_connect,db_connect,data_type,id) => {
    return new Promise((callback) => {
        let cache_connect = {};
        let cache_key_list = '';
        let cache_string_list = '';
        let item_data = get_new_item(data_type,id);
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Delete-Item-Cache-DB",error);
                    callback([error,null]);
                });
            },
            function(call) {
                get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id)).then(([error,data]) => {
                    cache_key_list=data;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Get-Item-Cache-DB",error);
                    callback([error,null]);
                });
            },
            async function(call) {
                if(cache_key_list!=null){
                    cache_string_list =cache_key_list.split(',');
                }
                for(const item of cache_string_list) {
                    if(item){
                        const [error,val] = await delete_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item));
                    }
                }
            },
            function(call){
                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id)).then(([error,data]) => {
                    item_data.cache_del = true;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Delete-Item-Cache-DB-2",error);
                    callback([error,null]);
                });
            },
            function(call){
                delete_item_main(db_connect,data_type,id).then(([error,data]) => {
                    item_data.db_del = true;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Delete-Item-Cache-DB-3",error);
                    callback([error,null]);
                });
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Delete-Item-Cache-DB-4",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            w_error("Data-Adapter-Delete-Item-Cache-DB-5",error);
                    callback([error,null]);
        });
    });
}
const count_item_list_adapter = (db_connect,data_type,sql) => {
    return new Promise((callback) => {
        let item_list_count = 0;
        async.series([
            function(call) {
                count_item_list_main(db_connect,data_type,sql).then(([error,data]) => {
                    item_list_count = data;
                    call();
                }).catch(error => {
                    w_error("Data-Adapter-Count-Item-List",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            callback([error,item_list_count]);
        }).catch(error => {
            w_error("Data-Adapter-Count-Item-List",error);
            callback([error,null]);
        });
    });
}
const get_cache_item_attr_key = (data_type,id,key) => {
    return data_type + "_" + key + "_" + String(id);
}
const get_cache_item_attr_list_key = (data_type,id) => {
    return data_type+"_aik_"+String(id);
}
module.exports = {
    get_db_connect_adapter,
    check_db_connect_adapter,
    close_db_connect_adapter,
    update_item_adapter,
    update_item_list_adapter,
    get_item_adapter,
    get_item_list_adapter,
    delete_item_list_adapter,
    count_item_list_adapter,
    delete_item_adapter
};
