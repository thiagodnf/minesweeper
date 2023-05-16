export default class GameCell {

    constructor() {
        this.visible = false;
        this.hasBomb = false;
        this.hasFlag = false;
        this.hint = 0;
    }

    open() {
        this.visible = true;
        this.hasFlag = false;
    }
}
