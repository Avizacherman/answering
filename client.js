var net = require('net');

var client = net.Socket();

if(process.argv.length === 2){
	process.argv.push('localhost')
}

client.connect({port: 3000, host: process.argv[2]}, function(){
	console.log('connected to server\r\n')
})

	client.on('data', function(data){
		console.log(data.toString().trim())
	});

		process.stdin.on('data', function(input){
			client.write(input.toString().trim());
		})
	client.on('end', function(){
		console.log('disconnected from server')
		process.exit()
	})