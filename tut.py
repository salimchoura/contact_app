import turtle


def triangle(height):
    turtle.penup()
    turtle.goto(100,100)
    turtle.pendown()
    turtle.goto(200,100)
    turtle.goto(150,height)
    turtle.goto(100,100)

def square1():
    turtle.penup()
    turtle.goto(-150,150)
    turtle.pendown()
    turtle.goto(-100,100)
    turtle.goto(-50,150)
    turtle.goto(-100,200)
    turtle.goto(-150,150)

def square2():
    turtle.penup()
    turtle.goto(-150,150)
    turtle.pendown()
    turtle.goto(-200,200)
    turtle.goto(-250,150)
    turtle.goto(-200,100)
    turtle.goto(-150,150)


def circle(x,y):
    turtle.penup()
    turtle.goto(x,y)
    turtle.pendown()
    turtle.circle(30)





def three_d_shape():
    turtle.penup()
    turtle.goto(-150,0)
    turtle.pendown()

    turtle.goto(-100,0)
    turtle.goto(-100,-50)
    turtle.goto(-150,-50)
    turtle.goto(-150,0)

    turtle.goto(-200,0)
    turtle.goto(-200,50)
    turtle.goto(-150,50)
    turtle.goto(-150,0)

    turtle.goto(-200,50)
    turtle.goto(-150,0)
    turtle.goto(-100,-50)

    turtle.goto(-150,-50)
    turtle.goto(-200,0)

    turtle.penup()
    turtle.goto(-100,0)
    turtle.pendown()
    turtle.goto(-150,50)





def draw_circle():
    turtle.penup()
    turtle.goto(-150,-250)
    turtle.pendown()
    turtle.circle(25)

def draw_cross():
    # Vertical line
    turtle.penup()
    turtle.goto(-150,-100)
    turtle.pendown()
    turtle.goto(-150,-330)

    # Horizontal line
    turtle.penup()
    turtle.goto(-275,-225)
    turtle.pendown()
    turtle.goto(-25,-225)

def label_directions():
    directions = [("North", -150,-100), ("East", 0,-225), ("South", -150,-350), ("West", -300,-225)]
    for label, x, y in directions:
        turtle.penup()
        turtle.goto(x, y)
        turtle.pendown()
        turtle.write(label, align="center", font=("Arial", 12, "normal"))




t = turtle.Turtle()

t.speed(100)


def main():
    turtle.speed(100)

    triangle(200)
    triangle(150)

    square1()
    square2()

    circle(50,0)
    circle(125,0)
    circle(200,0)

    circle(85,-32)
    circle(160,-32)

    three_d_shape()


    draw_circle()
    draw_cross()
    label_directions()

    turtle.penup()
    turtle.goto(100,-100)
    turtle.pendown()
    turtle.fillcolor("black")

    turtle.goto(100,-100)
    turtle.begin_fill()
    turtle.circle(3)
    turtle.end_fill()
    turtle.goto(100,-200)
    turtle.begin_fill()
    turtle.circle(3)
    turtle.end_fill()
    turtle.goto(200,-100)
    turtle.begin_fill()
    turtle.circle(3)
    turtle.end_fill()
    turtle.goto(200,-200)
    turtle.begin_fill()
    turtle.circle(3)
    turtle.end_fill()
    turtle.goto(100,-100)

    turtle.penup()
    turtle.goto(150,-150)
    turtle.pendown()
    turtle.begin_fill()
    turtle.circle(3)
    turtle.end_fill()

    turtle.penup()
    turtle.goto(100,-100)
    turtle.pendown()

    for i in range(6):
        turtle.goto(100+(100/6)*(i+1),-100)
        if i % 2 == 0:
            turtle.penup()
        if i % 2 == 1:
            turtle.pendown()

    turtle.penup()
    turtle.goto(100,-200)
    turtle.pendown()

    for i in range(6):
        turtle.goto(100+(100/6)*(i+1),-200)
        if i % 2 == 0:
            turtle.penup()
        if i % 2 == 1:
            turtle.pendown()

    turtle.hideturtle()
    turtle.done()

if __name__ == "__main__":
    main()


