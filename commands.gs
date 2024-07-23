commands = {}
commands.help = function(x) // feature complete
	storage = []
	for each in commands
		storage.push(each.key)
	end for
	take = function
		retrieve = storage.pull
		return retrieve
	end function
	storage = sort(storage)
	info = clear_screen + "\nFor usage, type: man [command]\n"
	print info
	while storage.len > 0
	cmds = take + " " + take + " " + take + " " + take + " " + take + " " + take
	print format_columns(cmds) 
	end while
	print ""
end function
commands.man = function(params) // feature complete
    // command: man
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then
        print "Usage: man [command]"
        print "For a list of commands, type: help"
        return
    end if
    command = params[0]
    if command == "help" then exit("you need professional help, touch some grass and get a therapist")
    info = command_info(command+"_usage")
    if info == (command+"_usage").upper then return error("man: manual entry for "+command+" not found")
    print(info)
end function
commands.clear = function(x) // feature complete
	clear_screen
end function
commands.echo = function(params) // feature complete
    params = join(params, " ")
    print params
end function
commands.hello = function(params) // final
    if params.len != 1 then
        return error("hello: command not found")
    end if
    print "world"
end function
commands.cd = function(params) // feature complete
	newdir = join(params, " ")
	if newdir.indexOf("..") == 0 then
		parts = newdir.split("/")
		if parts[parts.len -1].len == 0 then parts.pop
		fpo = c.File(fp) // file path object
		while newdir.indexOf("..") == 0
			parts = newdir.split("/") 
			parts.pull // pull dotdot
			fpo = fpo.parent // for each dotdot removed, fpo bumps to the parent
			newdir = parts.join("/") // rejoin parts into newdir, repeat if needed
		end while
		newdir = fpo.path + "/" + newdir // set the newdir path
		if newdir.indexOf("//") == 0 then newdir = newdir.replace("//", "/")
		// if it goes to system root, it will add an extra slash, so remove it
	end if
	if newdir.len == 0 then // no params, go to users home directory
		if au != "root" then
			globals.fp = "/home/"+active_user
		else
			globals.fp = "/root"
		end if
	else if c.File(newdir) or c.File(fp+"/"+newdir) then
		if newdir.indexOf("/") == 0 then
			if not c.File(newdir).is_folder then return error("cd: " + newdir + " is not a folder")
			if not c.File(newdir).has_permission("r") then return error("cd: " + newdir + " permission denied")
			globals.fp = newdir
		else
			newdir = fp+"/"+newdir
			if not c.File(newdir).is_folder then return error("cd: " + newdir + " is not a folder")
			if not c.File(newdir).has_permission("r") then return error("cd: " + newdir + " permission denied")
			globals.fp = newdir
		end if
	else
		if newdir.indexOf("/") == 0 then
			return error("cd: " + newdir + " not found")
		else
			return error("cd: " + fp+"/"newdir + " not found")
		end if
	end if
end function
commands.ls = function(params) // TODO: handle dotdots
    // command: ls
    ValidateInput = function(input)
    if input == "-al" or input == "-la" or input == "-l" or input == "-a" then return true
        return false
    end function
    if params.len > 3 or (params.len == 1 and params[0].indexOf("-") != null and not ValidateInput(params[0])) or (params.len == 2 and not ValidateInput(params[0])) or (params.len == 3 and (not ValidateInput(params[0]) or not ValidateInput(params[1]))) then
        return self.man(["ls"])
    else
        computer = c
        folderPath = fp
    if params and params[params.len - 1].indexOf("-") == null then
        folderPath = params[params.len - 1]
    end if
    folder = computer.File(folderPath)
    if folder == null then
        return error("ls: No such file or directory")
    else
        if not folder.has_permission("r") then
            return error("ls: permission denied")
        else
            showHide = 0
			if params and params[0] == "-a" or params and params[0] == "-al" or params and params[0] == "-la" then
            showHide = 1
            end if
            showDetails = 0
			if params and params[0] == "-l" or params and params[0] == "-al" or params and params[0] == "-la" then
            showDetails = 1
            end if
            subFiles = folder.get_folders + folder.get_files
            output = ""
            for subFile in subFiles
                nameFile = subFile.name
                permission = subFile.permissions
                owner = subFile.owner
                size = subFile.size
                group = subFile.group
                if showHide or nameFile.indexOf(".") != 0 then
                    if output.len > 0 then 
                        output = output + "\n"
                    end if
                    if showDetails then
                        output = output + permission + " " + owner + " " + group + " " + size + " 00:00 " + nameFile
                    else
                        output = output + nameFile
                    end if
                end if
            end for
            print(format_columns(output))
        end if
    end if
    end if
