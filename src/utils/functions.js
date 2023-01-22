/**
 * Format seconds in it's highest denomination
 * @function @author Liam Skinner <me@liamskinner.co.uk>
 *
 * @param {number} seconds - time in seconds
 * @returns {string}
**/
const formatTime = (seconds) => {

	const denominations = [
		[1, 'Second'],
		[60, 'Minute'],
		[60 * 60, 'Hour'],
	];
	const type = (seconds < 61 ? 0 : (seconds < 3600 ? 1 : 2));
	const num = Math.floor(seconds / denominations[type][0]);

	return `${num} ${denominations[type][1]}${num != 1 ? 's' : ''}`;
};

/**
	* Calculate time in ms from duration and units
	* @function @author Liam Skinner <me@liamskinner.co.uk>
	*
	* @param {number} duration
	* @param {string} units
	* @returns {number}
**/
const calculateTime = (duration, units) => {

	/* Units and they time in ms */
	const denominations = {
		's': 1000, 'm': 60 * 1000, 'h': 3600 * 1000,
		'd': 24 * 3600 * 1000, 'w': 7 * 24 * 3600 * 1000,
	};
	const unit = denominations[units];

	return Number(duration * unit);
};


/* Export all fuctions */
module.exports = {
	formatTime,
	calculateTime,
};
