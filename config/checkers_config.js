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
				'also_reversed': true,
				'repeat': true
			}, {
				'x': 1,
				'y': -1,
				'also_reversed': true,
				'repeat': true
			}],
			'cell_actions': {
				'destination': [{
					'actions': ['move'],
					'if': {
						'computed': {
							'is_figure': false
						}
					}
				}],
				'transition': [{
					'actions': ['take'],
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}, {
					'actions': ['cancel'],
					'if': {
						'computed': {
							'distance': 
						}
					}
				}]
			}
		}
	},
	'initial_position': {
		'white': {
			'checker': [
				{'x': 3, 'y': 2}
			]
		},
		'black': {
			'checker': [
				{'x': 3, 'y': 4}
			]
		}
	},
	'win_conditions': {
		'white': [{
			'entity': 'cell',
			'filter': {
				'player': 'black',
				'figure': 'checker'
			},
			'type': 'exists',
			'result': false
		}],
		'black': [{
			'entity': 'cell',
			'filter': {
				'player': 'white',
				'figure': 'checker'
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