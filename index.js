
/**
 * @module makeSynth
 * @author qanper
 * @org qanper
 * @desc synth factory
 * @license gpl3
 */
 


import Adsr from 'stagas/adsr';

export default Synth;

function Synth(adsrParam, wf) {
  var _amp = 0;
  var _freq = 440;
  var synth = {};
  var _adsr = Adsr(adsrParam);
  
  function playFreq(freq, amp) {
    _freq = freq;
    _amp = amp;
    _adsr.play(0);
  }
  
  return {
    out: function (t) {
      var signal = 0;
      return wf(t,_freq) * _adsr(t) * _amp;
    }, 
    playFreq: function (freq, amp) {
      playFreq(freq, amp);
    },
    play: function (note, velocity) {
      playFreq(freq, velocity/128);
    }
  }
}


