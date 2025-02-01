/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data - Mongo - Base
 */
const async = require('async');
const moment = require('moment');
const {get_guid,w_error} = require("biz9-utility-server");
const { MongoClient } = require("mongodb");
client_db = {};
const get_db_connect_base = (biz9_config,db_name) => {
	return new Promise((callback) => {
    const mongo_full_url="mongodb://"+biz9_config.MONGO_USERNAME_PASSWORD+biz9_config.MONGO_IP+":"+biz9_config.MONGO_PORT_ID+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
        client_db = new MongoClient(mongo_full_url);
		client_db.connect(db_name).then((data)=> {
			callback([null,data.db(db_name)]);
		}).catch(error => {
			w_error("Data-Mongo-Base-Get-DB-BASE-Error--",error);
			var reset_cmd = "sudo mongod --fork --config "+biz9_config.mongo_config;
			if(data_config.mongo_ip!='0.0.0.0'){
				if(!data_config.ssh_key){
					data_config.ssh_key='';
				}else{
					biz9_config.ssh_key=' -i '+ biz9_config.ssh_key;
				}
				reset_cmd = 'ssh '+ biz9_config.ssh_key + " " +biz9_config.mongo_server_user +"@"+biz9_config.mongo_ip +" -- "+reset_cmd;
			}
			dir = exec(reset_cmd, function(error,stdout,stderr){
			});
			dir.on('exit', function (code) {
				callback([error,null]);
			});
		});
	});
}
const close_db_connect_base = (db_connect) => {
	return new Promise((callback) => {
		client_db.close().then((data)=> {
			callback([error,null]);
		}).catch(error => {
			w_error("Data-Mongo-Base-Close-DB-Base",error);
			callback([error,null]);
		});
	});
}
const get_item_base = (db_connect,data_type,id) => {
	return new Promise((callback) => {
		let collection = {};
		if(check_db_connect_base(db_connect)){
			collection = db_connect.collection(data_type);
			collection.findOne({id:id}).then((data) => {
				callback([error,data]);
			}).catch(error => {
				w_error("Data-Base-Get-Item-Base",error);
				callback([error,null]);
			});
		}
	});
}
const check_db_connect_base = (db_connect) => {
	if(!db_connect.client){
		return false;
	}else if(!db_connect.client.topology){
		return false;
	}else if(!db_connect.client.topology){
		return false;
	}else{
		return true;
	}
}
const check_db_client_connected = (db_connect) => {
	return !!db_connect && !!db_connect.topology && !!db_connect.topology.isConnected()
}
const update_item_base = (db_connect,data_type,item) => {
	return new Promise((callback) => {
		let collection = db_connect.collection(data_type);
		if (String(item.id)=='0') {//insert
			item.id = get_guid();
			item.date_create = new moment().toISOString();
			item.date_save = new moment().toISOString();
			if(check_db_connect_base(db_connect)){
				collection.insertOne(item).then((data) => {
					delete item['_id'];
					callback([error,item]);
				}).catch(error => {
					w_error("Data-Mongo-Base-Update-Item-Base",error);
					callback([error,null]);
				});
			}
		}else{
			item.date_save = new moment().toISOString();
			collection.updateOne({id:item.id},{$set: item}).then((data) => {
				delete item['_id'];
				callback([error,item]);
			}).catch(error => {
				w_error("Data-Mongo-Base-Update-Item-Base",error);
				callback([error,null]);
			});
		}
	});
}
const delete_item_base = (db_connect,data_type,id) => {
	return new Promise((callback) => {
		let collection = db_connect.collection(data_type);
		if(check_db_connect_base(db_connect)){
			collection.deleteMany({id:id}).then((data) => {
				callback([error,data]);
			}).catch(error => {
				w_error("Data-Mongo-Base-Delete-Item-Base",error);
				callback([error,null]);
			});
		}
	});
}
const delete_item_list_base = (db_connect,data_type,sql) => {
	return new Promise((callback) => {
		let collection = db_connect.collection(data_type);
		if(check_db_connect_base(db_connect)){
			collection.deleteMany(sql).then((data) => {
				callback([error,data]);
			}).catch(error => {
				w_error("Data-Mongo-Base-Delete-List-Base",error);
				callback([error,null]);
			});
		}
	});
}
const get_id_list_base = (db_connect,data_type,sql_obj,sort_by,page_current,page_size) => {
	return new Promise((callback) => {
		let total_count = 0;
		let data_list = [];
		let collection = {};
		async.series([
			function(call) {
				if(check_db_connect_base(db_connect)){
					db_connect.collection(data_type).countDocuments(sql_obj).then((data) => {
						total_count = data;
						call();
					}).catch(error => {
						w_error("Data-Mongo-Base-Get-Sql-Paging-TblId-Base",error);
						callback([error,null]);
					});
				}else{
					w_error("Data-Mongo-Base-Get-Sql-Paging-TblId-Base",'No Connection');
				}
			},
			function(call) {
				if(check_db_connect_base(db_connect)){
					db_connect.collection(data_type).find(sql_obj).sort(sort_by).skip(page_current>0?((page_current-1)*page_size):0).limit(page_size).collation({locale:"en_US",numericOrdering:true}).project({id:1,data_type:1,_id:0}).toArray().then((data) => {
						data_list = data;
						call();
					}).catch(error => {
						w_error("Data-Mongo-Base-Get-Sql-Paging-TblId-Base",error);
						callback([error,null]);
					});
				}else{
					w_error("Data-Mongo-Base-Get-Sql-Paging-TblId-Base",'No connection');
					callback(['No connection',null]);
				}
			}
		]).then(result => {
			callback([error,total_count,data_list]);
		}).catch(error => {
			w_error("Project-FileName-Update-Blank",err);
			callback([error,null]);
		});
	});
}
const count_item_list_base = (db_connect,data_type,sql) => {
	return new Promise((callback) => {
		let collection = db_connect.collection(data_type);
		if(check_db_connect_base(db_connect)){
			collection.countDocuments(sql).then((data) => {
				callback([error,data]);
			}).catch(error => {
				w_error("Data-Mongo-Base-Count-Item-List-Base",error);
				callback([error,null]);
			});
		}
	});
}
module.exports = {
	get_db_connect_base,
	check_db_connect_base,
	close_db_connect_base,
	update_item_base,
	get_item_base,
	delete_item_base,
	delete_item_list_base,
	count_item_list_base,
	get_id_list_base
};
