import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Play, ChevronLeft, ChevronRight, Pause } from 'react-feather'

@inject('CreateStore')
@inject('AudioStore')
@observer
export default class Mixlab extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mixlab_data: {},
            sidebar: false,
            effects: {
                bpm: 100
            },
            effects_settings: {
                bpm: {
                    min: 80,
                    max: 180
                }
            }
        }
    }
    
    componentDidMount() {
        if (this.props.CreateStore.key === null) {
            this.props.routerProps.history.push('/create/lyrics')
        }
        else {
            this.setState({
                mixlab_data: this.props.CreateStore.data
            })
        }
    }

    toggleActiveBeat = (e, octave, key, beat) => {
        e.preventDefault();
        let data = this.state.mixlab_data
        data[octave][key].pattern[beat] === 0 ? data[octave][key].pattern[beat] = 1 : data[octave][key].pattern[beat] = 0

        this.setState({
            mixlab_data: data
        })
    }

    toggleSidebar = (e) => {
        e.preventDefault();
        let sidebar = this.state.sidebar
        this.setState({
            sidebar: !sidebar
        })
    }

    updateProjectName = (e) => {
        this.props.CreateStore.setProjectName(e.target.value)
    }

    onEffectSliderChange = (e, name) => {
        if (typeof name === 'undefined') {
            name = e.target.name
        }

        let effects = this.state.effects,
            effects_settings = this.state.effects_settings,
            value = e.target.value

        value = value > effects_settings[name].max ? effects_settings[name].max : value
        value = value < effects_settings[name].min ? effects_settings[name].min : value

        effects[name] = value

        this.setState({
            effects: effects
        })
    }

    playTune = (e) => {
        e.preventDefault();
        let { AudioStore } = this.props

        if (AudioStore.isPlaying) {
            console.log('stop');
            AudioStore.stopTransportLoop()
        }
        else {
            console.log('start');
            AudioStore.transportLoop(this.state.mixlab_data)
        }
    }

    generateOctaveRows = (octave) => {
        let row = this.state.mixlab_data[octave].map((oct, key) => {
            return (
                <div className="row" key={`${oct}-${key}`}>
                    <div className="note">{oct.note}</div>
                    <div className="pattern">
                        {
                            oct.pattern.map((beat, i) => (
                                <div 
                                    className={`beat ${ beat !== 0 ? 'active' : ''}`}
                                    key={`${key}-${i}`}
                                    onClick={(e) => this.toggleActiveBeat(e, octave, key, i)}
                                />
                            ))
                        }
                    </div>
                </div>
            )
        })

        return row
    }

    render() {
        let { CreateStore, authenticated, routerProps, AudioStore } = this.props
        let { sidebar, effects, effects_settings } = this.state

        let name_empty = CreateStore.projectName.trim() === ''

        if (this.state.mixlab_data !== {}) {
            return (
                <div className="mixlab">
                    <div className="octave-wrapper">
                        { 
                            Object.keys(this.state.mixlab_data).map((oct, i) => (
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
                                <div className="bpm">
                                    <input
                                        type="number"
                                        name="bpm-numeric"
                                        id="bpm-numeric"
                                        className="bpm-numeric"
                                        onChange={(e) => this.onEffectSliderChange(e, 'bpm')}
                                        value={effects.bpm}
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
                                        value={effects.bpm}
                                        onChange={(e) => this.onEffectSliderChange(e)}
                                    />
                                </div>
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
                            { authenticated ? <button className="btn btn-highlight">Save</button> : '' }
                            <a href="#back" onClick={(e) => {
                                e.preventDefault()
                                routerProps.history.goBack()
                            }}>Leave Project</a>
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