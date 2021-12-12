
class Turtle {
    constructor(x, y, angle){
        this.isPenDown = true;
        this.isShowTurtle = true;
        this.startPos = createVector(x, y);
        this.startAngle = angle;

        this.rot = 0;

        translate(x, y);
        rotate(angle);
    }

    moveForward(distance){
        if( this.isPenDown ){
            stroke(255);
            line(0, 0, distance, 0);
        }

        translate(distance, 0);
    }

    moveBackward(distance){
        this.moveForward(-distance);
    }

    turnRight(angle){
        rotate(angle);
        this.rot += angle;
    }

    turnLeft(angle){
        this.turnRight(-angle);
    }

    penUp(){
        this.isPenDown = false;
    }

    penDown(){
        this.isPenDown = true;
    }

    hideTurtle(){
        this.isShowTurtle = false;
    }

    showTurtle(){
        this.isShowTurtle = true;
    }

    goHome(){
        resetMatrix();
        translate(this.startPos);
        rotate(this.startAngle);
        this.rot = 0;
    }

    write(txt){
        fill(255)
        noStroke();
        text(txt, 0, 0);
    }

    show(){
        if( !this.isShowTurtle ){ return; }

        fill(0, 255, 0, 200);
        noStroke();
        triangle(16, 0, 0, -8, 0, 8)
    }

    goTo(x, y){
        resetMatrix();
        translate(this.startPos.x + x, this.startPos.y - y);
        rotate( this.startAngle + this.rot);
    }
}