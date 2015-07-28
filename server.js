var net = require('net');
var fs = require('fs');
var ejs = require('ejs');
var cp = require('child_process');
var chalk = require('chalk')

var messageSystem = JSON.parse(fs.readFileSync('users.json'));
var users = Object.keys(messageSystem);

var welcomeMessage = "Hello Client \n\t\t++++++++++++++++++++++++++++++++++++++++\n\t\t+			               +\n\t\t+   Welcome to Messamatron 90000       +\n\t\t+		                       +\n\t\t+++++++++++++++++++++++++++++++++++++++\r\n\r\n"

var server = net.createServer(function(c) {

			c.write(chalk.italic.green(welcomeMessage));
			function listFunc(){
			c.write("\tAvailable Functions: \r\n");
			c.write(chalk.bold.blue("\t++New User <username> <password>\r\n\t\t")+chalk.blue("-Creates a new user with an alphanumeric password-\r\n"));
			c.write(chalk.bold.blue("\t++Send <username> '<message>'\r\n\t\t")+chalk.blue("-Sends a message to the named user-\r\n"));
			c.write(chalk.bold.blue("\t++List <username> \r\n\t\t")+chalk.blue("-Lists the number of messages the user has-\r\n"));
			c.write(chalk.bold.blue("\t++Retrive <username> <password> <message#>\r\n\t\t") + chalk.blue("-Retrieves the indicated message if the password is correct.\r\n\t\t -Indicate all for all messages-\r\n"));
			c.write(chalk.bold.blue("\t++RetrieveHTML <username> <password> <message#>\r\n\t\t") + chalk.blue("-Retrieves the indicated message if the password is correct and opens it as HTML.\r\n\t\t -Indicate all for all messages-\r\n"))
			c.write(chalk.bold.blue("\t++Change Password <username> <oldpassword> <newpassword>\r\n\t\t") + chalk.blue(" -Changes the password of the user in question-\r\n"));
			c.write(chalk.bold.blue("\t++Delete <username> <password> <message#>\r\n\t\t") + chalk.blue(" -Deletes the indicated message if the password is correct.-\r\n\t\t -Indicate all for all messages.-\r\n"))
			c.write(chalk.bold.blue("\t++Print Functions\r\n\t\t")+chalk.blue('-Displays this list of functions-\r\n'))
			 c.write(chalk.bold.blue("\t++Logout++ \r\n\t\t") + chalk.blue(" -Log out of Messamatron 9000-\r\n\r\n"))
			}

				listFunc();
				c.on('data', function(data) {
					input = data.toString().trim();

					var regExKeys = {
						newUser: new RegExp(/new user \w+ \w+/gi),
						sendMessage: new RegExp(/send \w+( \w+)+/),
						listMessages: new RegExp(/list \w+/gi),
						retrieve: new RegExp(/retrieve \w+ \w+ ([0-9]+|all)/gi),
						newPW: new RegExp(/change password \w+ \w+ \w+/gi),
						delete: new RegExp(/delete \w+ \w+ ([0-9]+|all)/gi),
						logOut: new RegExp(/Logout/i),
						retrieveHTML: new RegExp(/retrieveHTML \w+ \w+ ([0-9]+|all)/gi),
						breakSh_t: new RegExp(/breakitdown/i),
						listFunc: new RegExp(/print functions/gi)
					}
					if (regExKeys.newUser.test(input)) {
						input = input.split(' ');
						var newUser = new Object();
						newUser.user = input[2]
						newUser.pw = input[3]
						newUser.messages = []
						messageSystem.push(newUser)
						fs.writeFileSync('users.json', JSON.stringify(messageSystem))
						messageSystem = JSON.parse(fs.readFileSync('users.json'));
						
					} else if (regExKeys.sendMessage.test(input)) {
						messageSystem = JSON.parse(fs.readFileSync('users.json'));

						input = input.split(' ')
						var errCount = 0
						for (i = 0; i < messageSystem.length; i++) {

							if (messageSystem[i].user.toLowerCase() != input[1].toLowerCase()) {

								if (errCount === i) {
									c.write('No user by that name\r\n')
									return false;
								}
								errCount++

							} else {
								var index = i
							}
						}
						input.shift()
						input.shift()
						input = input.join(' ')
						var message = new Object();
						message.content = input.toString()
						message.read = false;
						message.timeStamp = Date()
						messageSystem[index].messages.push(message)

						fs.writeFileSync('users.json', JSON.stringify(messageSystem))

					} else if (regExKeys.listMessages.test(input)) {
						input = input.split(' ')
						messageSystem = JSON.parse(fs.readFileSync('users.json'));
						var errCount = 0
						for (i = 0; i < messageSystem.length; i++) {

							if (messageSystem[i].user.toLowerCase() != input[1].toLowerCase()) {
								if (errCount === i) {
									c.write('No user by that name\r\n')
									return false;
								}
								errCount++

							} else {
								var index = i
							}

						}

						var trueCount = 0;
						var falseCount = 0;
						for (i = 0; i < messageSystem[index].messages.length; i++) {
							if (messageSystem[index].messages.read == true) {
								trueCount++
								console.log('true')
							} else {
								console.log('false')
								falseCount++
							}
						}
						c.write("You currently have " + messageSystem[index].messages.length.toString() + " messages, of which " + falseCount.toString() + " are unread\r\n")
						if (messageSystem[index].messages.length != 0) {
							c.write("The most recent message is # " + (messageSystem[index].messages.length - 1).toString() + " which was left on " + messageSystem[index].messages[i - 1].timeStamp)
						}
						
					} else if (regExKeys.retrieve.test(input)) {
						messageSystem = JSON.parse(fs.readFileSync('users.json'));

						input = input.split(' ')
						for (i = 0; i < messageSystem.length; i++) {

							if (messageSystem[i].user.toLowerCase() != input[1].toLowerCase()) {

								if (errCount === i) {
									c.write('No user by that name\r\n')
									return false;
								}
								errCount++

							} else {
								var index = i
							}
						}
						if (input[2] != messageSystem[index].pw) {
							c.write("Invalid Password\r\n")
							return false
						}
						if (input[3] === 'all') {
							for (i = 0; i < messageSystem[index].messages.length; i++) {
								c.write(chalk.gray.bold("Message #"+i +"\r\n"))
								c.write(messageSystem[index].messages[i].content + "\r\n-----------------------\r\n")
								messageSystem[index].messages[i].read = true;
								})
								fs.writeFileSync('message.html', template)
								fs.writeFileSync('users.json', JSON.stringify(messageSystem))
							}

						} else if (parseInt(input[3]) >= messageSystem[index].messages.length) {
							c.write("No message at that index")
							return false;
						} else {
							messageSystem = JSON.parse(fs.readFileSync('users.json'));
							c.write(messageSystem[index].messages[parseInt(input[3])].content + "\r\n-----------------------\r\n")

							messageSystem[index].messages[parseInt(input[3])].read = true;

							html = fs.readFileSync('template.ejs', 'utf8')
							template = ejs.render(html, {
								messageNo: parseInt(input[3]),
								messageTo: messageSystem[index].user,
								messageContent: messageSystem[index].messages[parseInt(input[3])].content
							})
							fs.writeFileSync('message.html', template)
							fs.writeFileSync('users.json', JSON.stringify(messageSystem))
						}
						
					} else if (regExKeys.newPW.test(input)) {
						input = input.split(' ')
						messageSystem = JSON.parse(fs.readFileSync('users.json'));
						console.log(messageSystem)
						for (i = 0; i < messageSystem.length; i++) {

							if (messageSystem[i].user.toLowerCase() != input[2].toLowerCase()) {

								if (errCount === i) {
									c.write('No user by that name\r\n')
									return false;
								}
								errCount++

							} else {
								var index = i
								console.log(index)
							}
						}
						if (input[3] != messageSystem[index].pw) {
							c.write("Invalid Password\r\n")
							return false
						}

						messageSystem[index].pw = input[4]
						fs.writeFileSync('users.json', JSON.stringify(messageSystem))

						
					} else if (regExKeys.delete.test(input)) {
						input = input.split(' ')
						messageSystem = JSON.parse(fs.readFileSync('users.json'));
						for (i = 0; i < messageSystem.length; i++) {

							if (messageSystem[i].user.toLowerCase() != input[1].toLowerCase()) {

								if (errCount === i) {
									c.write('No user by that name\r\n')
									return false;
								}
								errCount++

							} else {
								var index = i
							}
						}
						if (input[2] != messageSystem[index].pw) {
							c.write("Invalid Password\r\n")
							return false
						}
						if (input[3] === 'all') {
							messageSystem[index].messages = [];
							c.write('All messages deleted')
							fs.writeFileSync('users.json', JSON.stringify(messageSystem))
						} else if (parseInt(input[3]) >= messageSystem[index].messages.length) {
							c.write("No message at that index\r\n")
							return false;
						} else {
							messageSystem[index].messages.splice(parseInt(input[3]), 1)
							c.write("Message #" + input[3] + " has been deleted \r\n")
							fs.writeFileSync('users.json', JSON.stringify(messageSystem))
						}
						
					} else if (regExKeys.retrieveHTML.test(input)) {
						messageSystem = JSON.parse(fs.readFileSync('users.json'));

						input = input.split(' ')
						for (i = 0; i < messageSystem.length; i++) {

							if (messageSystem[i].user.toLowerCase() != input[1].toLowerCase()) {

								if (errCount === i) {
									c.write('No user by that name\r\n')
									return false;
								}
								errCount++

							} else {
								var index = i
							}
						}
						if (input[2] != messageSystem[index].pw) {
							c.write("Invalid Password\r\n")
							return false
						}
						if (input[3] === 'all') {
							for (i = 0; i < messageSystem[index].messages.length; i++) {

								messageSystem[index].messages[i].read = true;

								html = fs.readFileSync('templateAll.ejs', 'utf8')
								template = ejs.render(html, {
									message: messageSystem[index]
								})
								fs.writeFileSync('message.html', template)
								cp.exec('open message.html')
								fs.writeFileSync('users.json', JSON.stringify(messageSystem))
							}

						} else if (parseInt(input[3]) >= messageSystem[index].messages.length) {
							c.write("No message at that index")
							return false;
						} else {
							messageSystem = JSON.parse(fs.readFileSync('users.json'));


							messageSystem[index].messages[parseInt(input[3])].read = true;

							html = fs.readFileSync('template.ejs', 'utf8')
							template = ejs.render(html, {
								messageNo: parseInt(input[3]),
								messageTo: messageSystem[index].user,
								messageContent: messageSystem[index].messages[parseInt(input[3])].content
							})
							fs.writeFileSync('message.html', template)
							cp.exec('open message.html')
							fs.writeFileSync('users.json', JSON.stringify(messageSystem))
						}
						
					} else if (regExKeys.breakSh_t.test(input)) {
						c.write('Ending application')
						console.log('Ending application')
						c.destroy()
						process.exit()
					} else if (regExKeys.logOut.test(input)) {
						c.write('Thank you for using Messamatron 9000\r\nHave a nice Day')
						c.destroy()
					} else if(regExKeys.listFunc.test(input)){
						listFunc()
					} else {
						c.write('No such command\r\n')
					}
				})

				c.on('end', function() {
					console.log('client disconnected')
				})

			})

		server.on('data', function(data) {
			c.write(data.toString().trim() + '\r\n')
		})

		server.listen(3000, function() {
			console.log('listening on port 3000')
		})