'use strict'

function getAllElementsWithDepth_(dict, depth, destination, keys) {
	for (const str_key of Object.keys(dict)) {
		const key = Number.parseInt(str_key, 10);
		const element = dict[key];
		const new_keys = keys.concat([key]);
		if (depth === 0)
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

function matchDict(dict, conditions_dict) {
	for (const key in conditions_dict) {
		if (typeof(dict[key]) === 'object') {
			if (!matchDict(dict[key], conditions_dict[key]))
				return false;
		} else if (dict[key] != conditions_dict[key])
			return false;
	}
	return true;
}

function joinDicts(a, b) {
	const result = Object.assign({}, a);
	for (const key in b) {
		if (result[key]) {
			if (Array.isArray(result[key]) && Array.isArray(b[key])) {
				result[key].push.apply(result[key], b[key]);
				continue;
			}
			if (isDict(result[key]) && isDict(b[key])) {
				result[key] = joinDicts(result[key], b[key]);
				continue;
			}
		}
		result[key] = b[key];
	}
	return result;
}

class Root extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'board': undefined,
			'game_state': undefined,
			'selected_cell': undefined,
			'config_text': undefined,
			'config': config
		}
		
		this.state.config_text = JSON.stringify(this.state.config, null, '   ');
		this.state = Object.assign(this.state, this.compile_());

		this.actions = {
			'swap': ({cell_1, cell_2, board}) => {
				this.setCellByCoordinates(cell_1.coordinates, Object.assign({}, cell_2), board);
				this.setCellByCoordinates(cell_2.coordinates, Object.assign({}, cell_1), board);
			},
			'move': ({from_cell, to_cell, board}) => {
				const from_cell_coordinates_temp = from_cell.coordinates;
				this.setCellByCoordinates(to_cell.coordinates, from_cell, board);
				this.setCellEmpty(from_cell_coordinates_temp, board);
			},
			'take': ({from_cell, to_cell, board}) => {
				this.setCellEmpty(to_cell.coordinates, board);
			},
			'replace': ({from_cell, board, parameters}) => {
				this.setCellByCoordinates(from_cell.coordinates, Object.assign(from_cell, {'figure': parameters.new_figure}), board);
			}
		};

		this.values_computers = {
			'is_cell': (cell, from_cell) => Boolean(cell),
			'is_enemy': (cell, from_cell) => (cell?.player !== undefined) && (cell?.player != from_cell?.player),
			'is_figure': (cell, from_cell) => cell?.player !== undefined
		};

		this.entities_getters = {
			'cell': board => this.composeUnpackedBoard(this.state.config.cell.coordinates_names, board)
		};

		this.conditions_types = {
			'exists': entities_list => Boolean(entities_list.length)
		}

		this.state_data_getters = {
			'check_win': board => {
				const current_player = this.getCurrentPlayer();
				const win_conditions = this.state.config.win_conditions[current_player];
				for (const c of win_conditions) {
					const entities = this.entities_getters[c.entity](board);
					const filtered_entities = entities.filter(e => matchDict(e, c.filter));
					const result = this.conditions_types[c.type](filtered_entities);
					return result === c.result;
				}
			}
		};

		this.game_state_passiveness_by_type = {
			'move': 'active',
			'check_win': 'passive',
			'end': 'active'
		}

		this._ref = React.createRef();
	}

	componentDidMount() {
		this.startGame();
		window.addEventListener('resize', this.handleResize.bind(this));
	}

	handleResize() {
		this.forceUpdate();
	}

	startGame() {
		this.setGameState(this.state.config.initial_game_state);
	}

	setGameState(game_state) {
		if (this.state.config.game_states[game_state])
			this.setState(state => ({'game_state': game_state}));
	}

	composeCellWithoutData(cell) {
		const cell_coords_names = this.state.config.cell.coordinates_names;
		const result = {};
		for (const name of cell_coords_names)
			result[name] = cell[name];
		return result;
	}

	getCurrentPlayer() {
		const current_state_info = this.getCurrentGameStateInfo();
		if (current_state_info)
			return current_state_info.parameters.player;
	}

	withoutCoordinates(cell) {
		const result = Object.assign({}, cell);
		delete result.coordinates;
		return result;
	}

	hangleConfigTextChange(e) {
		const new_text = e.target.value;
		this.setState({'config_text': new_text});
	}

	setCellByCoordinates(coordinates, element_to_insert, board, create_path=true) {
		const cell_coords_names = this.state.config.cell.coordinates_names;
		const coordinates_list = cell_coords_names.map(name => coordinates[name]);
		let current_level = board;
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
		if (typeof(element_to_insert) == 'function')
			element_to_insert = element_to_insert(current_level[c]);
		if (current_level[c]?.coordinates)
			current_level[c] = Object.assign({}, element_to_insert, {coordinates: current_level[c].coordinates});
		else
			current_level[c] = Object.assign({}, element_to_insert);
	}

	setCellEmpty(coordinates, board) {
		this.setCellByCoordinates(coordinates, {'coordinates': coordinates}, board);
	}

	getCellByCoordinates_(cell_coords_names, coordinates, board) {
		const coordinates_list = cell_coords_names.map(name => coordinates[name]);
		let current_level = board;
		for (let i = 0; i < coordinates_list.length - 1; i++) {
			const c = coordinates_list[i];
			if (!current_level[c])
				return undefined;
			current_level = current_level[c];
		}
		const c = coordinates_list[coordinates_list.length - 1];
		if (current_level[c] !== undefined)
			return [current_level, c];
		else
			return undefined;
	}

	getCellByCoordinates(cell_coords_names, coordinates, board) {
		const cell_address = this.getCellByCoordinates_(cell_coords_names, coordinates, board);
		return cell_address ? cell_address[0][cell_address[1]] : undefined;
	}

	composeBoardWithFigures(cell_coords_names, position, board_config) {
		const result_board = {};
		for (const cell_coordinates of board_config) {
			this.setCellEmpty(cell_coordinates, result_board);
		}
		for (const player in position) {
			for (const figure in position[player]) {
				for (const coordinates of position[player][figure]) {
					this.setCellByCoordinates(coordinates, {
						'coordinates': coordinates,
						'moves_made': 0,
						'player': player,
						'figure': figure
					}, result_board, false);
				}
			}
		}
		return result_board;
	}

	composeUnpackedBoard(cell_coords_names, board_with_figures) {
		const keys_and_elements = getAllElementsWithDepth(this.state.board, cell_coords_names.length - 1);
		return keys_and_elements.map(k_e => k_e.element);
	}

	compile_() {
		const new_config = JSON.parse(this.state.config_text);
		return {
			'config': new_config,
			'game_state': new_config.initial_game_state,
			'position': new_config.initial_position,
			'board': this.composeBoardWithFigures(
				new_config.cell.coordinates_names,
				new_config.initial_position,
				new_config.board
			)
		};
	}

	compile() {
		const new_config = JSON.parse(this.state.config_text);
		this.setState(this.compile_());
	}

	isVectorDividedByAnother(cell_coords_names, v, divider) {
		let coefficient = undefined;
		for (const name of cell_coords_names) {
			if (!v[name]) {
				if (divider[name])
					return false;
				else
					continue;
			}
			const quotient = v[name] / divider[name];
			if (quotient != Math.floor(quotient))
				return false;
			if (coefficient) {
				if (quotient != coefficient)
					return false;
			}
			else {
				coefficient = quotient;
				if (!divider.also_reversed && coefficient < 0)
					return false;
				if (!divider.repeat && (Math.abs(coefficient) > 1))
					return false;
			}
		}
		return {'coefficient': coefficient};
	}

	composeComputedValues(values_names, cell, from_cell) {
		const result = {};
		for (const name of values_names)
			if (this.values_computers[name])
				result[name] = this.values_computers[name](cell, from_cell);
		return result;
	}

	composeActionsForCell(actions, cell, from_cell) {
		if (!actions)
			return [];

		const matched_actions = [];
		for (const a of actions) {
			if (a['if']) {
				let some_conditions_fit = false;
				for (const conditions of a['if']) {
					if (conditions.self) {
						if (!matchDict(from_cell, conditions.self))
							continue;
					}
					if (conditions.target)
						if (!matchDict(cell, conditions.target))
							continue;
					if (conditions.computed) {
						const computed_dict = this.composeComputedValues(Object.keys(conditions.computed), cell, from_cell);
						if (!matchDict(computed_dict, conditions.computed))
							continue;
					}
					some_conditions_fit = true;
					break;
				}
				if (!some_conditions_fit)
					continue;
			}
			matched_actions.push({
				'target_cell': cell,
				'from_cell': from_cell,
				'actions': a.actions
			});
		}
		console.log('matched_actions', matched_actions)
		return matched_actions;
	}

	composeCellAfterSteps(cell_coords_names, from_cell_coordinates, coordinates_delta, steps_number) {
		const result = {};
		for (const name of cell_coords_names) {
			const delta = coordinates_delta[name] || 0;
			result[name] = from_cell_coordinates[name] + delta * steps_number;
		}
		return result;
	}

	composeCoordinatesDelta(cell_coords_names, a, b) {
		const result = {};
		for (const name of cell_coords_names)
			result[name] = (b[name] || 0) - (a[name] || 0);
		return result;
	}

	composeActionsForAvailableMove(coordinates_delta, cell_actions, from_cell, to_cell, coefficient) {
		const figure = from_cell.figure;
		const cell_coords_names = this.state.config.cell.coordinates_names;
		const figure_info = this.state.config.figures[figure];

		const actions = [];

		const destination_cell_actions = this.composeActionsForCell(cell_actions['destination'], to_cell, from_cell);
		if (destination_cell_actions.filter(a => a.actions.includes('cancel')).length)
			return [];
		actions.push.apply(actions, destination_cell_actions);

		const actions_for_transition_cells = [];
		const direction = Math.sign(coefficient)
		for (let step = direction; step != coefficient; step += direction) {
			const current_cell_coordinates = this.composeCellAfterSteps(
				cell_coords_names,
				from_cell.coordinates,
				coordinates_delta,
				step);
			const current_cell = this.getCellByCoordinates(cell_coords_names, current_cell_coordinates, this.state.board);
			// if (!current_cell)
			// 	continue;
			const new_actions = this.composeActionsForCell(cell_actions['transition'], current_cell, from_cell);
			actions_for_transition_cells.push(...new_actions);
		}
		if (actions_for_transition_cells.filter(a => a.actions.includes('cancel')).length)
			return [];
		return actions.concat(actions_for_transition_cells);
	}

	composeActionsForSimpleMove(from_cell, to_cell) {
		const figure = from_cell.figure;
		const cell_coords_names = this.state.config.cell.coordinates_names;
		const figure_info = this.state.config.figures[figure];

		const move = this.composeCoordinatesDelta(cell_coords_names, from_cell.coordinates, to_cell.coordinates);

		const available_moves = figure_info.movement;
		const available_moves_for_color = isDict(available_moves) ? available_moves[from_cell.player] : available_moves;
		for (const available_move of available_moves_for_color) {
			const coefficient = this.isVectorDividedByAnother(cell_coords_names, move, available_move)?.coefficient;
			if (!coefficient)
				continue;
			const cell_actions = joinDicts(available_move.cell_actions, figure_info.cell_actions);
			const actions = this.composeActionsForAvailableMove(available_move, cell_actions, from_cell, to_cell, coefficient);
			return actions;
		}

		return [];
	}

	composeActionsForComplexMove(from_cell, to_cell) {
		const figure = from_cell.figure;
		const cell_coords_names = this.state.config.cell.coordinates_names;

		const move = this.composeCoordinatesDelta(cell_coords_names, from_cell.coordinates, to_cell.coordinates);
		const complex_moves_with_figure = this.state.config.complex_movement.filter(e => e[figure]);

		const figure_position_absolute = from_cell.coordinates;

		for (const complex_move of complex_moves_with_figure) {
			let is_complex_move_fits = true;
			const actions = [];
			const figure_position_relative = complex_move[figure].relative_position || {};
			const shift = this.composeCoordinatesDelta(cell_coords_names, figure_position_absolute, figure_position_relative);
			
			const complex_move_figures = Object.keys(complex_move).filter(k => 
				(this.state.config.figures[k])
			);

			for (const current_figure of complex_move_figures) {
				const current_figure_info = complex_move[current_figure];
				const coordinates_delta = current_figure_info.coordinates_delta;

				let coefficient = undefined;
				if (current_figure !== figure)
					coefficient = 1;
				else {
					coefficient = this.isVectorDividedByAnother(cell_coords_names, move, coordinates_delta)?.coefficient;
					if (!coefficient) {
						is_complex_move_fits = false;
						break;
					}
				}

				const current_figure_position_relative = current_figure_info.relative_position || {};
				const current_figure_position_absolute = this.composeCoordinatesDelta(
					cell_coords_names,
					shift,
					current_figure_position_relative);
				
				const current_figure_from_cell = this.getCellByCoordinates(
					cell_coords_names, current_figure_position_absolute, this.state.board);
				if (current_figure_from_cell?.figure !== current_figure) {
					is_complex_move_fits = false;
					break;
				}

				const current_figure_to_cell_coordinates = this.composeCellAfterSteps(
					cell_coords_names, current_figure_from_cell.coordinates, coordinates_delta, 1);
				const current_figure_to_cell = this.getCellByCoordinates(
					cell_coords_names, current_figure_to_cell_coordinates, this.state.board);
				
				const cell_actions = current_figure_info.cell_actions || complex_move.cell_actions;
				const new_actions = this.composeActionsForAvailableMove(
					coordinates_delta, cell_actions, current_figure_from_cell, current_figure_to_cell, coefficient);
				
				const destination_cell_actions_number = cell_actions['destination']?.length || 0;
				const transition_cell_actions_number = cell_actions['transition']?.length || 0;
				if ((!new_actions) || 
					(new_actions.length < destination_cell_actions_number + transition_cell_actions_number)) {
					is_complex_move_fits = false;
					break;
				}
				
				if (new_actions.filter(a => a.actions.includes('cancel')).length) {
					is_complex_move_fits = false;
					break;
				}
				
				actions.push.apply(actions, new_actions);
			}
			if (is_complex_move_fits) {
				return actions;
			}
		}
		return [];
	}

	composeActionsForMove(from_cell, to_cell) {
		const figure = from_cell.figure;
		if (!figure)
			return [];

		if (isObjectsEqual(from_cell, to_cell))
			return [];

		const simple_actions = this.composeActionsForSimpleMove(from_cell, to_cell);
		if (simple_actions.length)
			return simple_actions;

		if (!this.state.config.complex_movement)
			return [];
		const complex_actions = this.composeActionsForComplexMove(from_cell, to_cell);
		return complex_actions;
	}

	composeStateAfterActions(state, from_cell, actions_info) {
		this.setCellByCoordinates(from_cell.coordinates, c => Object.assign(c, {
			'moves_made': c.moves_made + 1
		}), state.board, false);
		for (const info of actions_info) {
			for (const a of info.actions) {
				let name, parameters;
				if (isDict(a)) {
					name = a.action;
					parameters = a.parameters;
				} else
					name = a;
				if (this.actions[name])
					this.actions[name]({
						'from_cell': info.from_cell,
						'to_cell': info.target_cell, 
						'parameters': parameters, 
						'board': state.board
					});
			}
		}
		return state;
	}

	getCurrentGameStateInfo() {
		return this.state.config.game_states[this.state.game_state];
	}

	getGameStateInfo(game_state) {
		return this.state.config.game_states[game_state];
	}

	composeNextGameState(current_state) {
		const current_state_info = this.getGameStateInfo(current_state);
		if (typeof(current_state_info.next) === 'string')
			return current_state_info.next;
		const data = this.state_data_getters[current_state_info.type](this.state.board);
		for (const branch of current_state_info.next) {
			for (const conditions of branch['if'])
				if (matchDict({ 'result': data }, conditions))
					return branch.state;
		}
	}

	setNextGameState() {
		const current_state = this.state.game_state;
		let next_state = this.composeNextGameState(current_state);
		while (true) {
			const info = this.getGameStateInfo(next_state);
			const type = info.type;
			if (this.game_state_passiveness_by_type[type] != 'passive')
				break;
			next_state = this.composeNextGameState(next_state);
		}
		this.setGameState(next_state);
	}

	handleSelectCell(cell) {
		const from_cell = this.state.selected_cell;
		if (from_cell) {
			const actions_for_move = this.composeActionsForMove(from_cell, cell);
			if (actions_for_move.length > 0) {
				const new_state = this.composeStateAfterActions(this.state, from_cell, actions_for_move);
				this.setState(new_state, () => this.setNextGameState());
			}
			this.setState({'selected_cell': undefined});
		}
		else {
			const selected_cell_player = cell.player;
			if (!selected_cell_player)
				return;
			if (selected_cell_player && (selected_cell_player === this.getCurrentGameStateInfo().parameters?.player))
				this.setState({'selected_cell': cell});
		}
	}

	render() {
		const unpacked_board = this.composeUnpackedBoard(this.state.config.cell.coordinates_names, this.state.board);
		return (<div className='app' ref={this._ref}>
			<div className="gameUI">
				<Board
					board={unpacked_board}
					cell_config={this.state.config.cell}
					handleSelectCell={this.handleSelectCell.bind(this)}
					selected_cell={this.state.selected_cell}
					cell_coords_names={this.state.config.cell.coordinates_names}></Board>
				<div className="gameState unselectable">{this.state.game_state.replace('_', ' ')}</div>
			</div>
			<div className='config'>
				<textarea className='configText'
					value={this.state.config_text}
					onChange={this.hangleConfigTextChange.bind(this)}></textarea>
				<button className='compileButton unselectable'
					onClick={this.compile.bind(this)}>compile</button>
			</div>
		</div>);
	}
}

const rootElement = document.getElementById('root');
const game_name = 'chess';
let config = undefined;
fetch(`config/${game_name}/main.json`)
	.then(response => response.json())
	.then(data => config = data)
	.then(() => ReactDOM.render(React.createElement(Root), rootElement));