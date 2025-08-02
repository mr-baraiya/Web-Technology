/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    const triangle = [];

    for (let i=0; i<numRows; i++){
        const row = [1];

        for  (let j=1; j<i; j++){
            row[j] = triangle[i-1][j-1] + triangle[i-1][j];
        }

        if(i > 0) row.push(1);

        triangle.push(row);

    }
    return triangle; 
};
