import _ from 'underscore';
import loadTemplate from '../utils/loadTemplate';
import baseVw from './baseVw';
import { isMultihash } from '../utils';

export default class extends baseVw {
  constructor(options = {}) {
    super(options);

    this._state = {
      hide: true,
      url: '',
      ...options.initialState || {},
    };
  }

  updateVisibilityBasedOn(addressBarText) {
    if (typeof addressBarText !== 'string') {
      throw new Error('Please provide a valid address bar as string.');
    }

    const viewOnWebState = {
      hide: true,
    };

    const urlParts = this.getUrlParts(addressBarText);

    if (urlParts.length > 1 && isMultihash(urlParts[0])) {
      const supportedPages = ['store', 'home', 'followers', 'following'];
      const currentPage = urlParts[1];

      if (supportedPages.includes(currentPage)) {
        const obDotCom = 'http://openbazaar.com';
        const peerID = urlParts[0];

        if (currentPage === 'store') {
          // app: '/peerID/store/' => web: '/store/peerID/'
          viewOnWebState.url = `${obDotCom}/store/${peerID}`;

          if (urlParts.length === 3) {
            // app: '/peerID/store/slug' => web: '/store/peerID/slug'
            const slug = urlParts[2];
            viewOnWebState.url = `${viewOnWebState.url}/${slug}`;
          }
        } else {
          // app: '/peerID/(home|followers|following)' =>
          // web: '/store/(home|followers|following)/peerID'
          viewOnWebState.url = `${obDotCom}/store/${currentPage}/${peerID}`;
        }
      }
    }

    viewOnWebState.hide = !!viewOnWebState.url;
    this.setState(viewOnWebState);
  }

  getUrlParts(url) {
    if (typeof url !== 'string') {
      throw new Error('Please provide a valid url as a string.');
    }

    const urlParts = url.startsWith('ob://') ?
      url.slice(5)
      .split(' ')[0] :
      url.split(' ')[0];

    return urlParts.split('/');
  }

  className() {
    return 'addressBarIndicators';
  }

  getState() {
    return this._state;
  }

  setState(state, replace = false) {
    let newState;

    if (replace) {
      this._state = {};
    } else {
      newState = _.extend({}, this._state, state);
    }

    if (!_.isEqual(this._state, newState)) {
      this._state = newState;
      this.render();
    }

    return this;
  }

  render() {
    loadTemplate('addressBarIndicators.html', (t) => {
      this.$el.html(t({
        ...this._state,
      }));
    });

    return this;
  }
}