end function
commands.ps = function(params) // final
    // command: ps
    if params.len > 0 then return self.man(["ps"])
    output = c.show_procs
    print(format_columns(output))
end function
commands.pwd = function(params) // final
    print fp
end function
commands.ifconfig = function(params) // testing
    // command: ifconfig
    if params.len != 0 and (params.len != 4 or params[0] == "-h" or params[0] == "--help") then return self.man(["ifconfig"])
    computer = c
    if (params.len == 0) then
    	router = get_router    
    	if computer.is_network_active then
    	    lip = computer.local_ip
        	pip = router.public_ip
        	gw = computer.network_gateway
    	    if computer.active_net_card == "WIFI" then		    
    		    output = "\nConnected to Wi-Fi:\nEssid: " + router.essid_name + "\nBssid: " + router.bssid_name
    		else
    		    output = "\nEthernet connection:"    
    		end if
    	else
    		lip = "0.0.0.0"
    		pip = "0.0.0.0"
    		gw = "0.0.0.0"
    		output = "\nNot connected to the network."
    	end if
    	print( output + "\n----------------\nPublic IP: " + pip + "\nLocal IP: " + lip + "\nGateway: " + gw + "\n")
    else 
    	if params[2] != "gateway" then return self.man(["ifconfig"])
    	device = params[0]
    	address = params[1]
    	gateway = params[3]
    	if not is_valid_ip(address) then return error("ifconfig: invalid ip address")
    	if not is_valid_ip(gateway) then return error("ifconfig: invalid gateway")
    	output = computer.connect_ethernet(device, address, gateway)
    	if output.len > 0 then error(output)
    end if
end function
commands.deeplist = function(params) // feature complete
	if not params then params = ["/"]
	get = function(obj)
		folders = obj.get_folders
		files = obj.get_files
		for folder in folders
			results.push(folder.path)
		end for
		for file in files
			results.push(file.path)
		end for
	end function
	results = params
	for each in results
		if c.File(each).is_folder then
			get(c.File(each))
		end if
	end for
	for e in sort(results)
		f = c.File(e)
		p = f.permissions
		o = f.owner
		g = f.group
		n = f.path
		print format_columns(p + " " + o + " " + g + " " + n)
	end for
	print format_columns("There were " + results.len + " files in the system")
end function
commands.iwconfig = function(params) // testing
    // command: iwconfig
    if params.len != 4 or params[0] == "-h" or params[0] == "--help" then return self.man(["iwconfig"])
    computer = c
    devices = computer.network_devices
    if devices == null or devices.indexOf(params[0]) == null then return error("iwconfig: Network device not found")
    bssid = params[1]
    essid = params[2]
    password = params[3]
    status = computer.connect_wifi(params[0], bssid, essid, password)
    if typeof(status) == "string" then print(status)
end function
commands.iwlist = function(params) // testing
    // command: iwlist
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return self.man(["iwlist"])
    computer = c
    devices = computer.network_devices
    if devices == null or devices.indexOf(params[0]) == null then return error("iwlist: Network device not found")
    if params[0].indexOf("eth") != null then return error("iwlist: ethernet cards not supported for this command")
    networks = computer.wifi_networks(params[0])
    if networks == null then return self.man(["iwlist"])
    info = "BSSID PWR ESSID\n"
    for network in networks
    	info = info + network
    end for
    print(format_columns(info))
end function
commands.cat = function(params) // TODO: fix prints and errors
    // command: cat
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return error("cat_usage")
    pathFile = params[0]
    file = c.File(pathFile)
    if file == null then return error("cat: file not found: "+pathFile)
    if file.is_binary then return error("cat: can't open " + file.path + ". Binary file")
    if not file.has_permission("r") then return error("cat: permission denied")
    print(file.get_content)
