import RandomUtils from "../utils/RandomUtils.js";
import MatrixUtils from "../utils/MatrixUtils.js";
import GameCellUtils from "../utils/GameCellUtils.js";
import GameCell from "./GameCell.js";
import Observable from "./Observable.js";

export default class Game extends Observable {

    constructor(rows, columns, numberOfBombs) {
        super();

        this.rows = rows;
        this.columns = columns;
        this.numberOfBombs = numberOfBombs;
        this.availableFlags = numberOfBombs

        this.cells = [];
        this.bombs = [];

        this.flags = {};
    }

    setFlag(i, j, value) {

        this.cells[i][j].hasFlag = value;

        if (this.flags.hasOwnProperty(`${i}_${j}`)) {
            this.flags[`${i}_${j}`] = value;
        }
    }

    hasFlag(i, j) {
        return this.cells[i][j].hasFlag;
    }

    hasMine(i, j) {
        return this.cells[i][j].hasBomb;
    }

    hasHint(i, j) {
        return this.cells[i][j].hint != 0;
    }

    isWin() {

        for (const value of Object.values(this.flags)) {

            if (!value) {
                return false;
            }
        }

        return true;
    }

    reset() {

        this.availableFlags = this.numberOfBombs

        this.cells = MatrixUtils.create(this.rows, this.columns, () => new GameCell());
        this.bombs = RandomUtils.nextCells(this.cells, this.numberOfBombs);

        for (let { i, j } of this.bombs) {
            this.cells[i][j].hasBomb = true;
            this.flags[`${i}_${j}`] = false;
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.cells[i][j].hint = GameCellUtils.searchBombs(this.cells, i, j);
            }
        }

        super.trigger("reset", this);
    }

    expandCell(i, j) {

        if (!MatrixUtils.isValid(this.cells, i, j)) {
            return;
        }

        if (this.cells[i][j].visible) {
            return;
        }

        if (this.hasMine(i, j)) {
            return;
        }

        if (this.hasFlag(i, j)) {
            this.setFlag(i, j, false);
            this.availableFlags++;
            super.trigger("change", this);
        }

        this.cells[i][j].open();

        if (this.hasHint(i, j)) {
            return;
        }

        this.expandCell(i + 1, j + 1);
        this.expandCell(i + 1, j);
        this.expandCell(i + 1, j - 1);

        this.expandCell(i, j + 1);
        this.expandCell(i, j - 1);

        this.expandCell(i - 1, j + 1);
        this.expandCell(i - 1, j);
        this.expandCell(i - 1, j - 1);
    }

    leftClick(i, j) {

        if (this.hasMine(i, j)) {
            super.trigger("loose", this);
            this.reset();
            return;
        }

        if (!this.hasHint(i, j)) {
            this.expandCell(i, j)
        } else {
            this.cells[i][j].open();
        }
    }

    rightClick(i, j) {

        if (!this.cells[i][j].visible) {
            if (this.hasFlag(i, j)) {
                this.setFlag(i, j, false);
                this.availableFlags++;
            } else {
                if (this.availableFlags !== 0) {
                    this.setFlag(i, j, true);
                    this.availableFlags--;
                }
            }
        }

        if (this.isWin()) {
            super.trigger("win", this);
            this.reset();
        }

        super.trigger("change", this);
    }
}
