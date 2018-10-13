import { action, observable, configure, runInAction, computed } from 'mobx'
import Tone from 'tone'

configure({ enforceActions: 'always' })

class AudioStore {
    synth = new Tone.Synth().toMaster()
    loop = null
    playChordTimeout = null
    songTimeout = null
    @observable playing = false

    @computed get isPlaying() {
        return this.playing
    }

    playTune( chords ) {
        clearTimeout(this.playChordTimeout)
        clearTimeout(this.songTimeout)

        runInAction(() => {
            this.playing = true
        })

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

        chords_array.forEach((chord, index) => {
            this.playChordTimeout = setTimeout(() => {
                this.playChord(chord.length, chord)
            }, 500 * index)
        })

        this.songTimeout = setTimeout(() => {
            clearTimeout(this.playChordTimeout)
            clearTimeout(this.songTimeout)
            runInAction(() => {
                this.playing = false
            })
        }, chords_array.length * 500)
    }

    playChord(voices, chordArray) {
        if (chordArray.length > 0) {
            let polySynth = new Tone.PolySynth(voices, Tone.Synth).toMaster();
            polySynth.triggerAttackRelease(chordArray, "8n");
        }
    }
}

export default new AudioStore()