end function
commands.rm = function(params) // TODO: fix prints and errors
    // command: rm
    if params.len < 1 or params.len > 2 or params[0] == "-h" or params[0] == "--help" then return error("rm_usage")
    pathFile = params[0]
    isRecursive = 0
    if params[0] == "-r" then
    	if params.len == 1 then return error("rm_usage")
    	isRecursive = 1
    	pathFile = params[1]
    end if
    file = c.File(pathFile)
    if file == null then return error("rm: file not found: "+pathFile)
    if not file.has_permission("w") then return error("rm: permission denied")
    if file.is_folder == 1 and isRecursive == 0 then
    	error("rm: " + file.name + " is a directory")
    else
    	output = file.delete
    	if output.len > 0 then error(output)
    end if
end function
commands.mv = function(params) // TODO: fix prints and errors
    // command: mv
    if params.len != 2 then
    	self.man(["mv"])
    else
    	origFile = params[0]
    	destFolder = params[1]
    	computer = c
    	file = computer.File(origFile)
    	if file == null then
    		error("mv: can't find " + origFile)
    	else
    		newName = ""
    		folder = computer.File(destFolder)
    		if folder == null then
    			//Check if the user wants to put a new name.
    			pathParent = parent_path(destFolder)
    			if pathParent == destFolder then			
    				newName = destFolder
    				destFolder = file.parent.path		
    				file.move(destFolder, newName)
    			else
    				folder = computer.File(pathParent)
    				newName = destFolder[destFolder.len - (destFolder.len - pathParent.len):]			
    				if newName[0] == "/" then
    					newName = newName[1:]
    				end if
    				if folder == null then				
    					error("mv: can't copy file. " + destFolder + " doesn't exist.")
    				end if			
    			end if
    		end if
    		if folder != null then
    			//Check if is trying to copy the file on itself. Ignored.
    			if file.parent.path != folder.parent.path or file.name != folder.name then
    				finalDest = folder.path
    				if(newName.len == 0) then
    					newName = file.name
    				end if
    				if not folder.is_folder then			
    					finalDest = file.parent.path
    					newName = folder.name
    				end if
    				if file.parent.path == folder.parent.path and newName != file.name then
    					file.rename(newName)
    				else
    					file.move(finalDest, newName)
    				end if
    			end if
    		end if
    	end if
    end if
end function
commands.cp = function(params) // TODO: fix prints and errors
    // command: cp
    if params.len != 2 or params[0] == "-h" or params[0] == "--help" then return self.man(["cp"])
    origFile = params[0]
    destFolder = params[1]
    computer = c
    file = computer.File(origFile)
    if not file then return error("cp: can't find " + origFile)
    newName = ""
    folder = computer.File(destFolder)
    if not folder then
    	//Check if the user wants to put a new name.
    	pathParent = parent_path(destFolder)
    	if pathParent == destFolder then			
    		newName = destFolder
    		destFolder = file.parent.path		
    		output = file.copy(destFolder, newName)
    		if output and output != 1 then error(output)
    		return
    	end if	
    	folder = computer.File(pathParent)
    	newName = destFolder[destFolder.len - (destFolder.len - pathParent.len):]			
    	if newName[0] == "/" then
    		newName = newName[1:]
    	end if
    	if not folder then return error("cp: can't copy file. " + destFolder + " doesn't exist.")
    end if
    if folder then
    	//Check if is trying to copy the file on itself. Ignored.
    	if file.parent.path != folder.parent.path or file.name != folder.name then
    		finalDest = folder.path
    		if(newName.len == 0) then
    			newName = file.name
    		end if
    		if not folder.is_folder then			
    			finalDest = file.parent.path
    			newName = folder.name
    		end if
    		output = file.copy(finalDest, newName)
    		if output and output != 1 then error(output)
    	end if
    end if
end function
commands.ssh = function(params) // TODO: add privacy-ssh
    error("ssh: not implemented yet")
