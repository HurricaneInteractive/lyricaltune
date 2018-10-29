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
    @observable playing_phrase_id = null

    @computed get isPlaying() {
        return this.playing
    }

    @computed get beatIndex() {
        return this.currentBeat
    }

    @computed get playingPhrase() {
        return this.playing_phrase_id
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
    setPlayingPhraseId(id) {
        runInAction(() => {
            this.playing_phrase_id = id
        })
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
            this.playing_phrase_id = null
        })
    }

    setupAudioEffects(effects) {
        if (effects.hasOwnProperty('bpm')) {
            this.Transport.bpm.value = effects.bpm
        }
    }

    /** @deprecated */
    tickWithinRange(ticks) {
        return ticks > 0 && ticks < 20
    }

    startTransport() {
        this.Transport.start('+0.1');
    }

    @action
    transportLoop(chords, effects = null, loop = false) {
        let chords_array = this.chordSequence(chords),
            playbackStart = 0,
            playbackEnd = Tone.Time(this.note_fraction) * 32,
            reverb = new Tone.Reverb().toMaster(),
            hasGenerated = false

        reverb.decay = effects.reverb
        
        runInAction(() => {
            this.playing = true
            this.Transport = Tone.Transport
        })

        this.Transport.scheduleRepeat((time) => {
            let chord = chords_array[this.beatIndex]

            if (typeof chord === 'undefined') {
                this.stopTransportLoop();
                return false;
            }
            
            if (chord.length !== 0) {
                let polySynth = new Tone.PolySynth(chord.length, Tone.DuoSynth).toMaster();
                polySynth.connect(reverb)

                if (!hasGenerated) {
                    reverb.generate().then(() => {
                        polySynth.triggerAttackRelease(chord, this.note_fraction);
                        hasGenerated = true
                    })
                }
                else {
                    polySynth.triggerAttackRelease(chord, this.note_fraction);
                }
            }

            runInAction(() => {
                this.currentBeat += 1
            })
        }, this.note_fraction, playbackStart, playbackEnd)

        this.Transport.loop = true
        this.Transport.loopStart = playbackStart
        this.Transport.loopEnd = playbackEnd

        if (effects !== null) {
            this.setupAudioEffects(effects)
        }

        this.startTransport();

        this.Transport.on('loop', () => {
            if (loop) {
                runInAction(() => {
                    this.currentBeat = 0;
                })
            }
            else {
                this.stopTransportLoop()
            }
        })
    }
}

export default new AudioStore()