
/**
 * test
 */

import Synth from './index'
import { sin, saw, ramp, tri, sqr, pulse, noise } from 'opendsp/osc';
import Allpass from 'opendsp/allpass';

import Debug from 'debug';

var debug = Debug('test');

var synth = [Synth({ a: 5 }, sin),Synth({ a: 1 }, saw),Synth({ a: 1 }, sin)]

var ap = Allpass(3000);

export function dsp(t) {
  
  if ((2*t + 0  ) % 1   === 0) synth[0].playFreq(440, 0.2);
  if ((3*t      ) % 1   === 0) synth[1].playFreq(330, 0.2);
  if ((3*t      ) % 1   === 0) synth[2].playFreq(110, 0.2);
  

  return /*synth[0].out(t) +*/ ap.run(synth[1].out(t)) /*+ synth[2].out(t)*/;
}