end function
commands.ftp = function(params) // TODO: remove this command??
    //Command: ftp
    if params.len < 2 or params.len > 3 then return error("ftp_usage")
    credentials = params[0].split("@")
    user = credentials[0]
    password = credentials[1]
    port = 21
    // params is a list of strings, so you have to convert it to integer, which is what connect_service accepts.
    if params.len == 3 then port = params[2].to_int
    if typeof(port) != "number" then return error("Invalid port: " + port)
    print("Connecting...")
    ftp_shell = s.connect_service(params[1], port, user, password, "ftp")
    if ftp_shell then ftp_shell.start_terminal
end function
commands.mkdir = function(params) // TODO: replace print with error
    // command: mkdir
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then
    	self.man(["mkdir"])
    else
    	computer = c
    	pathFile = params[0]
    	pathParent = parent_path(pathFile)
    	existFile = computer.File(pathFile)
    	if pathParent == pathFile then
    		pathParent = fp
    	end if
    	parent = computer.File(pathParent)
    	if parent == null then
    		error("mkdir: " + pathParent + " not found")
    	else if existFile != null then
    		error("mkdir: " + existFile.path + " file exists")
    	else if not parent.has_permission("w") then
    		error("mkdir: permission denied")
    	else
    		arrayPath = pathFile.split("/")
    		output = computer.create_folder(parent.path, arrayPath[arrayPath.len - 1])
    		if output != null and output != 1 then
    			error(output)
    		end if 
    	end if
    end if
end function
commands.rmdir = function(params) // TODO: fix prints and errors
    // has no man page
    if params.len < 1 or not params[0].trim then return self.man(["rmdir"])
    path = params[0].trim
    if params[0] == "--help" then return self.man(["rmdir"])
    f = c.File(path)
    if typeof(f) != "file" then return error("rmdir: failed to remove '" + path + "': no such file or directory") // fix this
    if f.is_folder == 0 then return error("Error: " + f.name + " is not a directory.")
    if f.get_files.len >= 1 or f.get_folders.len >= 1 then return error("rmdir: failed to remove '" + path + "': directory not empty") // fix this
    fd = f.delete
    if fd.trim.len == 0 then return
    return error("rmdir: failed to remove '" + path + "': " + fd.trim) // fix this
end function
commands.chmod = function(params) // TODO: fix prints and errors
    // command: chmod
    if params.len < 2 or (params.len == 3 and params[0] != "-R") then return self.man(["chmod"])
    permissions = params[0]
    pathFile = params[1]
    isRecursive = 0
    if params.len == 3 then
        permissions = params[1]
    	pathFile = params[2]
    	isRecursive = 1
    end if
    file = c.File(pathFile)
    if file == null then return error("chmod: can't find " + pathFile) // fix this
    output = file.chmod(permissions, isRecursive)
    if output then error(output) // fix this ???
end function
commands.whois = function(params) // feature complete
    // command: whois
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then
        return self.man(["whois"])
    else
    	address = params[0]
    	print(whois(address))
    end if
end function
commands.useradd = function(params) // TODO: fix prints and errors
    // command: useradd
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return self.man(["useradd"])

    inputMsg = "Setting password for user " + params[0] +".\nNew password: "
    inputPass = user_input(inputMsg, true)

    output = c.create_user(params[0], inputPass)
    if output == true then return print("User created OK")
    if output then error(output) // fix this ??
    error("Error: the user could not be created.") // fix this ???
end function
commands.userdel = function(params) // TODO: START HERE
    // command: userdel
    if not params.len or (params.len == 1 and params[0] == "-r") or params[0] == "-h" or params[0] == "--help" then return self.man(["userdel"])
    delete = 0
    if params[0] == "-r" then
      delete = 1
      params.pull
    end if
    output = c.delete_user(params[0], delete)
    if output == true then return print("user " + params[0] + " deleted.")
    if output then return error(output)
    error("Error: user not deleted.")
end function
commands.passwd = function(params) // TODO: fix prints and errors
    // command: passwd
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return self.man(["passwd"])
    inputMsg = "Changing password for user " + params[0] +".\nNew password:"
    inputPass = user_input(inputMsg, true)
    output = c.change_password(params[0], inputPass)
    if output == true then return print("password modified OK")
    if output then return error(output)
    error("Error: password not modified")
