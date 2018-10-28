import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Play, ChevronLeft, ChevronRight, Pause } from 'react-feather'
import classNames from 'classnames'

import Dial from '../Form/InputTypes/Dial'

@inject('CreateStore')
@inject('AudioStore')
@observer
export default class Mixlab extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sidebar: false
        }
    }
    
    componentDidMount() {
        if (this.props.CreateStore.key === null) {
            this.props.routerProps.history.push('/create/lyrics')
        }
    }

    toggleActiveBeat = (e, octave, key, beat) => {
        e.preventDefault();
        this.props.CreateStore.toggleActiveBeat(octave, key, beat)
    }

    toggleSidebar = (e) => {
        e.preventDefault();
        let sidebar = this.state.sidebar
        this.setState({
            sidebar: !sidebar
        })
    }

    savePhrase = (e) => {
        e.preventDefault();
        let { UserStore, CreateStore } = this.props
        let data = CreateStore.publishData()
        let headers = UserStore.axiosHeaders

        CreateStore.publishPhraseChanges(data, headers)
            .then(res => {
                console.log('Success', res);
            })
            .catch(e => console.error(e))
    }

    updateProjectName = (e) => {
        this.props.CreateStore.setProjectName(e.target.value)
    }

    onEffectSliderChange = (e, name) => {
        let { CreateStore } = this.props
        if (typeof name === 'undefined') {
            name = e.target.name
        }

        let effects_settings = CreateStore.mixlab_settings,
            value = e.target.value

        value = value > effects_settings[name].max ? effects_settings[name].max : value
        value = value < effects_settings[name].min ? effects_settings[name].min : value

        CreateStore.changeEffectSetting(name, value)
    }

    playTune = (e) => {
        e.preventDefault();
        let { AudioStore, CreateStore } = this.props

        if (AudioStore.isPlaying) {
            AudioStore.stopTransportLoop()
        }
        else {
            AudioStore.transportLoop(CreateStore.mixlabData, CreateStore.audioEffects, false)
        }
    }

    generateOctaveRows = (octave) => {
        let { AudioStore, CreateStore } = this.props

        let row = CreateStore.mixlabData[octave].map((oct, key) => {
            return (
                <div className="row" key={`${oct}-${key}`}>
                    <div className="note">{oct.note}</div>
                    <div className="pattern">
                        {
                            oct.pattern.map((beat, i) => {
                                let beatClass = classNames({
                                    'beat': true,
                                    'active': beat !== 0,
                                    'beat-active': AudioStore.beatIndex === i && AudioStore.isPlaying
                                })

                                return (
                                    <div 
                                        className={beatClass}
                                        key={`${key}-${i}`}
                                        onClick={(e) => this.toggleActiveBeat(e, octave, key, i)}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            )
        })

        return row
    }

    getRotationDegree = (name) => {
        let effect_val = this.props.CreateStore.audioEffect(name),
            effects_settings = this.props.CreateStore.mixlab_settings,
            min = effects_settings[name].min,
            max = effects_settings[name].max

        if (typeof effects_settings[name] !== 'undefined' && effect_val) {
            let degree = Math.floor((360/(max-min)) * effect_val - (36/(max-min)))

            return degree
        }
        else {
            return 0
        }
    }

    render() {
        let { CreateStore, authenticated, routerProps, AudioStore } = this.props
        let { sidebar } = this.state
        let effects_settings = CreateStore.mixlab_settings

        let name_empty = CreateStore.projectName.trim() === ''

        if (CreateStore.mixlabData !== {}) {
            return (
                <div className="mixlab">
                    <div className="octave-wrapper">
                        { 
                            Object.keys(CreateStore.mixlabData).map((oct, i) => (
                                <div className="octave" key={`octave-${oct}`}>
                                    <div className="octave-label">
                                        <p>Octave {oct}</p>
                                    </div>
                                    <div className="rows-wrapper">
                                        { this.generateOctaveRows(oct) }
                                    </div>
                                </div>
                            ))
                        }
                        <div className={`metadata-siderbar ${ sidebar ? 'active' : '' }`}>
                            <a href="#toggle" className="sidebar-toggle" onClick={(e) => this.toggleSidebar(e)}>
                                { sidebar ? <ChevronRight /> : <ChevronLeft /> }
                                <span>Toggle Sidebar</span>
                            </a>
                            <input
                                className={`project-name ${name_empty ? 'empty' : ''}`}
                                value={CreateStore.projectName}
                                onChange={(e) => this.updateProjectName(e)}
                                placeholder={'Project Name'}
                            />
                            <div className="effect-settings">
                                <p className="section-title">Adjustments</p>
                                <div className="bpm input-group">
                                    <input
                                        type="number"
                                        name="bpm-numeric"
                                        id="bpm-numeric"
                                        className="bpm-numeric"
                                        onChange={(e) => this.onEffectSliderChange(e, 'bpm')}
                                        value={CreateStore.BPM}
                                        min={effects_settings.bpm.min}
                                        max={effects_settings.bpm.max}
                                    />
                                    <label htmlFor="bpm">BPM</label>
                                    <input 
                                        type="range"
                                        name="bpm"
                                        id="bpm"
                                        min={effects_settings.bpm.min}
                                        max={effects_settings.bpm.max}
                                        value={CreateStore.BPM}
                                        onChange={(e) => this.onEffectSliderChange(e)}
                                        step={effects_settings.bpm.step}
                                    />
                                </div>
                                <Dial
                                    name='reverb'
                                    value={CreateStore.audioEffect('reverb')}
                                    onChange={(e) => this.onEffectSliderChange(e, 'reverb')}
                                    degree={this.getRotationDegree('reverb')}
                                    label='Reverb'
                                    settings={effects_settings.reverb}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mixlab-controls">
                        <div className="time-controls">
                            <div className="play" onClick={(e) => this.playTune(e)}>
                                { AudioStore.isPlaying ? <Pause /> : <Play /> }
                            </div>
                        </div>
                        <div className="user-controls">
                            { 
                                authenticated ? (
                                    <button className="btn btn-highlight" onClick={(e) => this.savePhrase(e)}>
                                        { CreateStore.hasCreated ? 'Update': 'Save' }
                                    </button>
                                ) : (
                                    ''
                                )
                            }
                            <a href="#back" onClick={(e) => {
                                e.preventDefault()
                                routerProps.history.goBack()
                            }}>Lyric Select</a>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return ''
        }
    }
}