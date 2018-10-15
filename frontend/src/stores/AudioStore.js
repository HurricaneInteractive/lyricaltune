import { action, observable, configure, runInAction, computed } from 'mobx'
import Tone from 'tone'

configure({ enforceActions: 'always' })

class AudioStore {
    synth = new Tone.Synth().toMaster()
    loop = null
    Transport = Tone.Transport
    @observable playing = false

    @computed get isPlaying() {
        return this.playing
    }

    chordSequence(chords) {
        let chords_array = []

        Object.keys(chords).forEach((key) => {
            chords[key].forEach((chord) => {
                chord.pattern.forEach((p, i) => {
                    if (typeof chords_array[i] === 'undefined') {
                        chords_array[i] = []
                    }
    
                    if (p === 1) {
                        chords_array[i].push(`${chord.note}${chord.octave}`)
                    }
                })
            })
        })

        return chords_array
    }

    @action
    stopTransportLoop() {
        this.Transport.stop();
        runInAction(() => {
            this.playing = false
        })
    }

    @action
    transportLoop(chords) {
        let chords_array = this.chordSequence(chords),
            i = 0
        
        runInAction(() => {
            this.playing = true
        })

        this.Transport.scheduleRepeat((time) => {
            let ticks = this.Transport.ticks
            if (ticks > 0 && ticks < 20) {
                i = 0;
            }

            if (typeof chords_array[i] === 'undefined') {
                this.stopTransportLoop();
                return false;
            }

            let chord = chords_array[i]
            if (chord.length !== 0) {
                let polySynth = new Tone.PolySynth(chord.length, Tone.Synth).toMaster();
                polySynth.triggerAttackRelease(chord, "16n");
            }
            i++
        }, "16n", 0, Tone.Time("16n") * 32)

        this.Transport.loop = true
        this.Transport.loopStart = 0
        this.Transport.loopEnd = Tone.Time('16n') * 32
        this.Transport.bpm.value = 80

        this.Transport.start('+0.1')
    }
}

export default new AudioStore()