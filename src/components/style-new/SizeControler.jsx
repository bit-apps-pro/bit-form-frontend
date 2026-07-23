import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $draggableModal } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import Important from './Important'
import { assignNestedObj, getValueByObjPath, showDraggableModal } from './styleHelpers'

export default function SizeControler({ subtitle, action, value, objectPaths, id, allowImportant }) {
  const { css } = useFela()
  const { element, fieldKey } = useParams()
  const [draggableModal, setDraggableModal] = useAtom($draggableModal)
  const [styles, setStyles] = useAtom($styles)

  const { object, paths } = objectPaths
  // const val = getValueByObjPath(styles, paths?.width || paths?.height)
  const val = `W: ${getValueByObjPath(styles, paths?.width)}, H: ${getValueByObjPath(styles, paths?.height)}`

  const clearHandler = () => {
    setStyles(prvStyle => create(prvStyle, drft => {
      if (object === 'styles') {
        assignNestedObj(drft, paths?.width, '')
        assignNestedObj(drft, paths?.height, '')
      }
    }))
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Clear Width/Height', '', { styles: getLatestState('styles') }))
  }

  return (
    <div className={css(ut.flxc, { cg: 3 })}>
      {allowImportant && val && (<Important id={id} propertyPath={paths?.width || paths?.height} stateObjName={object} />)}
      <div className={css(c.preview_wrp, draggableModal.id === id && c.active)}>
        <button
          onClick={e => showDraggableModal(e, setDraggableModal, { component: 'size-control', subtitle, action, value, objectPaths, id })}
          type="button"
          className={css(c.pickrBtn)}
          title={val}
          data-testid={`${id}-model-btn`}
        >
          {val || 'Configure'}
        </button>
        {(val) && (
          <button
            title="Clear Value"
            onClick={clearHandler}
            className={css(c.clearBtn)}
            type="button"
            aria-label="Clear Color"
            data-testid={`${id}-clear-btn`}
          >
            <CloseIcn size="12" />
          </button>
        )}
      </div>
    </div>
  )
}

const c = {
  preview_wrp: {
    bd: 'var(--white-0-95)',
    w: 130,
    mnw: 130,
    brs: 'var(--bf-bdr-radius-sm)',
    p: 7,
    flx: 'center-between',
    h: 30,
    ':hover': { bs: '0 0 0 1px var(--white-0-83)' },
  },
  preview: {
    w: 25,
    h: 25,
    b: '1px solid gray',
    brs: 7,
    curp: 1,
    mr: 7,
  },
  clearBtn: {
    brs: '50%',
    w: 20,
    h: 20,
    b: 'none',
    flx: 'center',
    bd: 'transparent',
    cr: 'var(--white-0-50)',
    curp: 1,
    ':hover': { cr: 'var(--black-0)' },
  },
  pickrBtn: {
    b: 'none',
    curp: 1,
    bd: 'transparent',
    ws: 'nowrap',
    to: 'ellipsis',
    p: 0,
    h: 28,
    w: 94,
    dy: 'block',
    ow: 'hidden',
    ta: 'start',
  },
  clrVal: {
    w: 90,
    ws: 'nowrap',
    textOverflow: 'ellipsis',
    ta: 'left',
    ow: 'hidden',
  },
  active: { focusShadow: 1 },
}
