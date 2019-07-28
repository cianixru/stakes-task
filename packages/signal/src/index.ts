// tslint:disable
/**
 *    @desc       A TypeScript conversion of JS Signals by Miller Medeiros
 *               Released under the MIT license
 *                http://millermedeiros.github.com/js-signals/
 *
 *    @version    1.0 - 7th March 2013
 *
 *    @author    Richard Davey, TypeScript conversion
 *    @author        Miller Medeiros, JS Signals
 *    @author        Robert Penner, AS Signals
 *
 *    @url        http://www.photonstorm.com
 */


import {isFrontend} from '@sha/utils'

/**
 * Custom event broadcaster
 * <br />- inspired by Robert Penner's AS3 Signals.
 * @name Signal
 * @author Miller Medeiros
 * @constructor
 */
export class Signal<F extends Function> {

    /**
     * Signals Version Number
     * @property VERSION
     * @type String
     * @const
     */
    public static VERSION: string = '1.0.2';
    /**
     * If Signal should keep isRecording of previously dispatched parameters and
     * automatically execute listener during `add()`/`addOnce()` if Signal was
     * already dispatched before.
     * @type boolean
     */
    public memorize: boolean = false;
    /**
     * If Signal is active and should broadcast events.
     * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
     * @type boolean
     */
    public active: boolean = true;
    /**
     * @property _bindings
     * @type Array
     * @private
     */
    private _bindings: SignalBinding<F>[] = [];
    /**
     * @property _prevParams
     * @type Any
     * @private
     */
    private _prevParams = null;
    /**
     * @type boolean
     * @private
     */
    private _shouldPropagate: boolean = true;

    /**
     * @method validateListener
     * @param {Any} listener
     * @param {Any} fnName
     */
    public validateListener(listener: F, fnName) {

        if (typeof listener !== 'function') {
            throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
        }

    }

    /**
     * Check if listener was attached to Signal.
     * @param {Function} listener
     * @param {Object} [context]
     * @return {boolean} if Signal has the specified listener.
     */
    public has(listener: F, context: any = null): boolean {

        return this._indexOfListener(listener, context) !== -1;

    }

    /**
     * Add a listener to the signal.
     * @param {Function} listener Signal handler function.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
     * @return {SignalBinding} An Object representing the binding between the Signal and listener.
     */
    public add(listener: F, listenerContext: any = null, priority: number = 0): SignalBinding<F> {

        this.validateListener(listener, 'add');

        return this._registerListener(listener, false, listenerContext, priority);

    }

    /**
     * Add listener to the signal that should be removed after first execution (will be executed only once).
     * @param {Function} listener Signal handler function.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
     * @return {SignalBinding} An Object representing the binding between the Signal and listener.
     */
    public addOnce(listener: F, listenerContext: any = null, priority: number = 0): SignalBinding<F> {

        this.validateListener(listener, 'addOnce');

        return this._registerListener(listener, true, listenerContext, priority);

    }

    /**
     * Remove a single listener from the dispatch queue.
     * @param {Function} listener Handler function that should be removed.
     * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
     * @return {Function} Listener handler function.
     */
    public remove(listener: F, context: any = null) {

        this.validateListener(listener, 'remove');

        var i: number = this._indexOfListener(listener, context);

        if (i !== -1) {
            this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
            this._bindings.splice(i, 1);
        }

        return listener;

    }

    /**
     * Remove all listeners from the Signal.
     */
    public removeAll() {

        var n: number = this._bindings.length;

        while (n--) {
            this._bindings[n]._destroy();
        }

        this._bindings.length = 0;

    }

    /**
     * @return {number} Number of listeners attached to the Signal.
     */
    public getNumListeners(): number {

        return this._bindings.length;

    }

    /**
     * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
     * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
     * @see Signal.prototype.disable
     */
    public halt() {

        this._shouldPropagate = false;

    }

    /**
     * Dispatch/Broadcast Signal to all listeners added to the queue.
     * @param {...*} [params] Parameters that should be passed to each handler.
     */
    public dispatch(...paramsArr: any[]) {

        if (!this.active) {
            return;
        }

        var n: number = this._bindings.length;
        var bindings: SignalBinding<F>[];

        if (this.memorize) {
            this._prevParams = paramsArr;
        }

        if (!n) {
            //should come after memorize
            return;
        }

        bindings = this._bindings.slice(0); //clone array in case add/remove list during dispatch

        this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

        //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
        //reverse loop since listeners with higher priority will be added at the end of the list
        do {
            n--;
        } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);

    }

    /**
     * Forget memorized arguments.
     * @see Signal.memorize
     */
    public forget() {

        this._prevParams = null;

    }

    /**
     * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
     * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
     */
    public dispose() {

        this.removeAll();

        delete this['_bindings'];
        delete this['_prevParams'];

    }

    /**
     * @return {string} String representation of the object.
     */
    public toString(): string {

        return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';

    }

    /**
     * @param {Function} listener
     * @param {boolean} isOnce
     * @param {Object} [listenerContext]
     * @param {Number} [priority]
     * @return {SignalBinding}
     * @private
     */
    private _registerListener(listener: F, isOnce: boolean, listenerContext, priority: number): SignalBinding<F> {

        var prevIndex: number = this._indexOfListener(listener, listenerContext);
        var binding: SignalBinding<F>;

        if (prevIndex !== -1) {
            binding = this._bindings[prevIndex];

            if (binding.isOnce() !== isOnce) {
                throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
            }
        }
        else {
            binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);

            this._addBinding(binding);
        }

        if (this.memorize && this._prevParams) {
            binding.execute(this._prevParams);
        }

        return binding;

    }

    /**
     * @method _addBinding
     * @param {SignalBinding} binding
     * @private
     */
    private _addBinding(binding: SignalBinding<F>) {

        //simplified insertion sort

        var n: number = this._bindings.length;

        do {
            --n;
        } while (this._bindings[n] && binding.priority <= this._bindings[n].priority);

        this._bindings.splice(n + 1, 0, binding);

    }

    /**
     * @method _indexOfListener
     * @param {Function} listener
     * @return {number}
     * @private
     */
    private _indexOfListener(listener, context): number {

        var n: number = this._bindings.length;
        var cur: SignalBinding<F>;

        while (n--) {
            cur = this._bindings[n];

            if (cur.getListener() === listener && cur.context === context) {
                return n;
            }
        }

        return -1;

    }

}

