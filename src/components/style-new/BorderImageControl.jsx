/* eslint-disable no-param-reassign */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $draggableModal } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import CloseIcn from '../../Icons/CloseIcn'
import TrashIcn from '../../Icons/TrashIcn'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import { __ } from '../../Utils/i18nwrap'
import ColorPreview from './ColorPreview'
import Important from './Important'
import ResetStyle from './ResetStyle'
import { assignNestedObj, showDraggableModal } from './styleHelpers'

export default function BorderImageControl({
  title,
  stateObjName,
  propertyPath,
  subtitle,
  value,
  objectPaths,
  modalType,
  modalId,
  deleteable,
  delPropertyHandler,
  allowImportant,
  hslaPaths,
  fldKey,
}) {
  const { css } = useFela()
  const { element, fieldKey } = useParams()
  const setStyles = useSetAtom($styles)
  const setThemeVars = useSetAtom($themeVars)
  const setThemeColors = useSetAtom($themeColors)
  const [draggableModal, setDraggableModal] = useAtom($draggableModal)

  const clearHandler = () => {
    switch (stateObjName) {
      case 'themeColors':
        setThemeColors(prvStyle => create(prvStyle, drft => {
          drft[`${propertyPath}`] = ''
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, `Clear ${propertyPath}`, '', { themeColors: getLatestState('themeColors') }))
        break
      case 'themeVars':
        setThemeVars(prvStyle => create(prvStyle, drft => {
          drft[`${propertyPath}`] = ''
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, `Clear ${propertyPath}`, '', { themeVars: getLatestState('themeVars') }))
        break
      case 'styles':
        setStyles(prvState => create(prvState, drftStyles => {
          assignNestedObj(drftStyles, propertyPath, '')
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, `Clear ${propertyPath}`, '', { styles: getLatestState('styles') }))
        break
      default:
        break
    }
  }

  return (
    <div className={css(ut.flxcb, ut.mt2, c.containerHover)}>
      <div className={css(ut.flxc, deleteable && ut.ml1)}>
        {deleteable && (
          <button
            title="Delete Property"
            onClick={delPropertyHandler}
            className={`${css(ut.stylePropDeleteBtn)} delete-btn`}
            type="button"
            data-testid={`${modalId}-delete-btn`}
          >
            <TrashIcn size="14" />
          </button>
        )}
        <span className={css(ut.fw500)}>{__(title)}</span>
      </div>
      <div className={css(ut.flxc)}>
        <ResetStyle id={modalId} stateObjName={stateObjName} propertyPath={propertyPath} />
        {allowImportant && value && (
          <Important
            className={css({ mr: 3 })}
            stateObjName={stateObjName}
            propertyPath={propertyPath}
            id={modalId}
          />
        )}
        <div className={css(c.preview_wrp, draggableModal.id === modalId && c.active)}>
          <button
            onClick={e => showDraggableModal(e, setDraggableModal, {
              component: 'border-image', subtitle, action: { type: modalType }, value, id: modalId, objectPaths, stateObjName, propertyPath, hslaPaths, fldKey,
            })}
            type="button"
            className={css(c.pickrBtn)}
            data-testid={`${modalId}-bdr-ctrl-btn`}
          >
            <ColorPreview bg={value?.replace(/!important/gi, '')} h={24} w={24} className={css(ut.mr2)} />
            <span className={css(c.clrVal)}>{value?.replace(/\(|var|\)/gi, '')}</span>
          </button>
          {value && (
            <button
              title="Clear Value"
              onClick={clearHandler}
              className={css(c.clearBtn)}
              type="button"
              aria-label="Clear Color"
              data-testid={`${modalId}-clear-btn`}
            >
              <CloseIcn size="12" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const c = {
  containerHover: { '&:hover .delete-btn': { tm: 'scale(1)' } },
  preview_wrp: {
    bd: 'var(--white-0-95)',
    w: 130,
    mnw: 130,
    brs: 10,
    p: 3,
    flx: 'center-between',
    ':hover': { bs: '0 0 0 1px var(--white-0-83)' },
  },
  clearBtn: {
    brs: '50%',
    p: 4,
    w: 17,
    h: 17,
    b: 'none',
    flx: 'center',
    bd: 'transparent',
    cr: 'var(--white-0-50)',
    curp: 1,
    ':hover': { cr: 'var(--black-0)', bd: '#d3d1d1' },
  },
  pickrBtn: {
    b: 'none',
    curp: 1,
    flx: 'center',
    bd: 'transparent',
    p: 0,
  },

  clrVal: {
    w: 73,
    ws: 'nowrap',
    textOverflow: 'ellipsis',
    ta: 'left',
    ow: 'hidden',
  },
  active: { focusShadow: 1 },

}
