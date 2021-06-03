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

class Game {
	constructor(callback_after_set_state) {
		this.callback_after_set_state = callback_after_set_state;

		this.state = {
			'board': undefined,
			'game_state': undefined,
			'game_statistics': {
				'current_move': undefined
			},
			'selected_cell': undefined,
			'config_text': undefined,
			'config': undefined
		}

		this.actions = {
			'swap': ({from_cell, to_cell, board}) => {
				this.setCellByCoordinates(from_cell.coordinates, Object.assign({}, to_cell), board);
				this.setCellByCoordinates(to_cell.coordinates, Object.assign({}, from_cell), board);
			},
			'move': ({from_cell, to_cell, board}) => {
				from_cell.last_move = this.state.game_statistics.current_move;
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
			'is_cell': ({cell}) => Boolean(cell),
			'is_enemy': ({cell, from_cell}) => (cell?.player !== undefined) && (cell?.player != from_cell?.player),
			'is_figure': ({cell}) => cell?.player !== undefined,
			'moves_after_last_move': ({from_cell}) => this.state.game_statistics.current_move - from_cell.last_move
		};

		this.entities_getters = {
			'cell': board => this.composeUnpackedBoard(this.state.config.cell.coordinates_names, board)
		};

		this.conditions_types = {
			'exists': entities_list => Boolean(entities_list.length)
		};

		this.state_effects = {
			'next_move': game_statistics => {
				game_statistics.current_move += 1;
				return game_statistics;
			}
		};

		this.state_data_getters = {
			'check_win': ({board, parameters}) => {
				const player = parameters.player;
				const win_conditions = this.state.config.win_conditions[player];
				for (const c of win_conditions) {
					const entities = this.entities_getters[c.entity](board);
					const filtered_entities = entities.filter(e => matchDict(e, c.filter));
					const result = this.conditions_types[c.type](filtered_entities);
					if (result === c.result)
						return true;
				}
				return false;
			}
		};

		this.game_state_passiveness_by_type = {
			'move': 'active',
			'check_win': 'passive',
			'next_move': 'passive',
			'end': 'active'
		};

		this.callback_after_set_state(this.state);
		this.setLoadedConfig('chess');
	}

	setState(new_state, then) {
		if (typeof(new_state) === 'function')
			Object.assign(this.state, new_state(this.state));
		else
			Object.assign(this.state, new_state);
		this.callback_after_set_state(this.state);
		if (then)
			then();
	}

	setConfigForGame(text) {
		this.setState(this.compile_(text.replaceAll('\t', '   ')), () => this.startGame())
	}

	setLoadedConfig(name) {
		this.setConfigForGame(configs[name]);
	}

	handleResize() {
		this.forceUpdate();
	}

	startGame() {
		this.setState(state => ({
			'game_statistics': {
				'current_move': 1
			},
			'game_state': this.state.config.initial_game_state
		}));
	}

	setGameState(game_state) {
		if (this.state.config.game_states[game_state])
			this.setState(state => ({'game_state': game_state}));
	}

	composeDictWithCoordinates(cell) {
		const coordinates_names = this.state.config.cell.coordinates_names;
		const result = {};
		for (const name of coordinates_names)
			result[name] = cell[name] || 0;
		return result;
	}

	getCurrentPlayer() {
		const current_state_info = this.getCurrentGameStateInfo();
		if (current_state_info)
			return current_state_info?.parameters?.player;
	}

	composeDictWithoutCoordinates(cell) {
		const result = Object.assign({}, cell);
		delete result.coordinates;
		return result;
	}

	handleConfigTextChange(e) {
		const new_text = e.target.value;
		this.setState({'config_text': new_text});
	}

	setCellByCoordinates(coordinates, element_to_insert, board, coordinates_names) {
		coordinates_names = coordinates_names || this.state.config.cell.coordinates_names;
		const coordinates_list = coordinates_names.map(name => coordinates[name]);
		let current_level = board;
		for (let i = 0; i < coordinates_list.length - 1; i++) {
			const c = coordinates_list[i];
			if (!current_level[c])
				current_level[c] = {};
			current_level = current_level[c]
		}
		const c = coordinates_list[coordinates_list.length - 1];
		if (typeof(element_to_insert) == 'function')
			element_to_insert = element_to_insert(current_level[c]);
		if (current_level[c]?.coordinates)
			current_level[c] = Object.assign({}, element_to_insert, {coordinates: current_level[c].coordinates});
		else
			current_level[c] = Object.assign({}, element_to_insert);
	}

	setCellEmpty(coordinates, board, coordinates_names) {
		coordinates_names = coordinates_names || this.state.config.cell.coordinates_names;
		this.setCellByCoordinates(coordinates, {'coordinates': coordinates}, board, coordinates_names);
	}

	getCellByCoordinates_(coordinates_names, coordinates, board) {
		const coordinates_list = coordinates_names.map(name => coordinates[name]);
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

	getCellByCoordinates(coordinates_names, coordinates, board) {
		const cell_address = this.getCellByCoordinates_(coordinates_names, coordinates, board);
		return cell_address ? cell_address[0][cell_address[1]] : undefined;
	}

	composeBoardWithFigures(coordinates_names, position, board_config) {
		const result_board = {};
		for (const cell_coordinates of board_config)
			this.setCellEmpty(cell_coordinates, result_board, coordinates_names);
		for (const player in position) {
			for (const figure in position[player]) {
				for (const coordinates of position[player][figure]) {
					this.setCellByCoordinates(coordinates, {
						'coordinates': coordinates,
						'moves_made': 0,
						'last_move': 0,
						'player': player,
						'figure': figure
					}, result_board, coordinates_names);
				}
			}
		}
		return result_board;
	}

	composeUnpackedBoard(coordinates_names, board_with_figures) {
		const keys_and_elements = getAllElementsWithDepth(this.state.board, coordinates_names.length - 1);
		return keys_and_elements.map(k_e => k_e.element);
	}

	compile_(new_config_text) {
		const new_config = JSON.parse(new_config_text);
		const coords_names = new_config.cell.coordinates_names;

		return {
			'config': new_config,
			'config_text': new_config_text,
			'game_state': new_config.initial_game_state,
			'position': new_config.initial_position,
			'board': this.composeBoardWithFigures(
				coords_names,
				new_config.initial_position,
				new_config.board.cells
			),
			'cell_coordinates_maxes': dictFromTwoLists(
				coords_names,
				coords_names.map(name => Math.max(...new_config.board.cells.map(c => c[name])))
			),
			'cell_coordinates_mins': dictFromTwoLists(
				coords_names,
				coords_names.map(name => Math.min(...new_config.board.cells.map(c => c[name])))
			)
		};
	}

	compile() {
		this.setState(this.compile_(this.state.config_text));
	}

	isVectorDividedByAnother(coordinates_names, v, divider) {
		let coefficient = undefined;
		for (const name of coordinates_names) {
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
				result[name] = this.values_computers[name]({'cell': cell, 'from_cell': from_cell});
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
					if (conditions.statistics)
						if (!matchDict(this.state.statistics, conditions.statistics))
							continue;
					if (conditions.self)
						if (!matchDict(from_cell, conditions.self))
							continue;
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
		// console.log('matched_actions', matched_actions, 'from', actions, cell, from_cell);
		return matched_actions;
	}

	composeCellAfterSteps(coordinates_names, from_cell_coordinates, coordinates_delta, steps_number) {
		const result = {};
		for (const name of coordinates_names) {
			const delta = coordinates_delta[name] || 0;
			result[name] = from_cell_coordinates[name] + delta * steps_number;
		}
		return result;
	}

	composeCoordinatesDelta(coordinates_names, a, b) {
		const result = {};
		for (const name of coordinates_names)
			result[name] = (b[name] || 0) - (a[name] || 0);
		return result;
	}

	composeActionsForAvailableMove(coordinates_delta, cell_actions, from_cell, to_cell, coefficient) {
		const figure = from_cell.figure;
		const coordinates_names = this.state.config.cell.coordinates_names;
		const figure_info = this.state.config.figures[figure];

		const actions = [];

		const destination_cell_actions = this.composeActionsForCell(cell_actions.destination || [], to_cell, from_cell);
		if (destination_cell_actions.filter(a => a.actions.includes('cancel')).length)
			return [];
		actions.push.apply(actions, destination_cell_actions);

		const actions_for_transition_cells = [];
		const direction = Math.sign(coefficient)
		for (let step = direction; step != coefficient; step += direction) {
			const current_cell_coordinates = this.composeCellAfterSteps(
				coordinates_names,
				from_cell.coordinates,
				coordinates_delta,
				step);
			const current_cell = this.getCellByCoordinates(coordinates_names, current_cell_coordinates, this.state.board);
			// if (!current_cell)
			// 	continue;
			const new_actions = this.composeActionsForCell(cell_actions.transition || [], current_cell, from_cell);
			actions_for_transition_cells.push(...new_actions);
		}
		if (actions_for_transition_cells.filter(a => a.actions.includes('cancel')).length)
			return [];
		return actions.concat(actions_for_transition_cells);
	}

	composeActionsForSimpleMove(from_cell, to_cell) {
		const figure = from_cell.figure;
		const coordinates_names = this.state.config.cell.coordinates_names;
		const figure_info = this.state.config.figures[figure];

		const move = this.composeCoordinatesDelta(coordinates_names, from_cell.coordinates, to_cell.coordinates);

		const available_moves = figure_info.movement;
		const available_moves_for_color = isDict(available_moves) ? available_moves[from_cell.player] : available_moves;
		for (const available_move of available_moves_for_color) {
			const coefficient = this.isVectorDividedByAnother(coordinates_names, move, available_move)?.coefficient;
			if (!coefficient)
				continue;
			const cell_actions = joinDicts(available_move.cell_actions || {}, figure_info.cell_actions || {});
			const actions = this.composeActionsForAvailableMove(available_move, cell_actions, from_cell, to_cell, coefficient);
			return actions;
		}

		return [];
	}

	composeActionsForComplexMove(from_cell, to_cell) {
		const figure = from_cell.figure;
		const coordinates_names = this.state.config.cell.coordinates_names;

		const move = this.composeCoordinatesDelta(coordinates_names, from_cell.coordinates, to_cell.coordinates);
		const complex_moves_with_figure = 
			this.state.config.complex_movement.filter(e => e.figures.filter(f => f.figure === figure).length);

		const figure_position_absolute = from_cell.coordinates;

		for (const complex_move of complex_moves_with_figure) {
			let is_complex_move_fits = true;
			const actions = [];
			for (const initial_figure_info of complex_move.figures.filter(e => e.figure === figure)) {
				const figure_position_relative = initial_figure_info.relative_position || {};
				const shift = this.composeCoordinatesDelta(coordinates_names, figure_position_absolute, figure_position_relative);
				
				const complex_move_figures = Object.keys(complex_move).filter(k => this.state.config.figures[k]);

				for (const current_figure_info of complex_move.figures) {
					const current_figure = current_figure_info.figure;
					const coordinates_delta = current_figure_info.coordinates_delta || {};

					let coefficient = undefined;
					if (current_figure_info !== initial_figure_info)
						coefficient = 1;
					else {
						coefficient = this.isVectorDividedByAnother(coordinates_names, move, coordinates_delta)?.coefficient;
						if (!coefficient) {
							is_complex_move_fits = false;
							break;
						}
					}

					const current_figure_position_relative = current_figure_info.relative_position || {};
					const current_figure_position_absolute = this.composeCoordinatesDelta(
						coordinates_names,
						shift,
						current_figure_position_relative);
					
					const current_figure_from_cell = this.getCellByCoordinates(
						coordinates_names, current_figure_position_absolute, this.state.board);
					if (current_figure_from_cell?.figure !== current_figure) {
						is_complex_move_fits = false;
						break;
					}

					const current_figure_to_cell_coordinates = this.composeCellAfterSteps(
						coordinates_names, current_figure_from_cell.coordinates, coordinates_delta, 1);
					const current_figure_to_cell = this.getCellByCoordinates(
						coordinates_names, current_figure_to_cell_coordinates, this.state.board);
					
					const cell_actions = joinDicts(current_figure_info.cell_actions || {}, complex_move.cell_actions || {});
					const new_actions = this.composeActionsForAvailableMove(
						coordinates_delta, cell_actions, current_figure_from_cell, current_figure_to_cell, coefficient);

					if (new_actions.filter(a => a.actions.includes('cancel')).length ||
						!new_actions.filter(a => !a.actions.includes('cancel')).length) {
						is_complex_move_fits = false;
						break;
					}
					
					actions.push.apply(actions, new_actions);
				}
				if (is_complex_move_fits) {
					return actions;
				}
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

	composeBoardAfterActions(board, from_cell, actions_info) {
		this.setCellByCoordinates(from_cell.coordinates, c => Object.assign(c, {
			'moves_made': c.moves_made + 1
		}), board);
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
						'board': board
					});
			}
		}
		return board;
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
		const data = this.state_data_getters[current_state_info.type] ? 
			this.state_data_getters[current_state_info.type]({
				'board': this.state.board,
				'parameters': current_state_info.parameters 
			})
			: undefined;
		for (const branch of current_state_info.next) {
			for (const conditions of branch['if'])
				if (matchDict({ 'result': data }, conditions))
					return branch.state;
		}
	}

	setNextGameState() {
		const current_state = this.state.game_state;
		let game_statistics = this.state.game_statistics;
		let next_state = this.composeNextGameState(current_state);
		while (true) {
			const info = this.getGameStateInfo(next_state);
			const type = info.type;
			if (this.game_state_passiveness_by_type[type] != 'passive')
				break;
			if (this.state_effects[type])
				game_statistics = this.state_effects[type](game_statistics);
			next_state = this.composeNextGameState(next_state);
		}
		this.setState({'game_statistics': game_statistics});
		this.setGameState(next_state);
	}

	isCellWithinBoard(coordinates) {
		return Object.entries(coordinates).every(
			([name, value]) => (
				(value <= this.state.cell_coordinates_maxes[name]) && 
				(value >= this.state.cell_coordinates_mins[name])
			)
		);
	}

	getAvailableMovesFromCell(cell) {
		if (!cell.figure)
			return [];
		
		const result = [];
		const figure_info = this.state.config.figures[cell.figure];
		const coordinates_names = this.state.config.cell.coordinates_names;

		const possible_moves_from_simple = figure_info.movement;
		const possible_moves_from_complex = this.state.config.complex_movement.map(
			m => 
			m.figures.filter(
				f => 
				f.figure === cell.figure
			)
		).flat();
		const possible_moves = [...possible_moves_from_simple, ...possible_moves_from_complex];
		
		for (const move of possible_moves) {
			const coordinates_delta = move.coordinates_delta || this.composeDictWithCoordinates(move);
			const is_repeat = move.repeat || coordinates_delta.repeat;
			const is_also_reversed = move.also_reversed || coordinates_delta.also_reversed;
			const to_cells_coordinates = [];
			for (let steps_number = 1; is_repeat || (steps_number == 1); steps_number++) {
				
				const cell_after_steps_forward = this.composeCellAfterSteps(
					coordinates_names, cell.coordinates, coordinates_delta, steps_number);
				
				const cell_after_steps_backward = is_also_reversed ? this.composeCellAfterSteps(
					coordinates_names, cell.coordinates, coordinates_delta, -steps_number) 
					: undefined;
				
				const new_cells = [
					cell_after_steps_forward,
					cell_after_steps_backward
				].filter(c => c && this.isCellWithinBoard(c));
				
				if (!new_cells.length)
					break;
				to_cells_coordinates.push.apply(to_cells_coordinates, new_cells);
			}

			for (const c of to_cells_coordinates) {
				const to_cell = this.getCellByCoordinates(coordinates_names, c, this.state.board);
				if (!to_cell)
					continue;
				const actions = this.composeActionsForMove(cell, to_cell);
				if (actions.length > 0)
					result.push({
					'to_cell': to_cell,
					'actions': actions
				});
			}
		}
		return result;
	}

	handleSelectCell(cell) {
		const from_cell = this.state.selected_cell;
		if (from_cell) {
			const actions_for_move = this.composeActionsForMove(from_cell, cell);
			if (actions_for_move.length > 0) {
				const new_board = this.composeBoardAfterActions(this.state.board, from_cell, actions_for_move);
				this.setState({'board': new_board}, () => this.setNextGameState());
			}
			this.setState({
				'selected_cell': undefined,
				'highlighted_cells': {}
			});
		}
		else {
			const selected_cell_player = cell.player;
			if (!selected_cell_player)
				return;
			if (selected_cell_player && (selected_cell_player === this.getCurrentGameStateInfo().parameters?.player)) {
				const available_moves = this.getAvailableMovesFromCell(cell);
				const available_moves_cells_coordinates = available_moves.map(m => m.to_cell.coordinates);
				this.setState({
					'selected_cell': cell,
					'highlighted_cells': available_moves_cells_coordinates.reduce((acc, curr) => {
						const coordinates_string = Object.values(curr).join('_');
						acc[coordinates_string] = true;
						return acc;
					}, {})
				});
			}
		}
	}

	handleGameNameSelectChange(event) {
		const new_game_name = event.target.value;
		this.setLoadedConfig(new_game_name, () => this.startGame());
	}

	getSaveName() {
		const today = new Date();
		const current_date = `${today.getFullYear()}_${(today.getMonth() + 1)}_${today.getDate()}`;
		const current_time = `${today.getHours()}_${today.getMinutes()}_${today.getSeconds()}`;
		return `${this.state.config.name}_config-${current_date}-${current_time}.json`;
	}

	downloadConfig() {
		const data_text = this.state.config_text;
		const name = this.getSaveName();
		downloadFile(name, data_text);
	}

	uploadConfig() {
		uploadFile('json', jsonText => {
			const new_config = JSON.parse(jsonText);
			const name = new_config.name
			if (!name) {
				console.log('no game name found in config (field "name")')
				return;
			}
			configs[name] = jsonText;
			this.setLoadedConfig(name);
		});
	}
}