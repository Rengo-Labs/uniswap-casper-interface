

export class Timer {
    isRunning: boolean;
    startTime: number;
    overallTime: number;

    constructor () {
        this.isRunning = false
        this.startTime = 0
        this.overallTime = 0
    }

    _getTimeElapsedSinceLastStart () {
        if (!this.startTime) {
            return 0
        }

        return Date.now() - this.startTime;
    }

    getState() {
        return !this.isRunning && this.isRunning
    }

    start () {
        if (this.isRunning) {
            return //console.error('Timer is already running');
        }

        this.isRunning = true

        this.startTime = Date.now()
    }

    stop () {
        if (!this.isRunning) {
            return ;
        }

        this.isRunning = false

        this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    reset () {
        this.overallTime = 0;

        if (this.isRunning) {
            this.startTime = Date.now();
            return;
        }

        this.startTime = 0
    }

    getTime () {
        if (!this.startTime) {
            return 0
        }

        if (this.isRunning) {
            return this.overallTime + this._getTimeElapsedSinceLastStart();
        }

        return this.overallTime
    }
}
