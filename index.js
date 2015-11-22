
/**
 * @module makeSynth
 * @author qanper
 * @org qanper
 * @desc synth factory
 * @license gpl3
 */
 

import Adsr from 'stagas/adsr';
import note from 'opendsp/note';

export default Synth;

function Synth(adsrParam, wf) {
  var synths = [];
  
  function playFreqs(t, freqs, amp, dur) {
    var adsr = Adsr(adsrParam);
    adsr.play(0);
    freqs.forEach(function(freq) {
      synths.push({
        amp: amp,
        adsr: adsr,
        freq: freq,
        t: t,
        dur: dur
      });
    });
  }
  
  return {
    out: function (t) {
      var signal = 0;
      for(var i = 0; i < synths.length; i++) {
        var synth = synths[i];
        signal += wf(t,synth.freq) * synth.adsr(t) * synth.amp;
        if(t - synth.t > synth.dur) {
          synths.splice(i, 1);
        }
      }
      return signal;
    },
    playFreq: function (t, freqs, amp, dur) {
      playFreqs(t, freqs, amp, dur);
    },
    play: function (t, n, velocity, dur) {
      playFreqs(t, n.map(note), velocity/128, dur);
    }
  }
}

