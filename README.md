# 🧱 Board game constructor

User friendly engine for creating custom board games

![screenshot_grouping](advertisment.jpg)

## Features

* Defining a game by JSON file
* File structure is designed to be easy-readable yet flexible
* Rich board defining possibilities
* Supports defining complex moves like castling and *en passant*
* Integrated state machine for game states handling

## Config file structure description

Root structure is key-value. Fields are:

`name` -- game name (example: `"chess"`)

```json
"name": "intellector"
```

`players` -- list of players names (example: `["white", "black"]`)

```json
"players": ["white", "black"]
```

`cel` -- object that defines cells space and how to display them

`cell.coordinates_names` -- names of dimensions of space where cells are located

`cell.geometry` -- list of (x, y)-points, defines polygon that is drawn as cell

```json
"geometry": [
	[0.9,	0.39],
	[0.675,	0.78],
	[0.225,	0.78],
	[0,		0.39],
	[0.225,	0],
	[0.675,	0]
]
```

`cell.position` -- object that defines how cell screen coordinates are calculated, each coordinate defined by JavaScript expression

```json
"position": {
	"x": "x * 0.675",
	"y": "(y + x / 2) * 0.78"
}
```

`cell.colors` -- object that defines cells colors, each color defined by JavaScript expression

```json
"colors": {
	"fill": "((!(x % 3) && !((x + y) % 3)) || (!((x + 1) % 3) && !((x + y + 2) % 3)) || (!((x + 2) % 3) && !((x + y + 1) % 3))) ? 'grey' : 'white'"
}
```

`board` -- object that defines which cells are in board and how to rotate board accordingly to current move's player

```json
"board": {
	"rotation_angle": {
		"white": 180,
		"black": 0
	},
	"cells": [
		{"x": 0, "y": 0},
		{"x": 0, "y": 1},
		{"x": 0, "y": 2},
        ...
	]
}
```

`figures` -- object that defines how figures can action

```json
"figures": {
    "intellector": {...},
    "defensor": {...},
    ...
}
```

`figures.some_figure_name` -- object that defines how `some_figure_name` can action

```json
"intellector": {
    "movement": [{...}, {...}, ...],
    "cell_actions": {...}
}
```

`figures.some_figure_name.movement` -- list of available movements

```json
"movement": [{
    "x": 1,
    "also_reversed": true
}, {
    "y": 1,
    "also_reversed": true
}]
```

`figures.some_figure_name.movement[]` -- movement description

* keys which are dimensions names (`"x"`, `"y"` for example), describes move coordinates delta
* `"cell_actions"` is an object that describes *actions*, which should be done if move fits coordinates delta
* *action* can be of type `destionation` or `transition`
* `destination` means that *action* processed for destination cell
* `transition` means that *action* processed for cells that the figure should *transit* in order to reach destination
* cell treats as *transition* for some *action* if figure can reach it using this and only this *action*

```json
{
    "y": 2,
    "cell_actions": {
        "destination": [{
            "actions": ["move"],
            "if": [{
                "self": {
                    "moves_made": 0
                },
                "computed": {
                    "is_figure": false
                }
            }]
        }],
        "transition": [{
            "actions": ["cancel"],
            "if": [{
                "computed": {
                    "is_figure": true
                }
            }, {
                "computed": {
                    "is_cell": false
                }
            }]
        }]
    }
}
```

