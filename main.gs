// main terminal script

//globals
s = get_shell // shell
c = s.host_computer // computer
th = null // terminal header [user@hostname ~]$
h = c.get_name // hostname
au = active_user // active user
// fp folder path of current directory
// fn folder name of fp 

// initializing
if au == "root" then
	fp = "/root"
else
	fp = "/home/"+au
end if
// debug = 1 disables security // set in functions, not here
if not debug then security // security makes you enter a password

// main loop
while true
	fp = fp
	fn = c.File(fp).name
	if au == "root" then
		th = "[".color("#DBCF2FFF") + au.color("red", 1) + "@".color("#DBCF2FFF") + h.color("#C68852FF") + " " + fn.color("white", 1) + "]".color("#DBCF2FFF")+ "# ".color("red", 1)
		if fp == "/root" then th = "[".color("#DBCF2FFF") + au.color("red", 1) + "@".color("#DBCF2FFF") + h.color("#C68852FF") + " ~".color("white", 1) + "]".color("#DBCF2FFF")+ "# ".color("red", 1)
	else
		th = "[".color("#DBCF2FFF") + au.color("#C68852FF") + "@".color("#DBCF2FFF") + h.color("#C68852FF") + " " + fn.color("white", 1) + "]".color("#DBCF2FFF")+ "$ ".color("green")
		if fp == "/home/" + au then th = "[".color("#DBCF2FFF") + au.color("#C68852FF") + "@".color("#DBCF2FFF") + h.color("#C68852FF") + " ~".color("white", 1) + "]".color("#DBCF2FFF")+ "$ ".color("green")
	end if
	t = user_input(th).trim // the users input
	if t == "exit" then break
    if t == "quit" then // no quitting allowed
        print "quit is for quitters, use exit instead."
        continue
    end if
	if t == "" or t == null then continue // this could probably be shortened
	tWords = t.split(" ") // split users input, tWords[0] is the command and the rest params
	key = commands.hasIndex(tWords[0]) // check commands map for the command
	if key != 0 then // command exists
        z = tWords[1:] // params
       	commands[tWords[0]](z) // call the command with the params
	else // command does not exist
		error(01)
		continue // restart loop if command doesnt exist
	end if
end while
print "Exiting bash now"