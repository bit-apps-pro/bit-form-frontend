import { useMemo, useState } from 'react'
import { useFela } from 'react-fela'
import BorderFullIcn from '../../../Icons/BorderFullIcn'
import BorderLeftTopIcn from '../../../Icons/BorderLeftTopIcn'
import BoxFullIcon from '../../../Icons/BoxFullIcon'
import BoxIcon from '../../../Icons/BoxIcon'
import ut from '../../../styles/2.utilities'
import Grow from '../../CompSettings/StyleCustomize/ChildComp/Grow'
import SizeControl from '../../CompSettings/StyleCustomize/ChildComp/SizeControl'
import StyleSegmentControl from '../../Utilities/StyleSegmentControl'
import { getNumFromStr, getStrFromStr, unitConverter } from '../styleHelpers'

export default function BoxSizingUtil({
  title,
  className,
  lblCls,
  value,
  onChangeHandler,
  unitOption = ['px', 'em', 'rem'],
  icons,
  iconVariant = 'default',
  align = 'right'
}: BoxSizingUtilProps) {
  const { css } = useFela()

  let values = (value?.replace(/!important/gi, '') || '0px 0px 0px 0px').trim().split(' ')
  if (values.length === 4) {
    const distinct = values.filter((val, index, self) => self.indexOf(val) === index)
    if (distinct.length === 1) values = distinct
  }

  const [controller, setController] = useState<ControllerType>(values.length === 1 ? 'All' : 'Individual')

  const sizeValues = (v: string) => (v && getNumFromStr(v)) || 0
  const sizeUnits = (v: string) => (v && getStrFromStr(v)) || 'px'

  const allIcons: IconsType = useMemo(() => icons ?? getIcons(iconVariant, css), [icons, iconVariant])

  const options = [
    { label: 'All', icn: allIcons.header?.all, show: ['icn'], tip: 'All Side' },
    { label: 'Individual', icn: allIcons.header?.individual, show: ['icn'], tip: 'Individual Side' },
  ]

  /*
    varable [values].lenght 4
    values[0] = top,
    values[1] = right
    values[2] = bottom
    values[3] = left
  */
  if (values.length === 1 && controller === 'All') {
    values = [values[0]]
  }

  if (values.length === 1 && controller === 'Individual') {
    values = Array(4).fill(values[0])
  }

  if (values.length === 2) {
    values = [values[0], values[1], values[0], values[1]]
  }

  if (values.length === 3) {
    values = [values[0], values[1], values[2], values[1]]
  }

  const getValueString = (values: string[], parent = controller) => {
    let v
    if (parent === 'All') {
      v = `${values[0]}`
    } else {
      v = `${values[0]} ${values[1]} ${values[2]} ${values[3]}`
    }
    return v
  }

  const handleValues = ({ value: val, unit, id }: { value: string, unit: string, id: number }) => {
    const unt = unit === 'var' ? 'px' : unit
    const preUnit = getStrFromStr(values[id])
    const convertvalue = unitConverter(unt, val, preUnit)

    values[id] = convertvalue + unt

    onChangeHandler(getValueString(values))
  }

  const changeHandler = (val: ControllerType) => {
    if (val === 'All') values = [values[0]]
    else values = Array(4).fill(values[0])
    setController(val)
    onChangeHandler(getValueString(values, val))
  }

  return (
    <div className={`${css({ flx: 'justify-content', ai: 'flex-end' })} ${className}`}>
      {title && (
        <div className={`${css(s.titlecontainer)} ${lblCls}`}>
          <span className={css(s.title)}>{title}</span>
        </div>
      )}
      <div className={css(s.segmentcontainer, { ai: align === 'right' ? 'flex-end' : 'flex-start', w: 210 })}>
        <StyleSegmentControl
          defaultActive={controller}
          options={options}
          onChange={(lbl: ControllerType) => changeHandler(lbl)}
          show={['icn']}
          width={60}
          noShadow
          className="mb-2"
        />
        <div className={css(ut.mt2)}>
          <Grow open={controller === 'All'}>
            <div className={css({ flx: 1, jc: align === 'right' ? 'flex-end' : 'flex-start' , m:5})}>
              <SizeControl
                min={0}
                inputHandler={handleValues}
                sizeHandler={({ unitKey, unitValue, id }: SizeHandlerType) => handleValues({ value: unitValue, unit: unitKey, id })}
                id="0"
                label={allIcons.inputs?.all}
                value={values[0] && getNumFromStr(values[0])}
                unit={values[0] && getStrFromStr(values[0])}
                options={unitOption}
                width='110px'
              />
            </div>
          </Grow>
          <Grow open={controller === 'Individual'}>
            <div className={css({ display: 'grid', 'grid-template-columns': '1fr 1fr', 'grid-gap': '5px', m:5 })}>
              <SizeControl
                min={0}
                inputHandler={handleValues}
                sizeHandler={({ unitKey, unitValue, id }: SizeHandlerType) => handleValues({ value: unitValue, unit: unitKey, id })}
                id="0"
                label={allIcons.inputs?.top}
                width="100px"
                value={sizeValues(values[0])}
                unit={sizeUnits(values[0])}
                options={unitOption}
                className={css(ut.mr1, ut.mb1)}
              />
              <SizeControl
                min={0}
                inputHandler={handleValues}
                sizeHandler={({ unitKey, unitValue, id }: SizeHandlerType) => handleValues({ value: unitValue, unit: unitKey, id })}
                id="1"
                label={allIcons.inputs?.right}
                width="100px"
                value={sizeValues(values[1])}
                unit={sizeUnits(values[1])}
                options={unitOption}
                className={css(ut.mb1)}
              />
              <SizeControl
                min={0}
                inputHandler={handleValues}
                sizeHandler={({ unitKey, unitValue, id }: SizeHandlerType) => handleValues({ value: unitValue, unit: unitKey, id })}
                id="3"
                label={allIcons.inputs?.left}
                width="100px"
                value={sizeValues(values[3])}
                unit={sizeUnits(values[3])}
                options={unitOption}
                className={css(ut.mr1)}
              />
              <SizeControl
                min={0}
                inputHandler={handleValues}
                sizeHandler={({ unitKey, unitValue, id }: SizeHandlerType) => handleValues({ value: unitValue, unit: unitKey, id })}
                id="2"
                label={allIcons.inputs?.bottom}
                width="100px"
                value={sizeValues(values[2])}
                unit={sizeUnits(values[2])}
                options={unitOption}
              />
            </div>
          </Grow>
        </div>
      </div >
    </div >
  )
}

