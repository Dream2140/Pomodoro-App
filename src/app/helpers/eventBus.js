/**
 * @description handles custom events
 * @class EventBus
 */
class EventBus {

    /**
     * @description Creates an instance of EventBus
     * @memberof EventBus
    */
    constructor() {
        this.eventCallbacksPairs = [];
    }

    /**
     * @description subscribes to custom event
     * @param {string} type
     * @param {object} callback
     * @memberof EventBus
    */
    subscribe(type, callback) {
        const eventCallbacksPair = this.findEventCallbacksPair(type);

        if (eventCallbacksPair) {
            eventCallbacksPair.callbacks.push(callback);
        } else {
            this.eventCallbacksPairs.push(new EventCallbacksPair(type, callback));
        }
    }

    /**
     * @description executes custom event handler
     * @param {string} eventType
     * @param {*} args to pass to event handler
     * @return {undefined} if no callback handler found
     * @memberof EventBus
    */
    post(eventType, args) {
        const eventCallbacksPair = this.findEventCallbacksPair(eventType);

        if (!eventCallbacksPair) {
            return;
        }

        eventCallbacksPair.callbacks.forEach(callback => callback(args));
    }

    /**
     * @description finds event by type
     * @param {string} type
     * @return {string} event type
     * @memberof EventBus
    */
    findEventCallbacksPair(type) {
        return this.eventCallbacksPairs.find(
            eventObject => eventObject.eventType === type
        );
    }
}

/**
 * @description creates pairs of handlers and custom events
 * @class EventCallbacksPair
 */
class EventCallbacksPair {
    /**
   * @description Creates an instance of EventCallbacksPair
   * @param {string} eventType
   * @param {object} callback
   * @memberof EventCallbacksPair
   */
    constructor(eventType, callback) {
        this.eventType = eventType;
        this.callbacks = [callback];
    }
}
export const eventBus = new EventBus();