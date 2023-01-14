/**
 * @description manages routes
 * @exports Router
 * @class Router
 */
export class Router {

  /**
  * @description Creates an instance of Router
  * @param {*} options
  * @memberof Router
  */
  constructor(options) {

    this.routes = [];
    this.mode = null;
    this.root = '/';

    this.mode = window.history.pushState ? 'history' : 'hash';
    if (options.mode) this.mode = options.mode;
    if (options.root) this.root = options.root;

    this.listen();
  }

  /**
   * @description adds new route
   * @param {object} path
   * @param {function} callback
   * @return {object} an instance of Router
   * @memberof Router
   */
  add(path, callback) {
    this.routes.push({
      path,
      callback
    });
    return this;
  }

  /**
   * @description removes route
   * @param {object} path
   * @return {object} an instance of Router
   * @memberof Router
   */
  remove(path) {
    for (let i = 0; i < this.routes.length; i += 1) {
      if (this.routes[i].path === path) {
        this.routes.slice(i, 1);
        return this;
      }
    }
    return this;
  }

  /**
   * @description clears slashes at the start, middle and at the end of path
   * @param {object} path
   * @return {string}
   * @memberof Router
   */
  clearSlashes(path) {
    return path
      .toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');
  }

  /**
   * @description returns current hash of page
   * @return {string} path without slashes
   * @memberof Router
   */
  getFragment() {
    let fragment = '';
    if (this.mode === 'history') {

      fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    } else {

      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }

    return this.clearSlashes(fragment);
  }

  navigate(path = '') {
    if (this.mode === 'history') {
      window.history.pushState(null, null, this.root + this.clearSlashes(path));
    } else {
      window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
    }

    return this;
  }

  /**
   * @description listens to changes
   * @memberof Router
   */
  listen() {
    clearInterval(this.interval);
    this.interval = setInterval(this.interval.bind(this), 50);
  }

  /**
   * @description finds route and executes callback for this route
   * @return {object | undefined}
   * @memberof Router
   */
  interval() {
    if (this.current === this.getFragment()) return;

    this.current = this.getFragment();

    this.routes.some(route => {
      const match = this.current.match(route.path);
      if (match) {
        match.shift();
        route.callback.apply({}, match);

        return match;
      }

      return false;
    });
  }
}