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
		'king': {
			'movement': [{
				'x': 1,
				'also_reversed': true
			}, {
				'y': 1,
				'also_reversed': true
			}, {
				'x': 1,
				'y': 1,
				'also_reversed': true
			}, {
				'x': 1,
				'y': -1,
				'also_reversed': true
			}],
			'cell_actions': {
				'destination': [{
					'actions': ['take', 'move'],
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}, {
					'actions': ['move'],
					'if': {
						'computed': {
							'is_figure': false
						}
					}
				}]
			}
		},
		'pawn': {
			'movement': {
				'white': [{
					'y': 2,
					'cell_actions': {
						'destination': [{
							'actions': ['move'],
							'if': {
								'self': {
									'moves_made': 0
								},
								'computed': {
									'is_figure': false
								}
							}
						}],
						'transition': [{
							'actions': ['cancel'],
							'if': {
								'computed': {
									'is_figure': true
								}
							}
						}]
					}
				}, {
					'y': 1,
					'cell_actions': {
						'destination': [{
							'actions': ['move'],
							'if': {
								'computed': {
									'is_figure': false
								}
							}
						}]
					}
				}, {
					'x': 1,
					'y': 1,
					'cell_actions': {
						'destination': [{
							'actions': ['take', 'move'],
							'if': {
								'computed': {
									'is_enemy': true
								}
							}
						}]
					}
				}, {
					'x': -1,
					'y': 1,
					'cell_actions': {
						'destination': [{
							'actions': ['take', 'move'],
							'if': {
								'computed': {
									'is_enemy': true
								}
							}
						}]
					}
				}],
				'black': [{
					'y': -2,
					'cell_actions': {
						'destination': [{
							'actions': ['move'],
							'if': {
								'self': {
									'moves_made': 0
								},
								'computed': {
									'is_figure': false
								}
							}
						}],
						'transition': [{
							'actions': ['cancel'],
							'if': {
								'computed': {
									'is_figure': true
								}
							}
						}]
					}
				}, {
					'y': -1,
					'cell_actions': {
						'destination': [{
							'actions': ['move'],
							'if': {
								'computed': {
									'is_figure': false
								}
							}
						}]
					}
				}, {
					'x': 1,
					'y': -1,
					'cell_actions': {
						'destination': [{
							'actions': ['take', 'move'],
							'if': {
								'computed': {
									'is_enemy': true
								}
							}
						}]
					}
				}, {
					'x': 1,
					'y': -1,
					'cell_actions': {
						'destination': [{
							'actions': ['take', 'move'],
							'if': {
								'computed': {
									'is_enemy': true
								}
							}
						}]
					}
				}]
			}
		},
		'knight': {
			'movement': [{
				'x': 2,
				'y': 1,
				'also_reversed': true
			}, {
				'x': 1,
				'y': 2,
				'also_reversed': true
			}, {
				'x': -2,
				'y': 1,
				'also_reversed': true
			}, {
				'x': 1,
				'y': -2,
				'also_reversed': true
			}],
			'cell_actions': {
				'destination': [{
					'actions': ['move'],
					'if': {
						'computed': {
							'is_figure': false
						}
					}
				}, {
					'actions': ['take', 'move'],
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}]
			}
		},
		'bishop': {
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
				}, {
					'actions': ['take', 'move'],
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}],
				'transition': [{
					'actions': ['cancel'],
					'if': {
						'computed': {
							'is_figure': true
						}
					}
				}]
			}
		},
		'rook': {
			'movement': [{
				'x': 1,
				'also_reversed': true,
				'repeat': true
			}, {
				'y': 1,
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
				}, {
					'actions': ['take', 'move'],
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}],
				'transition': [{
					'actions': ['cancel'],
					'if': {
						'computed': {
							'is_figure': true
						}
					}
				}]
			}
		},
		'queen': {
			'movement': [{
				'x': 1,
				'also_reversed': true,
				'repeat': true
			}, {
				'y': 1,
				'also_reversed': true,
				'repeat': true
			}, {
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
				}, {
					'actions': ['take', 'move'],
					'if': {
						'computed': {
							'is_enemy': true
						}
					}
				}],
				'transition': [{
					'actions': ['cancel'],
					'if': {
						'computed': {
							'is_figure': true
						}
					}
				}]
			}
		}
	},
	'complex_movement': [{
		'king': {
			'coordinates_delta': {
				'x': -2
			}
		},
		'rook': {
			'relative_position': {
				'x': -3
			},
			'coordinates_delta': {
				'x': 2
			}
		},
		'cell_actions': {
			'destination': [{
				'actions': ['move'],
				'if': {
					'self': {
						'moves_made': 0
					},
					'computed': {
						'is_figure': false
					}
				}
			}]
		}
	}, {
		'king': {
			'relative_position': {
				'x': 0,
				'y': 0
			},
			'coordinates_delta': {
				'x': 2
			}
		},
		'rook': {
			'relative_position': {
				'x': 4,
				'y': 0
			},
			'coordinates_delta': {
				'x': -3
			}
		},
		'cell_actions': {
			'destination': [{
				'actions': ['move'],
				'if': {
					'self': {
						'moves_made': 0
					},
					'computed': {
						'is_figure': false
					}
				}
			}]
		}
	}],
	'initial_position': {
		'white': {
			'king': [
				{'x': 3, 'y': 0}
			],
			'queen': [
			],
			'pawn': [
				{'x': 0, 'y': 1},
				{'x': 1, 'y': 1},
				{'x': 2, 'y': 1},
				{'x': 3, 'y': 1},
				{'x': 4, 'y': 1},
				{'x': 5, 'y': 1},
				{'x': 6, 'y': 1},
				{'x': 7, 'y': 1}
			],
			'bishop': [
			],
			'rook': [
				{'x': 0, 'y': 0},
				{'x': 7, 'y': 0}
			],
			'knight': [
			]
		},
		'black': {
			'king': [
				{'x': 3, 'y': 7}
			],
			'queen': [
				{'x': 4, 'y': 7}
			],
			'pawn': [
				{'x': 0, 'y': 6},
				{'x': 1, 'y': 6},
				{'x': 2, 'y': 6},
				{'x': 3, 'y': 6},
				{'x': 4, 'y': 6},
				{'x': 5, 'y': 6},
				{'x': 6, 'y': 6},
				{'x': 7, 'y': 6}
			],
			'bishop': [
				{'x': 2, 'y': 7},
				{'x': 5, 'y': 7}
			],
			'rook': [
				{'x': 0, 'y': 7},
				{'x': 7, 'y': 7}
			],
			'knight': [
				{'x': 1, 'y': 7},
				{'x': 6, 'y': 7}
			]
		}
	},
	'win_conditions': {
		'white': [{
			'entity': 'cell',
			'filter': {
				'player': 'black',
				'figure': 'king'
			},
			'type': 'exists',
			'result': false
		}],
		'black': [{
			'entity': 'cell',
			'filter': {
				'player': 'white',
				'figure': 'king'
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