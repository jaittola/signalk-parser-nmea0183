/*
 * VPW codec
 *
 * @repository          https://github.com/signalk/nmea-signalk
 * @author                      Jukka Aittola <jaittola@iki.fi>
 *
 *
 *
 * Copyright 2015, Jukka Aittola
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/*
=== VPW - Speed - Measured parallel to wind  ===

------------------------------------------------------------------------------
        0   1 2   3 4
        |   | |   | |
 $--VPW,x.x,N,x.x,M*hh<CR><LF>
------------------------------------------------------------------------------

$IIVPW,3.26,N,,*06

Field Number:

0: Speed, "-" means downwind
1: N = Knots
2: Speed, "-" means downwind
3: M = Meters per second
4: Checksum
*/

var Codec = require('../lib/NMEA0183');

function hasValue(value) {
    return (typeof value !== 'undefined' &&
           value !== '');
}

module.exports = new Codec('VPW', function(multiplexer, input) {
    var values = input.values;

    var speedParallelToWind;

    if (hasValue(values[2])) {
        speedParallelToWind = this.float(values[2]);
    }
    else if (hasValue(values[0])) {
        speedParallelToWind = this.transform(values[0], 'knots', 'ms');
    }

    multiplexer
        .self()
        .group('navigation')
        .timestamp(this.timestamp())
        .source(this.source())
        .values([{ path: 'speedParallelToWind',
                   value: speedParallelToWind || 0 }]);

    return true;
});
