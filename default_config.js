const default_config = {
	'players': ['white', 'black'],
	'cell': ['x', 'y'],
	'board': [],
	'figures': {
		'intellector': {
			'movement': [{
				'x': 1,
				'also_reversed': true,
			}, {
				'y': 1,
				'also_reversed': true
			}, {
				'x': 1,
				'y': -1,
				'also_reversed': true
			}],
			'cell_actions': {
				'destination': [{
					'action': 'swap',
					'if': {
						'given': {
							'figure': 'defensor'
						},
						'computed': {
							'is_enemy': false
						}
					}
				}]
			}
		},
		'defensor': {
			'movement': [{
				'x': 1,
				'also_reversed': true
			}, {
				'y': 1,
				'also_reversed': true
			}, {
				'x': 1,
				'y': -1,
				'also_reversed': true
			}],
			'cell_actions': {
				'destination': [{
					'action': 'take',
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}]
			}
		},
		'dominator': {
			'movement': [{
				'x': 1,
				'repeat': true,
				'also_reversed': true
			}, {
				'y': 1,
				'repeat': true,
				'also_reversed': true
			}, {
				'x': 1,
				'y': -1,
				'repeat': true,
				'also_reversed': true
			}],
			'cell_actions': {
				'destination': [{
					'action': 'take',
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}]
			}
		},
		'aggressor': {
			'movement': [{
				'x': 1,
				'y': 1,
				'repeat': true,
				'also_reversed': true
			}, {
				'x': 1,
				'y': -2,
				'repeat': true,
				'also_reversed': true
			}, {
				'x': 2,
				'y': -1,
				'repeat': true,
				'also_reversed': true
			}],
			'cell_actions': {
				'destination': [{
					'action': 'take',
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}]
			}
		},
		'liberator': {
			'movement': [{
				'x': 2,
				'also_reversed': true
			}, {
				'y': 2,
				'also_reversed': true
			}, {
				'x': 2,
				'y': -2,
				'also_reversed': true
			}],
			'cell_actions': {
				'destination': [{
					'action': 'take',
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}]
			}
		},
		'progressor': {
			'movement': {
				'white': [{
					'x': 1,
					'cell_actions': {
						'destination': [{
							'action': 'take',
							'if': {
								'computed': {
									'is_enemy': true
								}
							}
						}]
					}
				}, {
					'y': 1
				}, {
					'x': -1,
					'y': 1,
					'cell_actions': {
						'destination': [{
							'action': 'take',
							'if': {
								'computed': {
									'is_enemy': true
								}
							}
						}]
					}
				}],
				'black': [{
					'x': -1,
					'cell_actions': {
						'destination': [{
							'action': 'take',
							'if': {
								'computed': {
									'is_enemy': true
								}
							}
						}]
					}
				}, {
					'y': -1
				}, {
					'x': 1,
					'y': -1,
					'cell_actions': {
						'destination': [{
							'action': 'take',
							'if': {
								'computed': {
									'is_enemy': true
								}
							}
						}]
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

for (let x = 0; x < 9; x++)
	for (let y = 0 - Math.floor(x / 2); y < 7 - x % 2 - Math.floor(x / 2); y++)
		default_config.board.push({'x': x, 'y': y});