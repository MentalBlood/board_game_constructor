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
			'x': 'x',
			'y': 'y'
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
		'man': {
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
					'actions': [{
						'action': 'replace',
						'parameters': {
							'new_figure': 'king'
						}
					}, 'move'],
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
							'is_enemy': false
						}
					}
				}]
			}
		},
		'king': {
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
					'actions': ['cancel'],
					'if': {
						'computed': {
							'is_figure': true
						}
					}
				}, {
					'actions': [{
						'action': 'replace',
						'parameters': {
							'new_figure': 'king'
						}
					}, 'move'],
				}],
				'transition': [{
					'actions': ['take'],
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
			'man': [
				{'x': 1, 'y': 0},
				{'x': 3, 'y': 0},
				{'x': 5, 'y': 0},
				{'x': 7, 'y': 0},
				{'x': 0, 'y': 1},
				{'x': 2, 'y': 1},
				{'x': 4, 'y': 1},
				{'x': 6, 'y': 1},
				{'x': 1, 'y': 2},
				{'x': 3, 'y': 2},
				{'x': 5, 'y': 2},
				{'x': 7, 'y': 2}
			]
		},
		'black': {
			'man': [
				{'x': 0, 'y': 7},
				{'x': 2, 'y': 7},
				{'x': 4, 'y': 7},
				{'x': 6, 'y': 7},
				{'x': 1, 'y': 6},
				{'x': 3, 'y': 6},
				{'x': 5, 'y': 6},
				{'x': 7, 'y': 6},
				{'x': 0, 'y': 5},
				{'x': 2, 'y': 5},
				{'x': 4, 'y': 5},
				{'x': 6, 'y': 5}
			]
		}
	},
	'win_conditions': {
		'white': [{
			'entity': 'cell',
			'filter': {
				'player': 'black',
				'figure': 'man'
			},
			'type': 'exists',
			'result': false
		}],
		'black': [{
			'entity': 'cell',
			'filter': {
				'player': 'white',
				'figure': 'man'
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