
/**
 * @name first
 */
import { sin, saw, ramp, tri, sqr, pulse, noise } from 'opendsp/osc';
import Adsr from 'stagas/adsr';

import Debug from 'debug';

function makeSynth(adsr, wf) {
  var _amp = 0;
  var _freq = 440;
  var synth = {};
  
  return {
    out: function (t) {
      return wf(t,_freq) * adsr(t) * _amp;
    }, 
    play: function (t, freq, amp) {
      _freq = freq;
      _amp = amp;
      adsr.play(t);
    }
  }
}

var debug = Debug('test');

var synth = [makeSynth(Adsr({ a: 5 }), sin),makeSynth(Adsr({ a: 1 }), saw),makeSynth(Adsr({ a: 1 }), sin)]

export function dsp(t) {
  
  if ((2*t + 0  ) % 1   === 0) synth[0].play(t, 440, 0.2);
  if ((3*t      ) % 1   === 0) synth[1].play(t, 330, 0.2);
  if ((3*t      ) % 1   === 0) synth[2].play(t, 110, 0.2);
  

  return synth[0].out(t) + synth[1].out(t) + synth[2].out(t);
}
