
/**
 * @name first
 */
import { sin, saw, ramp, tri, sqr, pulse, noise } from 'opendsp/osc';
import Adsr from 'stagas/adsr';
import Allpass from 'opendsp/allpass';

import Debug from 'debug';

function makeSynth(adsr, wf) {
  var _amp = 0;
  var _freq = 440;
  var synth = {};
  
  function playFreq(freq, amp) {
    _freq = freq;
    _amp = amp;
    adsr.play(0);
  }
  
  return {
    out: function (t) {
      var signal = 0;
      return wf(t,_freq) * adsr(t) * _amp;
    }, 
    playFreq: function (freq, amp) {
      playFreq(freq, amp);
    },
    play: function (note, velocity) {
      playFreq(freq, velocity/128);
    }
  }
}

var debug = Debug('test');

var synth = [makeSynth(Adsr({ a: 5 }), sin),makeSynth(Adsr({ a: 1 }), saw),makeSynth(Adsr({ a: 1 }), sin)]

var ap = Allpass(3000);

export function dsp(t) {
  
  if ((2*t + 0  ) % 1   === 0) synth[0].playFreq(440, 0.2);
  if ((3*t      ) % 1   === 0) synth[1].playFreq(330, 0.2);
  if ((3*t      ) % 1   === 0) synth[2].playFreq(110, 0.2);
  

  return /*synth[0].out(t) +*/ ap.run(synth[1].out(t)) /*+ synth[2].out(t)*/;
}
