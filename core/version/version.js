'use strict';

angular.module('gursoyVakfi.version', [
  'gursoyVakfi.version.interpolate-filter',
  'gursoyVakfi.version.version-directive'
])

.value('version', '0.1');
