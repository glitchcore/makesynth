
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
  
  if ((2*t + 0  ) % 1   === 0) synth[0].play(50, 30);
  if ((3*t      ) % 1   === 0) synth[1].play(62, 20);
  if ((3*t      ) % 1   === 0) synth[2].play(69, 20);
  

  return synth[0].out(t) + ap.run(synth[1].out(t)) + synth[2].out(t);
}