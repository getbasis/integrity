'use strict';

import $ from 'jquery';
import BasisDrawer from '../../node_modules/getbasis-drawer/src/js/drawer.js';
import BasisFixedHeader from '../../node_modules/getbasis-layout/src/js/fixed-header.js';
import BasisOverlayHeader from '../../node_modules/getbasis-layout/src/js/overlay-header.js';
import BasisMenu from '../../node_modules/getbasis-menu/src/js/menu.js';

new BasisDrawer({
  container    : '.p-drawer-nav',
  drawer       : '.p-drawer-nav__body',
  btn          : '.p-drawer-nav__btn',
  toggleSubmenu: '.p-drawer-nav__toggle'
});
new BasisFixedHeader();
new BasisOverlayHeader();
new BasisMenu();