type BoxSizingUtilProps = {
  title?: string,
  className?: string,
  lblCls?: string,
  value: string,
  onChangeHandler: (val: string) => void,
  unitOption: string[],
  icons?: IconsType
  iconVariant?: IconVariantType
  align: 'left' | 'right'
}

type IconsType = {
  header: {
    all: JSX.Element | string,
    individual: JSX.Element | string
  },
  inputs: {
    all: JSX.Element | string,
    top: JSX.Element | string,
    bottom: JSX.Element | string,
    right: JSX.Element | string,
    left: JSX.Element | string,
  }
}

type ControllerType = 'All' | 'Individual'

type SizeHandlerType = {
  unitKey: string,
  unitValue: string,
  id: number,
}

type IconVariantType = 'default' | 'radius'

const s = {
  container: { flx: 'center-between' },
  segmentcontainer: {
    flx: 1,
    fd: 'column',
  },
  titlecontainer: { mr: 15 },
  title: { fs: 12, fw: 500 },
  blueTxt: { cr: 'var(--b-50)' },
}

const getIcons = (variant: IconVariantType, css: (val: object) => string) => {
  const iconVariants: { [key: string]: IconsType } = {
    'default': {
      header: {
        all: <BoxFullIcon stroke={1.7} size={14} />,
        individual: <BoxIcon stroke={1.7} size={15} />
      },
      inputs: {
        all: <BoxFullIcon size={14} />,
        top: <BoxIcon size="14" variant="top" className={css(s.blueTxt)} />,
        bottom: <BoxIcon size="14" variant="bottom" className={css(s.blueTxt)} />,
        right: <BoxIcon size="14" variant="right" className={css(s.blueTxt)} />,
        left: <BoxIcon size="14" variant="left" className={css(s.blueTxt)} />,
      }
    },
    'radius': {
      header: {
        all: <BoxFullIcon stroke={1.7} size={14} />,
        individual: <BorderFullIcn size={20} />
      },
      inputs: {
        all: <BoxFullIcon size={14} />,
        top: <BorderLeftTopIcn size={12} className={css({ tm: 'rotate(90deg)' })} />,
        bottom: <BorderLeftTopIcn size={12} className={css({ tm: 'rotate(270deg)' })} />,
        right: <BorderLeftTopIcn size={12} className={css({ tm: 'rotate(180deg)' })} />,
        left: <BorderLeftTopIcn size={12} className={css({ tm: 'rotate(0deg)' })} />,
      }
    }
  }

  return iconVariants[variant]
}
