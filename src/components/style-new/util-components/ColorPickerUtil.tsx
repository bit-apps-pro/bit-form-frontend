import { useFela } from 'react-fela'
import CloseIcn from '../../../Icons/CloseIcn'
import ut from '../../../styles/2.utilities'
import Downmenu from '../../Utilities/Downmenu'
import ColorPreview from '../ColorPreview'
import ColorPickerControllerUtil from './ColorPickerControllerUtil'
import ImportantUtil from './ImportantUtil'
import { colorPickerProps, valueObject } from './color-picker'

export default function ColorPickerUtil({ id, value, onChangeHandler, allowImportant, allowSolid = true, allowImage = true, allowGradient = true, allowVariable = true, colorProp = 'color' }: colorPickerProps) {
  const { css } = useFela()
  const valueObj: valueObject = typeof value === 'string' ? { color: value } : value
  if (colorProp) {
    valueObj.color = valueObj[colorProp]
  }
  const clearHandler = () => {
    if (typeof value === 'string') {
      changeHandler({ color: '' })
      return
    }
    const newObject: { [key: string]: string } = {}
    Object.keys(valueObj).forEach(key => {
      newObject[key] = ''
    })
    changeHandler(newObject)
  }

  const changeHandler = (newValue: valueObject) => {
    if (colorProp !== 'color' && newValue.color) {
      newValue[colorProp] = newValue.color
      delete newValue.color
    }
    onChangeHandler(newValue)
  }

  const colorValue = valueObj['background-image'] || valueObj.color
  return (
    <div data-testid={`${id}-hover`} className={css(ut.flxcb, style.containerHover)}>
      <div className={css(ut.flxc)}>
        {allowImportant && colorValue && (
          <ImportantUtil
            className={css({ mr: 3 })}
            value={valueObj}
            changeAction={(newValue) => changeHandler(newValue)}
          />
        )}
        <div
          className={css(style.preview_wrp)}
          title={colorValue || 'Pick Color'}
        >
          <Downmenu
            onShow={() => { }}
            onHide={() => { }}
            hideOnClick='toggle'
          >
            <button
              type="button"
              className={css(style.pickrBtn)}
              data-testid={`${id}-modal-btn`}
            >
              <ColorPreview bg={colorValue} h={24} w={24} className={css(ut.mr2)} />
              <span className={css(style.clrVal)}>{colorValue || 'Pick Color'}</span>
            </button>
            <ColorPickerControllerUtil
              id={id}
              value={valueObj}
              onChangeHandler={changeHandler}
              allowSolid={allowSolid}
              allowGradient={allowGradient}
              allowImage={allowImage}
              allowVariable={allowVariable}
              colorProp={colorProp}
            />
          </Downmenu>

          {colorValue && (
            <button
              title="Clear Value"
              onClick={clearHandler}
              className={css(style.clearBtn)}
              type="button"
              aria-label="Clear Color"
              data-testid={`${id}-clear-btn`}
            >
              <CloseIcn className="" size="12" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const style = {
  delBtn: {
    se: 20,
    flx: 'center',
    b: 'none',
    p: 0,
    mr: 1,
    tn: '.2s all',
    curp: 1,
    brs: '50%',
    tm: 'scale(0)',
    bd: 'none',
    cr: 'var(--red-100-61)',
    pn: 'absolute',
    lt: -15,
    ':hover': { bd: '#ffd0d0', cr: '#460000' },
  },
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
