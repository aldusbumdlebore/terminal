debug = 1
security = function
	passB = "passwordb" // change later
	passA = "passworda" // this too
	which = (rnd(null) * 100)
	which = round(which, 0)
	if which % 2 == 0 then
		input = user_input("Enter Password B?\n" + char(0))
		if input != passB then exit("Intruder Alert has been sent")
	else
		input = user_input("Enter Password A?\n" + char(0))
		if input != passA then exit("Intruder Alert has been sent")
	end if
end function
string.color = function(color = "white", b = false)
	if b then return "<b><color=" + color + ">" + self + "</color></b>"
	return "<color=" + color + ">" + self + "</color>"
end function
error = function(ecode)
    x = ecode
	to = typeof(x)
    if to == "string" then
        le = x.split(" ")
        cmd = le[0]
        e = join(le[1:], " ")
        print cmd.color("orange", 1) + " " + e.color("yellow", 1)
		return
    end if
end function
cx = function
	self = include_lib(current_path+"/crypto.so")
	if not self then self = include_lib("/lib/crypto.so")
	return self
end function
mx = function
	self = include_lib(current_path+"/metaxploit.so")
	if not self then self = include_lib("/lib/metaxploit.so")
	return self
end function
gr = function(ip)
r = get_router(ip)
return r
end function