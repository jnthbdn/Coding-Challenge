# LOGO Parser :turtle: - Coding Challenge (#[121.1](https://youtu.be/i-k04yzfMpw) & #[121.2](https://youtu.be/aOqEm101fms)) by [The Coding Train](https://thecodingtrain.com/)


![screenshot](screenshot.png)

## Introduction
The challenge is to write a simple parser (with [P5.js](https://p5js.org/)) for the  [LOGO](https://en.wikipedia.org/wiki/Logo_(programming_language)) programming language.

## :turtle: Requirements
  - A computer connected to internet (It should be fine is you read this....)
  - A simple HTTP server (ex: `python3 -m server.http`)

## :turtle: How to run it ?
Download the repo. files and simply run your http server in the same folder.

## :turtle: Useful Links
  - [Wikipedia](https://en.wikipedia.org/wiki/Logo_(programming_language))
  - [P5.js reference](https://p5js.org/reference/)
  - [Logo tutorial](http://cs.brown.edu/courses/bridge/1997/Resources/LogoTutorial.html)
  - [Logo foundation](https://el.media.mit.edu/logo-foundation/)
  - [Shunting-yard algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)

## :turtle: Language
Here you can find all the supported LOGO lang features by this parser.

### :turtle: Commands
| Command  | Arguments                                                   | Description                                                                |  Available ?   |
| :------- | :---------------------------------------------------------- | :------------------------------------------------------------------------- | :------------: |
| `fd`     | **distance**                                                | Move the turtle foward by `distance` pixel                                 | :green_heart:  |
| `bk`     | **distance**                                                | Move the turtle backward by `distance` pixel                               | :green_heart:  |
| `rt`     | **angle**                                                   | Turn the turtle to the right by `angle` degrees                            | :green_heart:  |
| `lt`     | **angle**                                                   | Turn the turtle to the left by `angle` degrees                             | :green_heart:  |
| `cs`     |                                                             | Clear the screen                                                           | :green_heart:  |
| `pu`     |                                                             | Hold the pen up (no drawing)                                               | :green_heart:  |
| `pd`     |                                                             | Hold the pen down (drawing)                                                | :green_heart:  |
| `ht`     |                                                             | Not showing the turtle                                                     | :green_heart:  |
| `st`     |                                                             | Show the turtle                                                            | :green_heart:  |
| `home`   |                                                             | Go back to the start position (and rotation)                               | :green_heart:  |
| `label`  | **value**                                                   | Write the text between double quote `"..."` at the turtle position         | :green_heart:  |
| `setxy`  | **xpos** **ypos**                                           | Go to the position defined by `xpos` for X axis and `ypos` for Y axis*     | :green_heart:  |
| `repeat` | **nb** **[** _expression_ **]**                             | Execute `nb` times the expression between brackets `[ ... ]`               | :green_heart:  |
| `make`   | **"**__name__ **value**                                     | Create variable (named `name`) with the value `value`                      | :green_heart:  |
| `print`  | **value**                                                   | Print a `value` in the compilation console                                 | :green_heart:  |
| `if`     | **lValue** **operator** **rValue** **[** _expression_ **]** | Execute the expression between brackets `[ ... ]` if the condition is true | :green_heart:  |
| `to`     | **name** **:**_parameters_ __expression__ **end**           | Create a callable procedure named `name` with parameters                   | :broken_heart: |


\* The (0, 0) point is the home position (it should be the center of the screen), the rotation will be the same. 


### :turtle: Arithmetic functions

| Function | Arguments       | Description                                 |  Available ?  |
| :------- | :-------------- | :------------------------------------------ | :-----------: |
| `random` | **max**         | Get a random number between 0 and `max`     | :green_heart: |
| `cos`    | **angle**       | Get the cosinus of `angle`  (in degrees)    | :green_heart: |
| `sin`    | **angle**       | Get the sinus of `angle` (in degrees)       | :green_heart: |
| `tan`    | **angle**       | Get the tangent of `angle` (in degrees)     | :green_heart: |
| `arccos` | **value**       | Get the arc cosinus (in degrees) of `value` | :green_heart: |
| `arcsin` | **value**       | Get the arc sinus (in degrees) of `value`   | :green_heart: |
| `arctan` | **value**       | Get the arc tangent (in degrees) of `value` | :green_heart: |
| `sqrt`   | **value**       | Get the square root of `value`              | :green_heart: |
| `ln`     | **value**       | Get the natural logarithm of `value`        | :green_heart: |
| `power`  | **value** **p** | Get the result of `value` to the `p` power  | :green_heart: |


### :turtle: Other

| Feature    | Description                                                   |  Available ?  |
| :--------- | :------------------------------------------------------------ | :-----------: |
| Arithmetic | Support arithmetic operations (`+`, `-`, `/`, `*` )           | :green_heart: |
| Arithmetic | Support parenthesis                                           | :green_heart: |
| Boolean    | Support boolean operations (`>`, `<`, `>=`, `<=`, `==`, `!=`) | :green_heart: |
| Comments   | Everything beetween `;` and the end of the line is not parsed | :green_heart: |


## Syntax Diagram
### language
![language](doc/language.png)

### expression
![expression](doc/expression.png)

### value
![value](doc/value.png)

### numeric_value
![value](doc/numeric_value.png)

### math_function
![math_function](doc/math_function.png)

### operator
![operator](doc/operator.png)

### text_variable
![variable](doc/text_variable.png)

### numeric_variable
![variable](doc/numeric_variable.png)

### number
![number](doc/number.png)

### integer
![integer](doc/integer.png)

### word
![word](doc/word.png)

### string
![string](doc/string.png)

### boolean_operator
![string](doc/boolean_operator.png)
