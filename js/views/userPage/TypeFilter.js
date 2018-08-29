/* categoryFilter.js and typeFilter.js share quite a bit. Ensure that when one is updated,
the other is also maintained.
*/

import $ from 'jquery';
import loadTemplate from '../../utils/loadTemplate';
import BaseVw from '../baseVw';

export default class extends BaseVw {
  constructor(options = {}) {
    const opts = {
      ...options,
    };

    opts.initialState = {
      types: [],
      selected: 'all',
      expanded: false,
      maxInitiallyVisibleTypes: 6,
      ...(options.initialState || {}),
    };

    super(opts);
    this.options = opts;
  }

  className() {
    return 'clrP clrBr padMd clrT contentBox clrSh2 form veryCompact categoryOrTypeFilter';
  }

  events() {
    return {
      'click .js-showMoreLess': 'onClickShowMoreLess',
      'change input[type="radio"]': 'onChangeType',
    };
  }

  onClickShowMoreLess() {
    this.setState({ expanded: !this.getState().expanded });
  }

  onChangeType(e) {
    this._state.selected = e.target.value;
    this.trigger('type-change', { value: $(e.target).val() });
  }

  get selectedType() {
    return this._selected;
  }

  render() {
    if (this.getState().types && this.getState().types.length === 1) {
      this.$el.addClass('disabled');
    }

    loadTemplate('userPage/typeFilter.html', (t) => {
      this.$el.html(t({
        ...this._state,
      }));
    });

    this.rendered = true;

    return this;
  }
}
