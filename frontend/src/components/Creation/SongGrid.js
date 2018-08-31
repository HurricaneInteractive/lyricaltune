import React, { Component } from 'react'

export default class SongGrid extends Component {
    constructor() {
        super()

        this.state = {
            phrases: [
                { id: '45', name: '1', row: 'store' },
                { id: '70', name: '2', row: 'store' },
                { id: '12', name: '3', row: 'store' }
            ],
            rows: {
                store: [],
                one: [],
                two: []
            }
        }
    }

    componentDidMount() {
        let rows = this.state.rows

        this.state.phrases.forEach((p) => {
            rows[p.row].push(
                <div 
                    className="draggable"
                    key={p.id}
                    draggable
                    onDragStart={(e) => this.onDragStart(e, p.id)}
                >
                    { p.name }
                </div>
            )
        })

        this.setState({
            rows: rows
        })
    }

    findIndexByKey = (target, key, value) => {
        return target.findIndex(item => item[key] === value)
    }

    updateRows() {
        
    }

    onDragOver = (ev) => {
        ev.preventDefault()
    }

    onDragStart = (ev, id) => {
        ev.dataTransfer.setData('id', id)
    }

    onDrop = (ev, row) => {
        let { rows, phrases } = this.state,
            id = ev.dataTransfer.getData('id'),
            item = phrases.filter(p => p.id === id),
            item_row = item[0].row

        // Dropping in same row
        if (item_row === row) {
            let dropped = { x: ev.clientX, y: ev.clientY }
            let elements = document.querySelectorAll(`.${item_row} .draggable`)
            let curIndex = this.findIndexByKey(rows[item_row], 'key', id)
            console.log('c', curIndex)
            // rows[item_row].forEach((item, i) => {
            for (const [i, list_item] of rows[item_row].entries()) {
                if (list_item.key === id) {
                    return false;
                }
                let dom = elements[i]
                let dom_coords = dom.getBoundingClientRect()
                let zone = dom_coords.y + (dom_coords.height / 2)
                console.log({
                    index: i,
                    dropped: dropped,
                    zone: zone
                })
                if (dropped.y < zone) {
                    console.log('Move infront of', i)
                    let removed = rows[item_row].splice(i, 0, rows[item_row][curIndex])
                    removed = rows[item_row].splice((curIndex + 1), 1)

                    console.log(rows);
                    break;
                }
            }
        }
        else {
            let index = this.findIndexByKey(rows[item_row], 'key', item[0].id),
                p_index = this.findIndexByKey(phrases, 'id', id),
                removed = rows[item_row].splice(index, 1)

            phrases[p_index].row = row
            rows[row].push(removed[0])
        }

        this.setState({
            rows: rows,
            phrases: phrases
        })
    }

    render() {
        return (
            <div className="song-grid">
                <div 
                    className="store"
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => { this.onDrop(e, "store") }}
                >
                    {this.state.rows.store}
                </div>

                <div className="grid">
                    <div className="row">
                        <span className="row-label">1</span>
                        <div 
                            className="droppable one"
                            onDragOver={(e) => this.onDragOver(e)}
                            onDrop={(e) => this.onDrop(e, "one")}
                        >
                            {this.state.rows.one}
                        </div>
                    </div>
                    <div className="row">
                        <span className="row-label">2</span>
                        <div 
                            className="droppable two"
                            onDragOver={(e) => this.onDragOver(e)}
                            onDrop={(e) => this.onDrop(e, "two")}
                        >
                            {this.state.rows.two}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}