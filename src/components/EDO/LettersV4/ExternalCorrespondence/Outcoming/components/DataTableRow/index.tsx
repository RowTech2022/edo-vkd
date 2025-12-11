import { GridRow, GridRowProps } from '@mui/x-data-grid'
import cx from 'classnames'
import React from 'react'
import { useDrag } from 'react-dnd'
import styles from './index.module.css'

export default function DataTableRow(props: GridRowProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'folder',
    item: props.row,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  const className = cx(styles.incoming_row, {
    [styles.draggable]: isDragging,
  })

  return (
    <div ref={drag} className={className}>
      <GridRow {...props} />
    </div>
  )
}
