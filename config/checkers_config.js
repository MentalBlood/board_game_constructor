const config = {
	'players': ['white', 'black'],
	'cell': {
		'coordinates_names': ['x', 'y'],
		'geometry': [
			[0,	0],
			[0,	1],
			[1,	1],
			[1,	0]
		],
		'position': {
			'x': 'x * size',
			'y': 'y * size'
		},
		'colors': {
			'white': {
				'cell': 'white',
				'text': 'black'
			},
			'black': {
				'cell': 'black',
				'text': 'white'
			},
			undefined: {
				'cell': 'darkgrey',
				'text': 'black'
			}
		}
	},
	'board': [],
	'figures': {
		'checker': {
			'movement': [{
				'x': 1,
				'y': 1,
				'also_reversed': true
			}, {
				'x': 1,
				'y': -1,
				'also_reversed': true
			}],
			'cell_actions': {
				'transition': [{
					'action': 'take',
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}]
			}
		}
	},
	'initial_position': {
		'white': {
			'intellector': [
				{'x': 4, 'y': -2}
			],
			'dominator': [
				{'x': 0, 'y': 0},
				{'x': 8, 'y': -4}
			],
			'aggressor': [
				{'x': 2, 'y': -1},
				{'x': 6, 'y': -3},
			],
			'defensor': [
				{'x': 3, 'y': -1},
				{'x': 5, 'y': -2}
			],
			'liberator': [
				{'x': 1, 'y': 0},
				{'x': 7, 'y': -3}
			],
			'progressor': [
				{'x': 0, 'y': 1},
				{'x': 2, 'y': 0},
				{'x': 4, 'y': -1},
				{'x': 6, 'y': -2},
				{'x': 8, 'y': -3}
			]
		},
		'black': {
			'intellector': [
				{'x': 4, 'y': 4}
			],
			'dominator': [
				{'x': 0, 'y': 6},
				{'x': 8, 'y': 2}
			],
			'aggressor': [
				{'x': 2, 'y': 5},
				{'x': 6, 'y': 3},
			],
			'defensor': [
				{'x': 3, 'y': 4},
				{'x': 5, 'y': 3}
			],
			'liberator': [
				{'x': 1, 'y': 5},
				{'x': 7, 'y': 2}
			],
			'progressor': [
				{'x': 0, 'y': 5},
				{'x': 2, 'y': 4},
				{'x': 4, 'y': 3},
				{'x': 6, 'y': 2},
				{'x': 8, 'y': 1}
			]
		}
	},
	'win_conditions': {
		'white': [{
			'entity': 'cell',
			'filter': {
				'player': 'black',
				'figure': 'intellector'
			},
			'type': 'exists',
			'result': false
		}],
		'black': [{
			'entity': 'cell',
			'filter': {
				'player': 'white',
				'figure': 'intellector'
			},
			'type': 'exists',
			'result': false
		}]
	},
	'game_states': {
		'white_move': {
			'type': 'move',
			'parameters': {
				'player': 'white'
			},
			'next': 'check_white_win'
		},
		'black_move': {
			'type': 'move',
			'parameters': {
				'player': 'black'
			},
			'next': 'check_black_win'
		},
		'check_white_win': {
			'type': 'check_win',
			'parameters': {
				'player': 'white'
			},
			'next': [{
				'state': 'black_move',
				'if': {
					'result': false
				}
			}, {
				'state': 'white_won',
				'if': {
					'result': true
				}
			}]
		},
		'check_black_win': {
			'type': 'check_win',
			'parameters': {
				'player': 'black'
			},
			'next': [{
				'state': 'white_move',
				'if': {
					'result': false
				}
			}, {
				'state': 'black_won',
				'if': {
					'result': true
				}
			}]
		},
		'white_won': {
			'type': 'end'
		},
		'black_won': {
			'type': 'end'
		}
	},
	'initial_game_state': 'white_move'
}

for (let x = 0; x < 8; x++)
	for (let y = 0; y < 8; y++)
		config.board.push({'x': x, 'y': y});