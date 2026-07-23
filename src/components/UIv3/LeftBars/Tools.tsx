// Tools.tsx
import { useAtom, useSetAtom } from 'jotai'
import { memo, ReactNode } from 'react'
import { useFela } from 'react-fela'
import { $breakpoint, $builderHookStates, $draggingField } from '../../../GlobalStates/GlobalStates'
import { setBreakpointToLg } from '../../../Utils/gridLayoutHelpers'
import { toolStyle } from './Tools.styles'

interface FieldData {
  typ: string
  [key: string]: any
}

interface FieldSize {
  h: number
  w: number
  minW?: number
  x?: number
  i: string
}

interface ToolValue {
  fieldData: FieldData
  fieldSize: FieldSize
}

interface ToolsProps {
  setNewData: (value: ToolValue) => void
  value: ToolValue
  children: ReactNode
  title?: string
}

function Tools({ setNewData, value, children, title }: ToolsProps) {
  const setDraggingField = useSetAtom($draggingField)
  const [brkPoint] = useAtom($breakpoint)
  const setBuilderHookStates = useSetAtom($builderHookStates)

  const { css } = useFela()


  const handleOnDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.setData('text/plain', '')
    setBreakpointToLg()
    setDraggingField(value)
  }

  const handleClick = (): void => {
    setBreakpointToLg()
    setNewData(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setNewData(value)
    }
  }

  const handleDragEnd = (): void => {
    setDraggingField(null)
  }

  return (
    <div
      tabIndex={0}
      title={title}
      role="button"
      data-testid={`${value.fieldData.typ}-tool`}
      className={`${css(toolStyle)} bf-tool-item`}
      draggable
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragStart={handleOnDrag}
      onDragEnd={handleDragEnd}
    >
      {children}
    </div>
  )
}

export default memo(Tools)
