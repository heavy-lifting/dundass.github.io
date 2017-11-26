from Tkinter import *

ctrlenter = [False, False]

def keyup(e):
    #print 'up', e.keysym
    if "Control" in e.keysym:
        ctrlenter[0] = False
    elif e.keysym == "Return":
        ctrlenter[1] = False
    print ctrlenter

def keydown(e):
    #print 'down', e.keysym
    if "Control" in e.keysym:
        ctrlenter[0] = True
    elif e.keysym == "Return":
        ctrlenter[1] = True
    print ctrlenter
    if ctrlenter[0] and ctrlenter[1]:
        sendplive()
        return "break"

def onclick():
    pass

def sendplive():
    print "update p5"

root = Tk()
text = Text(root)
text.insert(INSERT, "draw_ = function() { \n background(0);\n}")
text.bind("<KeyPress>", keydown)
text.bind("<KeyRelease>", keyup)
text.pack()
text.focus_set()

root.mainloop()
