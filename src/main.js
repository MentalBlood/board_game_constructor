'use strict'

function isDict(something) {
	return something.constructor == Object;
}

function getAllElementsWithDepth_(dict, depth, destination, keys) {
	for (const key of Object.keys(dict)) {
		const element = dict[key];
		const new_keys = keys.concat([key]);
		if (depth == 0)
			destination.push({
				'keys': new_keys,
				'element': element
			})
		else
			getAllElementsWithDepth_(element, depth-1, destination, new_keys);
	}
}

function getAllElementsWithDepth(dict, depth) {
	const result = [];
	getAllElementsWithDepth_(dict, depth, result, []);
	return result;
}

function dictFromTwoLists(a, b) {
	const result = {};
	for (let i = 0; i < a.length; i++)
		result[a[i]] = b[i];
	return result;
}

class Root extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'board': undefined,
			'config_text': undefined,
			'config': {
				'players': ['white', 'black'],
				'board': [],
				'cell': ['x', 'y'],
				'figures': {
					'intellector': {
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
						}]
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
						}]
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
						}]
					},
					'aggressor': {
						'movement': [{
							'x': 1,
							'y': 1,
							'repeat': true,
							'also_reversed': true
						}, {
							'x': 1,
							'y': -1,
							'repeat': true,
							'also_reversed': true
						}, {
							'x': -1,
							'y': 1,
							'repeat': true,
							'also_reversed': true
						}]
					},
					'liberator': {
						'movement': [{
							'x': 2,
							'also_reversed': true,
							'jump': true
						}, {
							'y': 2,
							'also_reversed': true,
							'jump': true
						}, {
							'x': 2,
							'y': -2,
							'also_reversed': true,
							'jump': true
						}]
					},
					'progressor': {
						'movement': {
							'white': [{
								'x': 1
							}, {
								'y': 1
							}, {
								'x': -1,
								'y': 1
							}],
							'black': [{
								'x': -1
							}, {
								'y': -1
							}, {
								'x': 1,
								'y': -1
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
						'agressor': [
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
						'agressor': [
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
				}
			}
		}

		for (let x = 0; x < 9; x++)
			for (let y = 0 - Math.floor(x / 2); y < 7 - x % 2 - Math.floor(x / 2); y++)
				this.state.config.board.push({'x': x, 'y': y});
		
		this.state.config_text = JSON.stringify(this.state.config);
		this.state = Object.assign(this.state, this.compile_());
	}

	onConfigTextChange(e) {
		const new_text = e.target.value;
		this.setState({'config_text': new_text});
	}

	insertByCoordinates(cell_coords_names, cell, dict, element_to_insert, create_path=true) {
		const coordinates_list = cell_coords_names.map(name => cell[name]);
		let current_level = dict;
		for (let i = 0; i < coordinates_list.length - 1; i++) {
			const c = coordinates_list[i];
			if (!current_level[c]) {
				if (create_path)
					current_level[c] = {};
				else 
					return;
			}
			current_level = current_level[c];
		}
		const c = coordinates_list[coordinates_list.length - 1];
		if (!current_level[c] && !create_path)
			return;
		current_level[c] = element_to_insert;
	}

	placeFiguresOnBoard(cell_coords_names, position, board_config) {
		const result_board = {};
		console.log('placeFiguresOnBoard', board_config.length)
		for (const cell of board_config) {
			this.insertByCoordinates(cell_coords_names, cell, result_board, {});
		}
		for (const player in position) {
			for (const figure in position[player]) {
				for (const coordinates of position[player][figure]) {
					this.insertByCoordinates(cell_coords_names, coordinates, result_board, {
						'player': player,
						'figure': figure
					}, false);
				}
			}
		}
		return result_board;
	}

	unpackBoard(cell_coords_names, board_with_figures) {
		const keys_and_elements = getAllElementsWithDepth(this.state.board, cell_coords_names.length - 1);
		return keys_and_elements.map(k_e => Object.assign({}, k_e.element, dictFromTwoLists(cell_coords_names, k_e.keys)));
	}

	compile_() {
		const new_config = JSON.parse(this.state.config_text);
		return {
			'config': new_config,
			'position': new_config.initial_position,
			'board': this.placeFiguresOnBoard(
				new_config.cell,
				new_config.initial_position,
				new_config.board
			)
		};
	}

	compile() {
		const new_config = JSON.parse(this.state.config_text);
		this.setState(this.compile_(), () => this.forceUpdate());
	}

	render() {
		const unpacked_board = this.unpackBoard(this.state.config.cell, this.state.board);
		return (<div className='app'>
			<Board board={unpacked_board}></Board>
			<div className='config'>
				<textarea className='configText'
					value={JSON.stringify(this.state.config, null, '\t')}
					onChange={this.onConfigTextChange.bind(this)}></textarea>
				<button className='compileButton'
					onClick={this.compile.bind(this)}>compile</button>
			</div>
		</div>);
	}
}

const rootElement = document.getElementById('root');
ReactDOM.render(React.createElement(Root), rootElement);