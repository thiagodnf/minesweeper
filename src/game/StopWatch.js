import Observable from "./Observable.js";

export default class StopWatch extends Observable {

    constructor() {
        super();

        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;

        this.interval = null;
        this.events = [];
    }

    count() {

        this.seconds++;

        if (this.seconds === 60) {
            this.seconds = 0;
            this.minutes++;
        }

        if (this.minutes === 60) {
            this.minutes = 0;
            this.hours++;
        }

        this.trigger("change", this.toString());
    }

    reset() {

        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;

        this.trigger("change", this.toString());
    }

    start() {

        let that = this;

        if (!this.interval) {
            this.interval = setInterval(function () { that.count() }, 1000);
        }
    }

    stop() {

        if (this.interval) {

            clearInterval(this.interval);

            this.interval = null;
        }
    }

    toString() {

        if (this.hours !== 0) {
            return `${this.hours}h ${this.minutes}m ${this.seconds}s`;
        } else if (this.minutes !== 0) {
            return `${this.minutes}m ${this.seconds}s`;
        } else {
            return `${this.seconds}s`;
        }
    }
}
