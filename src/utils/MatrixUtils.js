export default class MatrixUtils {

    static create(lines, columns, fn = function () { }) {
        return Array(lines).fill().map(() => Array(columns).fill().map(() => fn()));
    }

    static isValid(matrix, i, j) {
        return MatrixUtils.isValidRow(matrix, i) && MatrixUtils.isValidColumn(matrix, j);
    }

    static isValidColumn(matrix, j) {
        if (j >= 0 && j < matrix[0].length) {
            return true;
        }
        return false;
    }

    static isValidRow(matrix, i) {
        if (i >= 0 && i < matrix.length) {
            return true;
        }
        return false;
    }
}