end function
commands.nslookup = function(params) // Final
    // command: nslookup
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then
    	self.man(["nslookup"])
    else
    	address = params[0]
    	print("Address: "+nslookup(address));
    end if
end function
commands.build = function(params) // Final
    // command: build
    if params.len != 2 then
    	self.man(["build"])
    else
    	pathSource = params[0]
    	programPath = params[1]
    	shell = s
    	computer = shell.host_computer
    	fileSource = computer.File(pathSource)
    	folderDest = computer.File(programPath)
    	if fileSource == null then return error("build: can't find "+ pathSource)
    	if folderDest == null then return error("build: can't find " + programPath)
    	output = shell.build(fileSource.path, folderDest.path)
    	if output.len == 0 then
    		print("build successful.")
    	else
    		error(output);
    	end if
    end if
end function
commands.touch = function(params) // final
    // command: touch
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return self.man(["touch"])
    pathFile = params[0]
    pathParent = parent_path(pathFile)
    computer = c
    if pathParent == pathFile then
    	pathParent = fp
    end if
    parent = computer.File(pathParent)
    if not parent then return error("touch: " + pathParent + " not found")
    if not parent.has_permission("w") then return error("touch: permission denied")
    arrayPath = pathFile.split("/")
    output = computer.touch(parent.path, arrayPath[arrayPath.len - 1])
    if output and output != 1 then error(output)
end function
commands.chown = function(params) // final
    // command: chown
    if params.len < 2 or (params.len == 3 and params[0] != "-R") then return self.man(["chown"])
    owner = params[0]
    pathFile = params[1]
    isRecursive = 0
    if params.len == 3 then
        owner = params[1]
        pathFile = params[2]
        isRecursive = 1
    end if
    file = c.File(pathFile)
    if file == null then return error("chown: file not found: "+pathFile)
    output = file.set_owner(owner, isRecursive)
    if output then error(output)
end function
commands.chgrp = function(params) // final
    // command: chgrp
    if params.len < 2 or (params.len == 3 and params[0] != "-R") then return self.man(["chgrp"])
    group = params[0]
    pathFile = params[1]
    isRecursive = 0
    if params.len == 3 then
        group = params[1]
        pathFile = params[2]
        isRecursive = 1
    end if
    file = c.File(pathFile)
    if file == null then return error("chgrp: file not found: "+pathFile)
    output = file.set_group(group, isRecursive)
    if output then error(output)
end function
commands.groupadd = function(params) // final
    // command: groupadd
    if params.len != 2 or params[0] == "-h" or params[0] == "--help" then return self.man(["groupadd"])
    user = params[0]
    group = params[1]
    output = c.create_group(user, group)
    if output == true then return print("Group " + group + " added to user " + user)
    if output then return error(output)
    error("Error: the group could not be created.")
end function
commands.groupdel = function(params) // final
    // command: groupdel
    if params.len != 2 or params[0] == "-h" or params[0] == "--help" then return self.man(["groupdel"])
    user = params[0]
    group = params[1]
    output = c.delete_group(user, group)
    if output == true then return print("Group " + group + " deleted from user " + user)
    if output then return error(output)
    error("Error: the group could not be deleted.")
end function
commands.groups = function(params) // final
    // command: groups
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return self.man(["groups"])
    user = params[0]
    output = c.groups(user)
    if not output then return self.man(["groups"])
    if output.indexOf("Error:") == 0 then return error(ouput)
    print(output)
end function
commands.kill = function(params) // final
    // command: kill
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return self.man(["kill"])
    PID = params[0].to_int
    if typeof(PID) != "number" then return error("The PID must be a number\n" + self.man(["kill"]))
    output = c.close_program(PID)
    if output == true then return print("Process " + PID + " closed");
    if output then return error(output)
    print("Process " + PID + " not found")
end function
commands.ping = function(params) // TODO: fix prints and errors
    //Command: ping
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return error("ping_usage")
    result = s.ping(params[0])
    if result then
        if typeof(result) == "string" then
            print(result) 
    	else
    	    print("Ping successful")
    	end if
    else
    	print("ip unreachable")
    end if
