import { Constants } from "../../services/config/constants";

export  class Timer {
    
    private readonly fps: number = 28;

    private finished: Function;
    private interval: Function;

    private timer: NodeJS.Timeout;

    private intervals: number;

    private counter: number;
    private time: number;
    
    
    constructor(time: number) {
        this.time = time;
        this.intervals = time<=0?1:(time / this.fps);
    }

    public start() {
        this.stop();
        this.counter = 0;
        this.timer = setInterval(() => {
            if(this.interval) {
                this.interval(Math.floor(100/this.time*this.counter));
            }

            if(this.counter >= this.intervals*this.fps) {
                if(this.finished) {
                    this.finished();   
                }
                this.stop();
            }

            this.counter+=this.intervals;
        }, this.intervals);
    }

    public stop() {
        clearInterval(this.timer);
    }

    public clear() {
        clearInterval(this.timer);
    }

    public onFinished(finished: Function) {
        this.finished = finished;
    }

    public onInterval(interval: Function) {
        this.interval = interval;
    }
}