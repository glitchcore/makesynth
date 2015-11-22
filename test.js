
/**
 * test
 */

import Synth from './index';
// import oct from './index';

import { sin, saw, ramp, tri, sqr, pulse, noise } from 'opendsp/osc';
import Allpass from 'opendsp/allpass';
import env from 'opendsp/envelope';

import Chords from 'stagas/chords';

import Debug from 'debug';

var debug = Debug('test');


var lead = Synth("lead", { a: 5 }, sin);
var bassline = Synth("bassline", { a: 1 }, saw);


var kick = Synth("kick", {a:0.01, s: 26},
                  function(t, freq) {
                    return Math.sin(67 * env(t*2, 1/4, 28, 1.5));
                  });

var filter = Allpass(3000);

var leadPattern = [0, 2, 5];
var leadIter = 0;
  
export function dsp(t) {
  
  if ((3*t + 0  ) % 1   === 0) 
    lead.play(t, Chords('A')
                      .map(oct(3))
                      .map(transpose(leadPattern[leadIter % 3]) ), 30, 1.4);
  if ((6*t + 0  ) % 1   === 0) bassline.play(t, [30, 37], 15, 1);
  if ((2*t + 0  ) % 1   === 0) kick.play(t, [1], 30);

  if ((2*t/8 + 0  ) % 1   === 0) {
    leadIter++;
  }
  
  return lead.out(t) + 
         filter.run(bassline.out(t)) +
         kick.out(t);
}

function transpose(x) {
  return function(y) {
    return x + y;
  };
}
function oct(x) {
  return function(y) {
    return x*12 + y;
  };
}