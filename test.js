
/**
 * test
 */


/* ===== SYSTEM ==== */
import Debug from 'debug';

var debug = Debug('test');

/* ====== SYNTH ====== */
import { sin, saw, ramp, tri, sqr, pulse, noise } from 'opendsp/osc';
import env from 'opendsp/envelope';
import {Synth, oct, transpose, Mixer} from './index';

var lead = Synth("lead", { a: 5 }, sin);
var bassline = Synth("bassline", { a: 1 }, saw);
var kick = Synth("kick", {a:0.01, s: 26},
                  function(t, freq) {
                    return Math.sin(67 * env(t*2, 1/4, 28, 1.5));
                  });


/* ===== SAMPLER ===== */
import Chords from 'stagas/chords';
import stringToNote from 'opendsp/note';

var leadPattern = [0, 0, -2, -2, 0, 0, 3, 0];
var leadIter = 0;

function sampler(t) {
  if ((3*t + 0  )%1===0)
    lead.play(t, [Chords('F#maj9')[leadIter % 3]]
                      .map(oct(4))
                      .map(transpose(leadPattern[leadIter % leadPattern.length]) ), 30, 1.4);
  if ((6*t + 0  )%1===0) {
    var notes = ['F#2', 'H2'];
    notes = notes.map(transpose(leadPattern[leadIter % leadPattern.length]));
    bassline.play(t, notes, 15, 1);
  }
    
  if ((2*t + 0  )%1===0)
    kick.play(t, [1], 30);

  if ((2*t/4 + 0 )%1===0) {
    leadIter++;
  }
}

/* ====== MIXER ====== */

import Allpass from 'opendsp/allpass';

var filter = Allpass(1000);

var mixer = Mixer();
mixer.addChannel(lead.out, 75);
mixer.addChannel(kick.out, 70);
mixer.addChannel(function(t) {
    return filter.run(bassline.out(t));
  }, 85);
mixer.setMaster(80);

/* ====== PLAYER ===== */
export function dsp(t) {
  sampler(t);
  
  return mixer.out(t);
  
}
