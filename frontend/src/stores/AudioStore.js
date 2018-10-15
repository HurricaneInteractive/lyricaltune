import { action, observable, configure, runInAction, computed } from 'mobx'
import Tone from 'tone'

configure({ enforceActions: 'always' })

class AudioStore {
    synth = new Tone.Synth().toMaster()
    loop = null
    Transport = Tone.Transport
    note_fraction = '16n'
    @observable currentBeat = 0;
    @observable playing = false

    @computed get isPlaying() {
        return this.playing
    }

    @computed get beatIndex() {
        return this.currentBeat
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
        console.log('stop');
        this.Transport.stop()
        this.Transport.cancel()

        runInAction(() => {
            this.Transport = Tone.Transport
            this.playing = false
            this.currentBeat = 0
        })
    }

    @action
    transportLoop(chords) {
        console.log('start')
        // Tone.Master.volumn = 0.5;
        let chords_array = this.chordSequence(chords)
        
        runInAction(() => {
            this.playing = true
        })

        this.Transport.scheduleRepeat((time) => {
            let ticks = this.Transport.ticks
            if (ticks > 0 && ticks < 20) {
                runInAction(() => {
                    this.currentBeat = 0
                })
            }

            if (typeof chords_array[this.beatIndex] === 'undefined') {
                this.stopTransportLoop();
                return false;
            }

            let chord = chords_array[this.beatIndex]
            if (chord.length !== 0) {
                let polySynth = new Tone.PolySynth(chord.length, Tone.Synth).toMaster();
                polySynth.triggerAttackRelease(chord, this.note_fraction);
            }

            runInAction(() => {
                this.currentBeat += 1
            })
        }, this.note_fraction, 0, Tone.Time(this.note_fraction) * 32)

        this.Transport.loop = true
        this.Transport.loopStart = 0
        this.Transport.loopEnd = Tone.Time(this.note_fraction) * 32
        this.Transport.bpm.value = 180

        this.Transport.start('+0.1')
    }
}

export default new AudioStore()