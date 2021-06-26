/**
 * @param {string | RegExp} comparison
 */
 module.exports = function string2RegExp(comparison) {
	// If it's a RegExp, test directly
	if (comparison instanceof RegExp) {
		return comparison;
	}

	// Check if it's RegExp in a string
	const firstComparisonChar = comparison[0];
	const lastComparisonChar = comparison[comparison.length - 1];
	const secondToLastComparisonChar = comparison[comparison.length - 2];

	const comparisonIsRegex =
		firstComparisonChar === '/' &&
		(lastComparisonChar === '/' ||
			(secondToLastComparisonChar === '/' && lastComparisonChar === 'i'));

	const hasCaseInsensitiveFlag = comparisonIsRegex && lastComparisonChar === 'i';

	// If so, create a new RegExp from it
	if (comparisonIsRegex) {
		return hasCaseInsensitiveFlag
			? new RegExp(comparison.slice(1, -2), 'i')
			: new RegExp(comparison.slice(1, -1));
	}

	// Otherwise, it's a string. Do a strict comparison
	return comparison
}