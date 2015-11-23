
/**
 * @module makeSynth
 * @author qanper
 * @org qanper
 * @desc synth factory
 * @license gpl3
 */
 

import Adsr from 'stagas/adsr';
import note from 'opendsp/note';

import Debug from 'debug';

export function Synth(name, adsrParam, wf) {
  var synths = [];
  
  var debug = Debug('Synth');
  debug("at start: ", synths);
  
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
    // debug("[", name, "] after push:", synths.length);
  }
  
  return {
    out: function (t) {
      var signal = 0;
      for(var i = 0; i < synths.length; i++) {
        var synth = synths[i];
        signal += wf(t,synth.freq) * synth.adsr(t) * synth.amp;
        if(synth.adsr(t) < 0.01) {
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

export function transpose(x) {
  return function(y) {
    if ('string' === typeof y) y = stringToNote(y);
    return x + y;
  };
}

export function oct(x) {
  return function(y) {
    if ('string' === typeof y) y = stringToNote(y);
    return x*12 + y;
  };
}

function stringToNote(s){
  s = s.split('');
  var octave = parseInt(s[s.length - 1], 10);
  if (isNaN(octave)) octave = 4;
  var note = s[0].toLowerCase();
  var flat = s[1] === 'b';
  var sharp = s[1] === '#';
  var notes = 'ccddeffggaab';
  return notes.indexOf(note) + (octave * 12) + sharp - flat;
}

export function Mixer() {
 var channels = [];
 var _master = 1;
 return {
   addChannel: function(channel, volume) {
     if (typeof(volume) === 'number')
      volume = value(volume);
     channels.push({func: channel, volume: volume});
     return channel;
   },
   out: function(t) {
     var out = 0;
     channels.forEach(function(channel) { 
       out += channel.func(t) * 
              percentToVal(channel.volume()) * 
              percentToVal(_master());
      });
      return out;
   },
   setMaster: function(volume) {
     if (typeof(volume) === 'number')
      volume = value(volume);
     _master = volume;
   }
 }
}

function percentToVal(percent) {
 return Math.pow(10, ((percent - 100)/50));
}

function value(x) {
  return function() {
    return x;
  }
}
