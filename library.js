const library = {
	actions: {
		'swap': ({from_cell, to_cell, board, coordinates_names}) => {
			setCellByCoordinates(from_cell.coordinates, Object.assign({}, to_cell), board, coordinates_names);
			setCellByCoordinates(to_cell.coordinates, Object.assign({}, from_cell), board, coordinates_names);
		},
		'move': ({from_cell, to_cell, board, coordinates_names, game_statistics}) => {
			from_cell.last_move = game_statistics.current_move;
			const from_cell_coordinates_temp = from_cell.coordinates;
			setCellByCoordinates(to_cell.coordinates, from_cell, board, coordinates_names);
			setCellEmpty(from_cell_coordinates_temp, board, coordinates_names);
		},
		'take': ({from_cell, to_cell, board, coordinates_names}) => {
			setCellEmpty(to_cell.coordinates, board, coordinates_names);
		},
		'replace': ({from_cell, board, coordinates_names, parameters}) => {
			setCellByCoordinates(
				from_cell.coordinates, 
				Object.assign(from_cell, {'figure': parameters.new_figure}), 
				board, 
				coordinates_names
			);
		}
	},

	values_computers: {
		'is_cell': ({cell}) => Boolean(cell),
		'is_enemy': ({cell, from_cell}) => (cell?.player !== undefined) && (cell?.player != from_cell?.player),
		'is_figure': ({cell}) => cell?.player !== undefined,
		'moves_after_last_move': ({from_cell, game_statistics}) => game_statistics.current_move - from_cell.last_move
	},

	entities_getters: {
		'cell': ({board, coordinates_names}) => composeUnpackedBoard(board, coordinates_names)
	},

	conditions_types: {
		'exists': entities_list => Boolean(entities_list.length)
	},

	state_effects: {
		'next_move': game_statistics => {
			game_statistics.current_move += 1;
			return game_statistics;
		}
	},

	state_data_getters: {
		'check_win': ({board, coordinates_names, parameters, win_conditions}) => {
			const player = parameters.player;
			for (const c of win_conditions[player]) {
				const entities = library.entities_getters[c.entity]({
					'board': board, 
					'coordinates_names': coordinates_names
				});
				const filtered_entities = entities.filter(e => matchDict(e, c.filter));
				const result = library.conditions_types[c.type](filtered_entities);
				if (result === c.result)
					return true;
			}
			return false;
		}
	},

	game_state_passiveness_by_type: {
		'move': 'active',
		'check_win': 'passive',
		'next_move': 'passive',
		'end': 'active'
	}
}