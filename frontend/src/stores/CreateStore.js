import { action, observable, configure, runInAction, computed } from 'mobx'
import { keygen } from '../helpers/keygen'
import { performAxiosCall } from '../helpers/api'

import globalStore from './GlobalStore'

configure({ enforceActions: 'always' })

class CreateStore {
    @observable selectedArtist = ''
    @observable selectedSong = ''
    @observable selectedWords = []
    @observable scale = null
    @observable key_pairs = null
    @observable lyrics = ''
    @observable mixlab_data = {}
    @observable project_name = ''
    @observable effects = {
        bpm: 120,
        reverb: 1
    }
    @observable has_created = false
    @observable created_ID = null

    constructor(globalStore) {
        this.global_store = globalStore

        let settings = this.mixlab_settings,
            data = {},
            length = settings.bars * (settings.beats * 2)

        settings.octaves.forEach((oct) => {
            if (typeof data[oct] === 'undefined') {
                data[oct] = []
            }

            for (var i = 0; i < 8; i++) {
                let pattern = Array(length).fill(0)
                data[oct].push({
                    note: 'AST',
                    octave: oct,
                    pattern: pattern
                })
            }
        })

        runInAction(() => {
            this.mixlab_data = data
        })
    }

    @computed get hasCreated() {
        return this.has_created
    }

    @computed get mixlab_settings() {
        return {
            octaves: [5, 2],
            bars: 2,
            beats: 8,
            bpm: {
                min: 80,
                max: 180,
                step: 1
            },
            reverb: {
                min: 0.1,
                max: 8,
                step: 0.1
            }
        }
    }

    @computed get audioEffects() {
        return this.effects
    }

    audioEffect(key) {
        return computed(() => this.effects[key]).get()
    }

    @computed get BPM() {
        return this.effects.bpm
    }

    @computed get key() {
        return this.key_pairs ? this.key_pairs.key : null
    }

    @computed get words() {
        return this.selectedWords || null
    }

    @computed get mixlabData() {
        return this.mixlab_data
    }

    @computed get projectName() {
        return this.project_name
    }

    @action
    publishData() {
        return {
            name: this.projectName,
            key: this.key,
            notes: this.key_pairs.notes,
            phrases: this.mixlabData,
            words_selected: this.selectedWords,
            selected_artist: this.selectedArtist,
            selected_song: this.selectedSong,
            effects: this.audioEffects
        }
    }

    @action
    setLyricsWithMetadata(lyrics, artist, song) {
        if (typeof song === 'undefined' || typeof song !== 'string') {
            throw new Error('`song` is a required value and should be of type `string`')
        }

        if (song === '') {
            return false
        }

        if (song === this.selectedSong && this.lyrics !== '') {
            return false
        }

        runInAction(() => {
            this.selectedWords = []
            this.key_pairs = null
            this.scale = null
            this.selectedArtist = artist
            this.lyrics = lyrics
            if (song !== this.selectedSong) {
                this.selectedSong = song
            }
        })
    }

    // @action
    // async getLyrics(song = this.selectedSong) {
    //     if (typeof song === 'undefined' || typeof song !== 'string') {
    //         throw new Error('`song` is a required value and should be of type `string`')
    //     }

    //     if (song === '') {
    //         return false
    //     }

    //     if (song === this.selectedSong && this.lyrics !== '') {
    //         return false
    //     }

    //     return import(`../data/songs/${song}.json`)
    //         .then(res => {
    //             if (!res.hasOwnProperty(song)) {
    //                 throw new Error('Song could not be found')
    //             }
    //             else {
    //                 runInAction(() => {
    //                     this.selectedWords = []
    //                     this.key_pairs = null
    //                     this.scale = null
    //                     this.lyrics = res[song]
    //                     if (song !== this.selectedSong) {
    //                         this.selectedSong = song
    //                     }
    //                 })
                    
    //                 return this.lyrics
    //             }
    //         })
    //         .catch(e => console.error(e))
    // }

    @action
    toggleActiveBeat(octave, key, beat) {
        let data = this.mixlab_data
        data[octave][key].pattern[beat] === 0 ? data[octave][key].pattern[beat] = 1 : data[octave][key].pattern[beat] = 0

        runInAction(() => {
            this.mixlab_data = data
        })
    }

    @action
    mergeKeyPairsWithData() {
        let data = {}

        Object.keys(this.mixlab_data).forEach((key, i) => {
            if (typeof data[key] === 'undefined') {
                data[key] = this.mixlab_data[key]
            }

            this.key_pairs.notes.forEach((note, x) => {
                if (this.mixlab_data[key][x].note !== note) {
                    data[key][x].note = note
                }
            })
        })

        runInAction(() => {
            this.mixlab_data = data
        })
    }

    @action
    generateKey() {
        if (this.selectedWords.length === 0) {
            return false
        }

        let data = keygen(this.lyrics, this.selectedWords)
        runInAction(() => {
            this.scale = data.scale;
            this.key_pairs = data.key_pairs
            this.mergeKeyPairsWithData();
        })
    }

    @action
    wrapLyrics(lyrics) {
        if (typeof lyrics !== 'string' || lyrics.trim() === '') {
            throw new Error('`lyrics` is a required parameter and should be of type `string`')
        }

        lyrics = JSON.stringify(lyrics)

        let word_pattern = /(^|<\/?[^>]+>|\s+)([^\s^,<]+)/g
        let wrapped = lyrics.replace(/\\n/g, '<br/>');
        wrapped = wrapped.replace(/['?"()\\]/g, '');
        wrapped = wrapped.replace(/(\*\*\*\*\*\*\* This Lyrics is NOT for Commercial use \*\*\*\*\*\*\*)/g, '')
        wrapped = wrapped.replace(word_pattern, "$1<span>$2</span>")
        
        return wrapped
    }

    @action
    addWord(word) {
        if (word.trim() === '' || typeof word !== 'string') {
            throw new Error('Please provide a word')
        }

        if (this.selectedWords.length === 5) {
            return false
        }

        runInAction(() => {
            this.selectedWords.push(word.trim().toLowerCase())
        })
    }

    @action
    removeWord(key) {
        if (!this.selectedWords.indexOf(key)) {
            return false
        }

        runInAction(() => {
            this.selectedWords.splice(key, 1);
            if (this.selectedWords.length === 0) {
                this.key_pairs = null
            }
        })
    }

    @action
    setArtistName(name) {
        if (name.trim() === '' || typeof name !== 'string') {
            throw new Error('Please provide a valid value for the `name` arguement')
        }

        runInAction(() => {
            this.selectedArtist = name
        })
    }

    @action
    setProjectName(name) {
        runInAction(() => {
            this.project_name = name
        })
    }

    @action
    changeEffectSetting(effect, value) {
        runInAction(() => {
            this.effects[effect] = value
        })
    }

    @action
    async publishPhraseChanges(data, headers, update = this.has_created, id = this.created_ID) {
        try {
            if (update === true && id === null) {
                this.global_store.setResponseError({
                    message: "Error updating, please try again"
                })
                return false;
            }

            let route = update === false ? '/phrases/create' : `/phrases/update/${id}`
            let method = update === false ? 'post' : 'patch'

            const response = await performAxiosCall(route, data, method, headers, false, this.global_store)

            if (!response.data.hasOwnProperty('error')) {
                runInAction(() => {
                    this.has_created = true
                    this.created_ID = response.data[response.data.length - 1]._id
                })
            }

            return response;
        }
        catch(error) {
            this.global_store.setResponseError(error)
        }
    }
}

export default new CreateStore(globalStore)