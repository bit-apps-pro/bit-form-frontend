import { useFela } from "react-fela"
import ut from "../../../styles/2.utilities"
import Downmenu from "../../Utilities/Downmenu"
import SimpleColorPickerTooltip from "../SimpleColorPickerTooltip"
import BoxSizingUtil from "./BoxSizingUtil"
import SelectUtil from "./SelectUtil"


export default function BorderControlUtil({ value, id, onChangeHandler }: BorderControlType) {
  const { css } = useFela()

  const values = () => {
    let val = ''
    if (value?.['border-width']) val += `${value['border-width']} `
    if (value?.['border-style']) val += `${value['border-style']} `
    if (value?.['border-color']) val += `${value['border-color']} `
    if (value?.['border-radius']) val += `| Radius: ${value['border-radius']} `
    return val
  }

  const onValueChange = (prop: keyof BorderValueType, val: string) => {
    const borderPropObj = {
      'border-style': value?.['border-style'] || '',
      'border-color': value?.['border-color'] || '',
      'border-width': value?.['border-width'] || '',
      'border-radius': value?.['border-radius'] || '',
    }
    borderPropObj[prop] = val
    onChangeHandler(borderPropObj)
  }

  return (
    <div className={css(ut.flxc, { cg: 3 })}>
      <div title={values() || 'Configure'} className={css(c.preview_wrp)}>
        <Downmenu
          onShow={() => { }}
          onHide={() => { }}
        >
          <button
            type="button"
            className={css(c.pickrBtn)}
            data-testid={`${id}-border-picker-button`}
          >
            {values() || 'Configure'}
          </button>
          <div className={css(c.tipWrp)}>
            <div className={css(c.stlWrp)}>
              <span>Style</span>
              <SelectUtil
                options={options}
                value={value?.['border-style']?.replace('!important', '').trim()}
                onChange={(val: string) => onValueChange('border-style', val)}
                w={130}
                h={30}
                id={`${id}-style`}
              />
            </div>
            <div className={css(c.stlWrp)}>
              <span>Color</span>
              <SimpleColorPickerTooltip
                action={{ onChange: (val: string) => onValueChange('border-color', val) }}
                value={value?.['border-color']?.replace('!important', '').trim()}
              />
            </div>
            <div>
              <span>Width</span>
              <BoxSizingUtil
                value={value?.['border-width']}
                className={css({ p: 5 })}
                onChangeHandler={(val: string) => onValueChange('border-width', val)}
              />
            </div>
            <div>
              <span>Radius</span>
              <BoxSizingUtil
                value={value?.['border-radius']}
                className={css({ p: 5 })}
                onChangeHandler={(val: string) => onValueChange('border-radius', val)}
              />
            </div>
          </div>
        </Downmenu>
      </div>
    </div>
  )
}

type BorderValueType = {
  'border-style': string,
  'border-color': string
  'border-width': string
  'border-radius': string
}

type BorderControlType = {
  value: BorderValueType
  id: string,
  onChangeHandler: (val: BorderValueType) => void,
}

const options = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
  { label: 'Double', value: 'double' },
  { label: 'Groove', value: 'groove' },
  { label: 'Ridge', value: 'ridge' },
  { label: 'Inset', value: 'inset' },
  { label: 'Outset', value: 'outset' },
  { label: 'None', value: 'none' },
]

const c = {
  preview_wrp: {
    bd: 'var(--white-0-95)',
    w: 130,
    mnw: 130,
    brs: 10,
    p: 7,
    pr: '3px !important',
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
  tipWrp: {
    p: 5,
  },
  stlWrp: {
    flx: 'center-between',
    mb: 5,
  },
}
