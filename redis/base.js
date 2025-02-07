const redis = require('redis');
const {get_guid,w_error} = require("biz9-utility");

const get_cache_connect_base = (data_config) => {
	return new Promise((callback) => {
		let error = null;
        let set_cache=false;
        let client_redis = redis.createClient(data_config.REDIS_PORT_ID,data_config.REDIS_URL);
		client_redis.connect().then((data) => {
			callback([null,data]);
        }).catch(error => {
            w_error("Data-Redis-Base-Get-Cache-Base-Error",error);
			callback([null,error]);
		});
	});
}
const close_cache_connect_base = (cache_connect) => {
	return new Promise((callback) => {
		let error = null;
        let set_cache=false;
		cache_connect.disconnect().then((data) => {
			callback([null,data]);
        }).catch(error => {
            w_error("Data-Redis-Base-Close-Cache-Base-Error",error);
			callback([null,error]);
		});
	});
}
const delete_cache_string_base = (client_redis,key) => {
	return new Promise((callback) => {
		let error = null;
		client_redis.del(key).then((data) => {
			callback([error,data]);
        }).catch(error => {
            w_error("Data-Redis-Base-Delete-Cache-String-Base-Error",error);
			callback([null,error]);
		});
	});
}
const get_cache_string_base = (client_redis,key) => {
	return new Promise((callback) => {
		let error = null;
		client_redis.get(key).then((data) => {
			callback([error,data]);
        }).catch(error => {
            w_error("Data-Redis-Base-Get-Cache-String-Base-Error",error);
			callback([null,error]);
		});
	});
}
const set_cache_string_base = (client_redis,key,value) => {
	return new Promise((callback) => {
		let error = null;
		let data = null;
        if(!value||value==null||value==undefined){
            value=" ";
        }
        value=String(value).trim();
		client_redis.set(key,value).then((data) => {
			callback([error,data]);
        }).catch(error => {
            w_error("Data-Redis-Base-Set-Cache-String-Base-Error",error);
			callback([null,error]);
		});
	});
}
module.exports = {
	get_cache_connect_base,
	get_cache_string_base,
	set_cache_string_base,
	close_cache_connect_base,
	delete_cache_string_base,
};