/*
 *	@desc   	An object that represents a binding between a Signal and a listener function.
 *               Released under the MIT license
 *				http://millermedeiros.github.com/js-signals/
 *
 *	@guid	1.0 - 7th March 2013
 *
 *	@author 	Richard Davey, TypeScript conversion
 *	@author		Miller Medeiros, JS Signals
 *	@author		Robert Penner, AS Signals
 *
 *	@url		http://www.kiwijs.org
 *
 */

export class SignalBinding<F extends Function> {

    /**
     * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @memberOf SignalBinding.prototype
     * @name context
     * @type Object|undefined|null
     */
    public context;
    /**
     * Listener priority
     * @type Number
     */
    public priority: number;
    /**
     * If binding is active and should be executed.
     * @type boolean
     */
    public active: boolean = true;
    /**
     * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
     * @type Array|null
     */
    public params = null;
    /**
     * Handler function bound to the signal.
     * @type Function
     * @private
     */
    private _listener;
    /**
     * If binding should be executed just once.
     * @type boolean
     * @private
     */
    private _isOnce: boolean;
    /**
     * Reference to Signal object that listener is currently bound to.
     * @type Signal
     * @private
     */
    private _signal: Signal<F>;

    /**
     * Object that represents a binding between a Signal and a listener function.
     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
     * @author Miller Medeiros
     * @constructor
     * @internal
     * @name SignalBinding
     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
     * @param {Function} listener Handler function bound to the signal.
     * @param {boolean} isOnce If binding should be executed just once.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. (default = 0).
     */
    constructor(signal: Signal<F>, listener: F, isOnce: boolean, listenerContext, priority: number = 0) {

        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext;
        this._signal = signal;
        this.priority = priority || 0;

    }

    /**
     * Call listener passing arbitrary parameters.
     * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
     * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
     * @return {*} Value returned by the listener.
     */
    public execute(paramsArr?: any[]) {

        var handlerReturn;
        var params;

        if (this.active && !!this._listener) {
            params = this.params ? this.params.concat(paramsArr) : paramsArr;

            handlerReturn = this._listener.apply(this.context, params);

            if (this._isOnce) {
                this.detach();
            }
        }

        return handlerReturn;

    }

    /**
     * Detach binding from signal.
     * - alias to: mySignal.remove(myBinding.getListener());
     * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
     */
    public detach() {

        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;

    }

    /**
     * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
     */
    public isBound(): boolean {

        return (!!this._signal && !!this._listener);

    }

    /**
     * @return {boolean} If SignalBinding will only be executed once.
     */
    public isOnce(): boolean {
        return this._isOnce
    }

    /**
     * @return {Function} Handler function bound to the signal.
     */
    public getListener() {
        return this._listener

    }

    /**
     * @return {Signal} Signal that listener is currently bound to.
     */
    public getSignal() {

        return this._signal;

    }

    /**
     * Delete instance properties
     * @private
     */
    public _destroy() {

        delete this._signal;
        delete this._listener;
        delete this.context;

    }

    /**
     * @return {string} String representation of the object.
     */
    public toString(): string {

        return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';

    }

}

/**
 * Guid based temporary signal, for use into dangerouslyRenderHTML
 */
export class WindowSignal extends Signal<Function> {

    private static _signals: Map<string, WindowSignal> = new Map<string, WindowSignal>();

    private _guid: string;

    public get guid(): string {
        if (this._guid === undefined)
            this._guid = WindowSignal.registerWithGUID(this);

        return this._guid;
    }

    public static dispatch(guid: string, ...params: any[]): void {

        if (WindowSignal._signals.has(guid))
            WindowSignal._signals.get(guid).dispatch.apply(WindowSignal._signals.get(guid), params);

    }

    private static randomGUID(): string {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();

    }

    private static registerWithGUID(signal: WindowSignal): string {
        var guid: string = WindowSignal.randomGUID();

        while (WindowSignal._signals.has(guid))
            guid = WindowSignal.randomGUID();

        WindowSignal._signals.set(guid, signal);
        return guid;
    }

    public dispose() {
        WindowSignal._signals.delete(this._guid);
        super.dispose();
    }
}

if (isFrontend())
    window['windowSignals'] = WindowSignal;
