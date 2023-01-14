/**
 * @exports Observer
 * @class Observer
 */
export class Observer {
     /**
      * @description Creates an instance of Observer
      * @memberof Observer
     */
    constructor() {
        this.observers = [];
    }

    /**
     * @description emits all handlers
     * @param {object} data arguments for the handler
     * @memberof Observer
    */
    notify(data) {
        this.observers.forEach(handler => handler(data));
    }

    /**
     * @description adds new callback to the observers
     * @param {object} handler callback to hangle event
     * @memberof Observer
    */
    subscribe(handler) {
        this.observers.push(handler);
    }
    
}