end function
commands.pacman = function(params) // TODO: custom usage and errors
    // command: pacman
    aptclient = include_lib("/lib/aptclient.so")
    if not aptclient then
        aptclient = include_lib(fp + "/aptclient.so")
    end if
    if not aptclient then return error("Error: Missing aptclient.so library in the /lib path or the current folder")
    PendingUpdating = function(folderPath)
    	pendingUpdate = []
    	targetFolder = c.File(folderPath)
    	if targetFolder != null then
    		files = targetFolder.get_files
    		for itemFile in files
    			output = aptclient.check_upgrade(itemFile.path)
    			if output == true then
    				pendingUpdate.push(itemFile.name)
    			end if
    		end for
    	end if
    	return pendingUpdate
    end function 
    if params.len == 0 or params.len > 3 then return self.man(["apt-get"]) // fix this
    action = params[0]
    if action == "-Sy" then
        print("Updating package lists...")
    	output = aptclient.update
    	if output then error(output)
    else if action == "-S" then
        print("Reading package lists...")
    	if params.len != 2 then return error("apt-get_usage") // fix this
    	print("Downloading " + params[1])
    	output = aptclient.install(params[1])
    	if output == true then return error(params[1] + " installed")
    	error(output)
    else if action == "-Ss" then
    	if params.len != 2 then return error("apt-get_usage") // fix this
    	print(aptclient.search(params[1]))
    else if action == "show" then // show repo address // custom 
    	if params.len != 2 then return error("apt-get_usage") // fix this
    	print(aptclient.show(params[1]))
    else if action == "-A" then // make something up // add repo
    	if params.len < 2 or params.len > 3 then return error("apt-get_usage") // fix this
        port = 1542
        if params.len == 3 then port = params[2]
    	output = aptclient.add_repo(params[1])
    	if output then return error(output)
    	print("Repository " + params[1] + " added succesfully.\nLaunch apt with the update option to apply the changes")
    else if action == "-D" then // make something up // delete repo
       	if params.len != 2 then return error("apt-get_usage") // fix this
        output = aptclient.del_repo(params[1])
        if output then return error(output) // fix this
        print("Repository " + params[1] + " removed succesfully.\nLaunch pacman -Sy")
    else if action == "-Syu" then
        print("Reading package lists...")
    	//upgrade all packages
    	if params.len == 1 then
    		pendingPackages = PendingUpdating("/lib") + PendingUpdating("/bin")
    		if pendingPackages.len == 0 then return error("No updates needed")
    		print("The following packages will be updated:")
    		pkgs = ""
    		for itemPackage in pendingPackages
    			pkgs = pkgs + " " + itemPackage
    		end for
    		print(pkgs)
    		option = user_input("\nDo you want to continue?(y/n): ")
    		if option == "y" or option == "yes" then
    			counter = 0
    			for itemPackage in pendingPackages
    				output = aptclient.install(itemPackage)
    				if output == true then
    					counter = counter + 1
    				else if output then
    					error(output)
    				end if
    			end for
    			print(counter + " packages updated")
    		else 
    			return error("aborted")
    		end if
    	//upgrade specific package
    	else if params.len == 2 then
    		output = aptclient.check_upgrade(params[1])
    		if not output then return error("No updates needed")
    		if output == true then
    			print("The following package will be updated:\nparams[1]")
    			option = user_input("\nDo you want to continue?(y/n): ")
    			if option == "y" or option == "yes" then
    				output = aptclient.install(params[1])
    				if output == true then return error(params[1] + " installed.")
    				error(output)				
    			else 
    				print("aborted")
                    return
    			end if
    		else 
    			error(output)
    		end if
    	end if
    else 
    	print "pacman usage" // fix this 
    end if
end function
commands.whoami = function(params) // TODO: fix prints and errors
    //Command: whoami
    print(active_user)
end function
commands.airmon = function(params) // TODO: fix prints and errors
    // command: airmon
    cryptools = include_lib("/lib/crypto.so")
    if not cryptools then return error("Error: Missing crypto library")
    if params.len > 0 and (params.len != 2 or params[0] == "-h" or params[0] == "--help") then return error("airmon_usage")
    computer = c
    formatOutput = "Interface Chipset Monitor_Mode\n"
    if params.len == 0 then	return error(format_columns(formatOutput + computer.network_devices))
    option = params[0]
    device = params[1]
    if option != "start" and option != "stop" then return error("airmon_usage")
    output = cryptools.airmon(option, device)
    if not output then return error("airmon: " + device + " not found")
    if typeof(output) == "string" then return error(output)
    print(format_columns(formatOutput + computer.network_devices))
