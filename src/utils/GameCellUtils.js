export default class GameCellUtils {

    static countBomb(cells, i, j) {

        if (cells[i] && cells[i][j] && cells[i][j].hasBomb) {
            return 1;
        }
        return 0;
    }

    /**
     * @param {GameCell[]} cells
     * @param {int} i
     * @param {int} j
     * @returns the # of bombs around i and j
     */
    static searchBombs(cells, i, j) {

        let total = 0;

        total += GameCellUtils.countBomb(cells, i - 1, j - 1);
        total += GameCellUtils.countBomb(cells, i - 1, j);
        total += GameCellUtils.countBomb(cells, i - 1, j + 1);

        total += GameCellUtils.countBomb(cells, i, j - 1);
        total += GameCellUtils.countBomb(cells, i, j + 1);

        total += GameCellUtils.countBomb(cells, i + 1, j - 1);
        total += GameCellUtils.countBomb(cells, i + 1, j);
        total += GameCellUtils.countBomb(cells, i + 1, j + 1);

        return total;
    }
}
