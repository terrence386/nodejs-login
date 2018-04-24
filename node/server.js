const http = require('http');
const fs= require('fs');
const querystring = require('querystring');
const urlLib = require('url');


var users = {};
var server = http.createServer(function(req,res){
	//解析数据
	var str = ''
	req.on('data',function(data){
		str +=data
	})

	req.on('end',function(){
		var obj = urlLib.parse(req.url,true);
		const url = obj.pathname;
		const Get = obj.query;
		const Post = querystring.parse(str);


		//访问文件 访问接口  区分 

		if(url == '/user'){
			switch(Get.act){
				case 'reg':
					if(users[Get.user]){
						res.write('{"ok":false,"msg":"此用户已注册！"}');
					}else{
						users[Get.user] = Get.pass;
						res.write('{"ok":true,"msg":"注册成功"}')
					}
				break;
				case 'login':
					if(users[Get.name] == null){
						res.write('{"ok":false,"msg":"用户不存在"}')
					}else if(users[Get.user] != Get.pass){
						res.write('{"ok":false,"msg":"用户名或密码有误"}')
					}else{
						res.write('{"ok":true,"msg":"登录成功"}')
					}
				 break;
				 default:
				  res.write('{"ok":false,"msg":"未知的act"}');
				  res.end();
			}

		}else{
			//读取文件
			var file_name = './www'+url;

			fs.readFile(file_name,function(err,data){
				if(err){
					res.write('404');
				}else{
					res.write(data)
				}
				res.end();
			})
		}
	})
})

server.listen(3333)