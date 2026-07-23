/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import TrashIcn from '../../Icons/TrashIcn'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import SimpleAccordion from '../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import SizeControl from '../CompSettings/StyleCustomize/ChildComp/SizeControl'
import CssPropertyList from './CssPropertyList'
import {
  getNumFromStr, getObjByKey, getStrFromStr, getValueByObjPath, getValueFromStateVar, setStyleStateObj, unitConverter,
} from './styleHelpers'

export default function FilterControlMenu({ title = 'Filters', objectPaths, id }) {
  const { css } = useFela()
  const { fieldKey, element } = useParams()
  const [styles, setStyles] = useAtom($styles)
  const [themeColors, setThemeColors] = useAtom($themeColors)
  const { object, paths } = objectPaths

  const getStateObj = () => getObjByKey(object, { styles, themeColors })

  const getDfltFilterObject = (filterName) => {
    let filterObject = {}
    switch (filterName) {
      case 'brightness':
      case 'grayscale':
      case 'contrast':
      case 'invert':
      case 'sepia':
        filterObject = {
          value: `${filterName}(100%)`,
          units: ['', '%'],
          minValue: 0,
          maxValue: 100,
        }
        break
      case 'blur':
        filterObject = {
          value: `${filterName}(2px)`,
          units: ['', 'px', 'em', 'rem'],
          minValue: 0.1,
          maxValue: 10,
        }
        break
      case 'drop-shadow':
        filterObject = {
          value: `${filterName}(8px 8px 10px #878787)`,
          units: ['px'],
          minValue: -200,
          maxValue: 200,
        }
        break
      case 'hue-rotate':
        filterObject = {
          value: `${filterName}(90deg)`,
          units: ['deg'],
          minValue: -360,
          maxValue: 360,
        }
        break
      case 'saturate':
      case 'opacity':
        filterObject = {
          value: `${filterName}(30%)`,
          units: ['', '%'],
          minValue: 0,
          maxValue: 100,
        }
        break
      default:
        filterObject = {
          value: 'none',
          units: [''],
          minValue: 0,
          maxValue: 0,
        }
    }
    return filterObject
  }

  let filterValues
  let checkImportant = false

  if (object === 'themeColors') {
    filterValues = themeColors[paths.filter]
  } else {
    const fltrVal = getValueByObjPath(styles, paths?.filter)
    filterValues = getValueFromStateVar(themeColors, fltrVal)
  }

  const checkNStoreImportant = (fltVal) => {
    if (fltVal?.match(/(!important)/gi)) {
      fltVal = fltVal?.replace(/(!important)/gi, '')
      checkImportant = true
      return fltVal
    }
    return fltVal
  }
  filterValues = checkNStoreImportant(filterValues)

  const checkNAddImportant = (fv) => {
    if (checkImportant) {
      if (!fv?.match(/(!important)/gi)) {
        return `${fv}!important`
      }
      return fv
    }
    return fv
  }
  filterValues = filterValues?.replace('none', '')
  const filterNames = filterValues?.trim() ? filterValues?.trim()?.split(/\B\s+(?![^(]*\))/gi) : []

  const filtersObjects = filterNames?.map(filter => {
    const name = filter?.slice(0, filter?.indexOf('('))
    let value = filter?.slice(filter.indexOf('(') + 1, filter.indexOf(')'))?.trim()
    const unit = getStrFromStr(value) || ''
    if (value.indexOf(' ') < 0) value = getNumFromStr(value)
    const filterObject = getDfltFilterObject(name)
    let titl = name.replace('-', ' ')
    titl = titl.replace(titl.slice(0, 1), titl.slice(0, 1).toUpperCase())
    return {
      title: titl,
      name,
      value,
      unit,
      options: filterObject.units,
      min: filterObject.minValue,
      max: filterObject.maxValue,
    }
  })

  const existFilterNames = filtersObjects.map(filter => filter.name)

  const setFilterValue = (filterName, { value, unit }, indexNo) => {
    let filterValue = getValueByObjPath(getStateObj(), paths.filter)
    filterValue = checkNStoreImportant(filterValues)
    const startPos = filterValue.indexOf(filterName)
    const endPos = filterValue.indexOf(')', startPos) + 1
    if (!unit) unit = ''

    if (filterName === 'drop-shadow') {
      const values = filterValue.slice(filterValue.indexOf('(', startPos) + 1, endPos - 1).split(/\s(?![^(]*\))/gi)
      values[indexNo] = `${value}${unit}`
      filterValue = filterValue.replace(filterValue.slice(startPos, endPos), `${filterName}(${values.join(' ')})`)
    } else filterValue = filterValue.replace(filterValue.slice(startPos, endPos), `${filterName}(${value}${unit})`)

    filterValue = checkNAddImportant(filterValue)
    setStyleStateObj(object, paths.filter, filterValue?.trim(), { setThemeColors, setStyles })
    addToBuilderHistory(generateHistoryData(element, fieldKey, paths.filter, filterValue?.trim(), { [object]: getLatestState(object) }))
  }

  const unitHandler = (filterName, currentUnit, value, indexNo, preUnit) => {
    let filterValue = getValueByObjPath(getStateObj(), paths.filter)
    filterValue = checkNStoreImportant(filterValues)
    const startPos = filterValue.indexOf(filterName)
    const endPos = filterValue.indexOf(')', startPos) + 1
    if (!currentUnit) currentUnit = ''

    if (filterName === 'drop-shadow') {
      const values = filterValue.slice(filterValue.indexOf('(', startPos) + 1, endPos - 1).split(/\s(?![^(]*\))/gi)
      const convertValue = unitConverter(currentUnit, value, preUnit)
      values[indexNo] = `${convertValue}${currentUnit}`
      filterValue = filterValue.replace(filterValue.slice(startPos, endPos), `${filterName}(${values.join(' ')})`)
    } else {
      const convertValue = unitConverter(currentUnit, value, preUnit)
      filterValue = filterValue.replace(filterValue.slice(startPos, endPos), `${filterName}(${convertValue}${currentUnit})`)
    }

    filterValue = checkNAddImportant(filterValue)
    setStyleStateObj(object, paths.filter, filterValue.trim(), { setThemeColors, setStyles })
    addToBuilderHistory(generateHistoryData(element, fieldKey, paths.filter, filterValue?.trim(), { [object]: getLatestState(object) }))
  }

  const handleClearProperties = filterName => {
    let value = getValueByObjPath(getStateObj(), paths.filter)
    value = checkNStoreImportant(value)
    const startPos = value.indexOf(filterName)
    const endPos = value.indexOf(')', startPos) + 1
    value = value.replace(value.slice(startPos, endPos), '').trim()
    value = checkNAddImportant(value)

    setStyleStateObj(object, paths.filter, value, { setThemeColors, setStyles })
    addToBuilderHistory(generateHistoryData(element, fieldKey, paths.filter, value, { [object]: getLatestState(object) }))
  }

  const addFilterToCss = (filterName) => {
    const filterValue = getDfltFilterObject(filterName).value
    let prevValue = getValueByObjPath(getStateObj(), paths.filter)
    prevValue = getValueFromStateVar(getStateObj(), prevValue)

    prevValue = checkNStoreImportant(prevValue)
    let fltVal
    if (filterValue === 'none') {
      fltVal = `${filterValue}`
    } else {
      fltVal = `${prevValue?.replace('none', '')} ${filterValue}`.trim()
    }
    fltVal = checkNAddImportant(fltVal)
    setStyleStateObj(object, paths.filter, fltVal, { setThemeColors, setStyles })
    addToBuilderHistory(generateHistoryData(element, fieldKey, paths.filter, fltVal, { [object]: getLatestState(object) }))
  }

  const filterProperties = {
    blur: {},
    brightness: {},
    contrast: {},
    'drop-shadow': {},
    grayscale: {},
    'hue-rotate': {},
    invert: {},
    opacity: {},
    saturate: {},
    sepia: {},
    none: {},
  }

  const availableFilterProps = Object.keys(filterProperties)
    .filter(filterName => !existFilterNames?.includes(filterName))

  return (
    <>
      <div className={css(ut.flxcb, ut.mb2)}>
        <span className={css(ut.fs12, ut.fs12, ut.fw500)}>{title}</span>
        <CssPropertyList id="fltr-prop" properties={availableFilterProps} setProperty={addFilterToCss} classNames={css({ mt: '0px !important' })} />
      </div>
      {filtersObjects.map(filter => {
        if (filter.name === 'drop-shadow') {
          const valueArr = filter.value.split(/\s(?![^(]*\))/gi)
          return (
            <div key={filter.name}>
              <SimpleAccordion
                key={filter.name}
                className={css(c.accordionHead, c.containerHover)}
                open
                titleCls={css({ fw: 500 })}
                icnStrok={1}
                title="Drop Shadow"
                actionComponent={(
                  <button
                    title="Clear Value"
                    onClick={() => handleClearProperties(filter.name)}
                    className={`${css(ut.stylePropDeleteBtn, { rt: -14 })} delete-btn`}
                    type="button"
                    aria-label="Clear Filter"
                    data-testid={`${id}-clear-filter`}
                  >
                    <TrashIcn />
                  </button>
                )}
              >
                <div className={css(ut.p1)}>
                  <div className={css(ut.flxcb, ut.mb2, ut.mt2)}>
                    <span className={css(ut.fs12, ut.fw500)}>X</span>
                    <SizeControl
                      width="120px"
                      value={Number(getNumFromStr(valueArr[0]) || 0)}
                      unit={getStrFromStr(valueArr[0]) || 'px'}
                      inputHandler={valObj => setFilterValue('drop-shadow', valObj, 0)}
                      sizeHandler={({ unitKey, unitValue }) => unitHandler('drop-shadow', unitKey, unitValue, 0, getStrFromStr(valueArr[0]))}
                      options={['px', 'mm', 'em', 'rem']}
                      min="-100"
                      max="100"
                      dataTestId={`${id}-drop-shadow-x`}
                    />
                  </div>
                  <div className={css(ut.flxcb, ut.mb2, ut.mt2)}>
                    <span className={css(ut.fs12, ut.fw500)}>Y</span>
                    <SizeControl
                      width="120px"
                      value={Number(getNumFromStr(valueArr[1]) || 0)}
                      unit={getStrFromStr(valueArr[1]) || 'px'}
                      inputHandler={valObj => setFilterValue('drop-shadow', valObj, 1)}
                      sizeHandler={({ unitKey, unitValue }) => unitHandler('drop-shadow', unitKey, unitValue, 1, getStrFromStr(valueArr[1]))}
                      options={['px', 'mm', 'em', 'rem']}
                      min="-100"
                      max="100"
                      dataTestId={`${id}-drop-shadow-y`}
                    />
                  </div>
                  <div className={css(ut.flxcb, ut.mb2, ut.mt2)}>
                    <span className={css(ut.fs12, ut.fw500)}>Blur</span>
                    <SizeControl
                      width="120px"
                      value={Number(getNumFromStr(valueArr[2]) || 0)}
                      unit={getStrFromStr(valueArr[2]) || 'px'}
                      inputHandler={valObj => setFilterValue('drop-shadow', valObj, 2)}
                      sizeHandler={({ unitKey, unitValue }) => unitHandler('drop-shadow', unitKey, unitValue, 2, getStrFromStr(valueArr[2]))}
                      options={['px', 'mm', 'em', 'rem']}
                      min="0"
                      max="100"
                      dataTestId={`${id}-drop-shadow-blur`}
                    />
                  </div>
                  <div className={css(ut.flxcb, ut.mb2)}>
                    <span className={css(ut.fs12, ut.fw500)}>Color</span>
                    <input
                      aria-label="Filter image"
                      width="120px"
                      type="color"
                      className={css(c.input, c.colorInput)}
                      onChange={e => setFilterValue('drop-shadow', { value: e.target.value }, 3)}
                      value={valueArr[3]}
                      data-testid={`${id}-drop-shadow-color`}
                    />
                  </div>
                </div>
              </SimpleAccordion>
              <div className={css(c.divider)} />
            </div>
          )
        }

        return (
          <div className={css(ut.flxcb, ut.mb2, ut.mt2, c.containerHover)}>
            <span className={css(ut.fs12, ut.fw500, { w: 85 })}>{filter.title}</span>
            <div className={css(ut.flxcb)}>
              <SizeControl
                className={css({ mr: 15 })}
                width="120px"
                value={Number(filter.value)}
                unit={filter.unit}
                inputHandler={valObj => setFilterValue(filter.name, valObj)}
                sizeHandler={({ unitKey, unitValue }) => unitHandler(filter.name, unitKey, unitValue, '', filter.unit)}
                options={filter.options}
                min={filter.min}
                max={filter.max}
                dataTestId={`${id}-${filter.name}`}
              />
              <button
                title="Clear Value"
                onClick={() => handleClearProperties(filter.name)}
                className={`${css(ut.stylePropDeleteBtn)} delete-btn`}
                type="button"
                aria-label="Clear Filter"
                data-testid={`${id}-clear-filter`}
              >
                <TrashIcn />
              </button>
            </div>
          </div>
        )
      })}
    </>
  )
}

const c = {
  accordionHead: {
    w: 220,
    p: 3,
    fw: 500,
    brs: 8,
    fs: 12,
  },
  divider: { bb: '1px solid var(--white-0-83)', mx: 3, my: 3 },
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
  input: {
    h: '30px !important',
    fs: '12px !important',
    fw: 600,
    bd: '#f0f0f1 !important',
    brs: '10px !important',
    b: 'none !important',
    ':focus': { bs: '0 0 0 2px var(--b-50) !important' },
  },
  colorInput: {
    w: 120,
    p: 0,
    brs: '8px !important',
    '-webkit-appearance': 'none',
    '::-webkit-color-swatch-wrapper': { p: 0 },
    '::-webkit-color-swatch': {
      b: '1px solid #afafaf',
      brs: '10px !important',
    },
    '::-moz-color-swatch': {
      b: '1px solid #afafaf',
      brs: '10px !important',
    },
    '::-moz-focus-inner': {
      b: '1px solid #afafaf',
      brs: '10px !important',
    },
  },
  containerHover: {
    pn: 'relative',
    '&:hover .delete-btn': { tm: 'scale(1)' },
  },
}