end function
commands.aireplay = function(params) // TODO: calculate when to stop automatically
    // command: aireplay
    cryptools = include_lib("/lib/crypto.so")
    if not cryptools then return error("Error: Missing crypto library")
    if params.len != 4 or params[0] == "-h" or params[0] == "--help" or params[0] != "-b" or params[2] != "-e" then return error("aireplay_usage")
    bssid = params[1]
    essid = params[3]
    result = cryptools.aireplay(bssid, essid)
    if typeof(result) == "string" then return error(result)
end function
commands.aircrack = function(params) // TODO: fix prints and errors
    // command: aircrack
    cryptools = include_lib("/lib/crypto.so")
    if not cryptools then return error("Error: Missing crypto library")
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then return error("aircrack_usage")
    pathFile = params[0]
    file = c.File(pathFile)
    if file == null then return error("aircrack: file not found: "+pathFile)
    if not file.is_binary then return error("aircrack: Can't process file. Not valid filecap.")		
    if not file.has_permission("r") then return error("aircrack: permission denied")
    key = cryptools.aircrack(file.path)
    if key then 
    	print("KEY FOUND! [" + key + "]" )
    else 
    	print("aircrack: Unable to get the key" )
    end if
end function
commands.sudo = function(params) // testing
    // command: sudo
    if not params or params[0] == "-h" or params[0] == "--help" then return self.man(["sudo"])
    if params[0] == "-u" and params.len != 2 then return self.man(["sudo"])
    inputPass = user_input("Password: ", true)
    if params[0] == "-u" then
    	shell = get_shell(params[1], inputPass)
    	if not shell then return error("sudo: incorrect username or password")
    else 
    	shell = get_shell("root", inputPass)
    	if not shell then return error("sudo: incorrect password")
    end if
    if params[0] == "-s" then 
        globals.s = shell
        globals.c = shell.host_computer
        globals.au = "root"
        globals.fp = "/root"
    else if params[0] == "-u" then
        globals.s = shell
        globals.c = shell.host_computer
        globals.au = params[1]
        globals.fp = "/home/" + params[1]
    else
    	computer = shell.host_computer
    	args = params[1:].join(" ")
    	if not params[0].indexOf("/") then
    		globalPath = [fp, "/bin", "/usr/bin"]
    		for path in globalPath
    			program = computer.File(path + "/" + params[0])
    			if program != null then
    			    shell.launch(program.path, args) 
    			    return
    			end if
    		end for
    	else
    		program = computer.File(params[0])
    		if not program then return error(params[0] + " not found.")
    		shell.launch(program.path, args)
    	end if
    end if
end function
commands.nmap = function(params) // final
    //command: nmap
    if params.len != 1 or params[0] == "-h" or params[0] == "--help" then self.man(["nmap"])	
    if not is_valid_ip(params[0]) then return error("nmap: invalid ip address")
    if not get_shell.host_computer.is_network_active then return error("nmap: No internet access.")

    ipAddress = params[0]
    isLanIp = is_lan_ip( ipAddress )

    if isLanIp then
       router = get_router;
    else 
       router = get_router( ipAddress )
    end if

    if router == null then return error("nmap: ip address not found")
    ports = null

    if not isLanIp then
       ports = router.used_ports
    else
       ports = router.device_ports(ipAddress)
    end if

    if ports == null then return error("nmap: ip address not found")
    if typeof(ports) == "string" then return error(ports)

    info = "PORT STATE SERVICE VERSION LAN"   
    if(ports.len == 0) then return print("Scan finished. No open ports.")

    for port in ports
       service_info = router.port_info(port)
       lan_ips = port.get_lan_ip
       port_status = "open"

       if(port.is_closed and not isLanIp) then
          port_status = "closed"
       end if
       info = info + "\n" + port.port_number + " " + port_status + " " + service_info + " " + lan_ips
    end for
    print(format_columns(info) + "\n")
end function