from Tkinter import *
import socket

HOST = "localhost"
PORT = 3000
ctrlenter = [False, False]
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))

def keyup(e):
    #print 'up', e.keysym
    if "Control" in e.keysym:
        ctrlenter[0] = False
    elif e.keysym == "Return":
        ctrlenter[1] = False
    #print ctrlenter

def keydown(e):
    #print 'down', e.keysym
    if "Control" in e.keysym:
        ctrlenter[0] = True
    elif e.keysym == "Return":
        ctrlenter[1] = True
    #print ctrlenter
    if ctrlenter[0] and ctrlenter[1]:
        sendplive()
        return "break"

def onclick():
    pass

root = Tk()
text = Text(root)
text.insert(INSERT, "draw_ = function() { \n background(0);\n}")
text.bind("<KeyPress>", keydown)
text.bind("<KeyRelease>", keyup)
text.pack()
text.focus_set()

def sendplive():
    print "update p5"
    print text.get("1.0", END)
    sock.sendall(str(text.get("1.0", END)))

root.mainloop()
