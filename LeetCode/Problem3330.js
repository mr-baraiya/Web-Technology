/**
 * @param {string} word
 * @return {number}
 */
var possibleStringCount = function(word) {
    if (word.length === 1) return 1;

    let count = 1;
    for (let i = 0; i < word.length - 1; i++) {
        if (word[i] === word[i + 1]) {
            count++;
        }
    }
    return count;
};
