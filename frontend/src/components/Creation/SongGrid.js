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
                    onDragEnter={(e) => this.onDragEnter(e)}
                    onDragLeave={(e) => this.onDragLeave(e)}
                    onDragOver={(e) => this.onDragOver(e)}
                    data-id={p.id}
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

    getElementCoords = (item_row, index) => {
        let elements = document.querySelectorAll(`.${item_row} .draggable`)
        return elements[index].getBoundingClientRect()
    }

    getProps = (item_row) => {
        return item_row !== 'store' ? { size: 'width', dir: 'x' } : { size: 'height', dir: 'y' }
    }

    closest = (dropped, item_row, id) => {
        let closest = null,
            prop = this.getProps(item_row)

        for (const [i, li] of this.state.rows[item_row].entries()) {
            if (li.key === id) continue;

            let coords = this.getElementCoords(item_row, i)
            
            if (dropped[prop.dir] > coords[prop.dir] && dropped[prop.dir] < (coords[prop.dir] + coords[prop.size])) {
                closest = i
                break;
            }
        }

        return closest
    }

    determineDropPosition = (item_row, dropped, closest) => {
        let coords = this.getElementCoords(item_row, closest),
            prop = this.getProps(item_row),
            zone = coords[prop.dir] + (coords[prop.size] / 2)

        return dropped[prop.dir] <= zone ? 'before' : 'after'
    }

    resetDraggableElems = () => {
        let allDraggable = document.querySelectorAll('.droppable .draggable')
        allDraggable.forEach(elem => {
            elem.classList.remove('hovered', 'insert-after', 'insert-before')
        })
    }
    
    onDragEnter = (ev) => {
        
    }

    onDragLeave = (ev) => {
        this.resetDraggableElems()
    }

    onDragOver = (ev) => {
        ev.preventDefault()
        let target = ev.target
        if (target && !target.classList.contains('dragged')) {
            let draggedElem = document.querySelector('.droppable .draggable.dragged')
            target.classList.add('hovered')
            let dropped = { x: ev.clientX, y: ev.clientY },
                id = draggedElem.getAttribute('data-id'),
                item = this.state.phrases.filter(p => p.id === id),
                closest = this.closest(dropped, item[0].row, id)

            if (closest !== null) {
                let dropPos = this.determineDropPosition(item[0].row, dropped, closest)
                switch (dropPos) {
                    case 'before':
                        target.classList.add('insert-before')
                        target.classList.remove('insert-after')
                        break
                    case 'after':
                    default:
                        target.classList.add('insert-after')
                        target.classList.remove('insert-before')
                        break
                }
            }
        }
    }

    onDragStart = (ev, id) => {
        ev.dataTransfer.setData('id', id)
        ev.target.classList.add('dragged')
    }

    onDrop = (ev, row) => {
        this.resetDraggableElems()
        let dragged = document.querySelector('.draggable.dragged')
        dragged.classList.remove('dragged')

        let { rows, phrases } = this.state,
            id = ev.dataTransfer.getData('id'),
            item = phrases.filter(p => p.id === id),
            item_row = item[0].row

        if (item_row === row) {
            let dropped = { x: ev.clientX, y: ev.clientY },
                curIndex = this.findIndexByKey(rows[item_row], 'key', id),
                closest = this.closest(dropped, item_row, id)

            if (closest !== null) {
                let dropPos = this.determineDropPosition(item_row, dropped, closest)

                switch (dropPos) {
                    case 'before':
                        rows[item_row].splice(closest, 0, rows[item_row][curIndex])
                        rows[item_row].splice((curIndex + 1), 1)
                        break
                    case 'after':
                    default:
                        rows[item_row].splice((closest + 1), 0, rows[item_row][curIndex])
                        rows[item_row].splice(curIndex, 1)
                        break
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
                    className="droppable store"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { this.onDrop(e, "store") }}
                >
                    {this.state.rows.store}
                </div>

                <div className="grid">
                    <div className="row">
                        <span className="row-label">1</span>
                        <div 
                            className="droppable one"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => this.onDrop(e, "one")}
                        >
                            {this.state.rows.one}
                        </div>
                    </div>
                    <div className="row">
                        <span className="row-label">2</span>
                        <div 
                            className="droppable two"
                            onDragOver={(e) => e.preventDefault()}
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