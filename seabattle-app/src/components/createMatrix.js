
function createMatrix() {
	let x = 10, y = 10, arr = [10];
	for (let i = 0; i < x; i++) {
		arr[i] = [10];
		for(let j = 0; j < y; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
}