function composeUnpackedBoard(board, coordinates_names) {
	const keys_and_elements = getAllElementsWithDepth(board, coordinates_names.length - 1);
	return keys_and_elements.map(k_e => k_e.element);
}

function setCellByCoordinates(coordinates, element_to_insert, board, coordinates_names) {
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

function setCellEmpty(coordinates, board, coordinates_names) {
	setCellByCoordinates(coordinates, {'coordinates': coordinates}, board, coordinates_names);
}