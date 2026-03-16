import { arrayMoveImmutable } from 'array-move'
import { useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { $bits, $fields, $selectedFieldId } from '../../../GlobalStates/GlobalStates'
import CloseEyeIcn from '../../../Icons/CloseEyeIcn'
import CloseIcn from '../../../Icons/CloseIcn'
import CopyIcn from '../../../Icons/CopyIcn'
import EditIcn from '../../../Icons/EditIcn'
import EyeIcon from '../../../Icons/EyeIcon'
import EyeOffIcon from '../../../Icons/EyeOffIcon'
import NoneIcn from '../../../Icons/NoneIcn'
import PlusIcn from '../../../Icons/PlusIcn'
import TrashIcn from '../../../Icons/TrashIcn'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import ut from '../../../styles/2.utilities'
import Btn from '../../Utilities/Btn'
import CheckBox from '../../Utilities/CheckBox'
import Modal from '../../Utilities/Modal'
import { DragHandle, SortableItem, SortableList } from '../../Utilities/Sortable'
import Tip from '../../Utilities/Tip'
import TipGroup from '../../Utilities/Tip/TipGroup'
import IconsModal from '../IconsModal'
import { flattenOptions, newOptKey } from './editOptionsHelper'

const SortableElm = ({
  value, optIndx, type, option, setOption, lblKey, valKey, imgKey, setScrolIndex, isRating, optKey, checkByDefault, showUpload = false, hideNDisabledOptions,
}) => {
  const { css } = useFela()
  const [optionMdl, setOptionMdl] = useState(false)
  const bits = useAtomValue($bits)
  const fields = useAtomValue($fields)
  const selectedFieldId = useAtomValue($selectedFieldId)
  const isSingleSelect = fields[selectedFieldId]?.inpType === 'radio'

  const isGroupStart = 'type' in value && value.type.includes('group') && value.type.includes('start')
  const isGroupEnd = 'type' in value && value.type.includes('group') && value.type.includes('end')

  const isGroupChild = () => {
    if (isGroupStart || isGroupEnd) return false
    for (let i = optIndx - 1; i >= 0; i -= 1) {
      const opt = option[i]
      if ('type' in opt && opt.type.includes('end')) {
        return false
      }

      if ('type' in opt && opt.type.includes('start')) {
        return true
      }
    }

    return false
  }

  const addOption = () => {
    const { img } = option[0]
    const newOption = create(option, draft => {
      const id = newOptKey(optKey)
      // eslint-disable-next-line no-param-reassign
      const newTempOption = isRating ? { id, [lblKey]: `Option ${id}`, [valKey]: id, [imgKey]: img } : { id, [lblKey]: `Option ${id}` }
      draft.splice(optIndx + 1, 0, newTempOption)
    })

    setOption(newOption)
    setScrolIndex(optIndx + 1)
  }

  const setOpt = (e, ind, typ) => {
    const newOption = create(option, draft => {
      // eslint-disable-next-line no-param-reassign
      draft[ind][typ] = e.target.value
    })

    setOption(newOption)
    setScrolIndex(optIndx)
  }
  const setOptStatus = (ind, typ) => {
    const newOption = create(option, draft => {
      // eslint-disable-next-line no-param-reassign
      if (option[ind][typ]) {
        delete draft[ind][typ]
        return
      }
      draft[ind][typ] = true
    })

    setOption(newOption)
    setScrolIndex(optIndx)
  }

  const setGroupTitle = e => {
    const newOption = create(option, draft => {
      // eslint-disable-next-line no-param-reassign
      draft[optIndx].groupLbl = e.target.value
    })

    setOption(newOption)
    setScrolIndex(optIndx)
  }

  const rmvOption = (ind) => {
    if (isGroupStart) return rmvGroup()
    const tmpOption = [...option]
    tmpOption.splice(ind, 1)
    setOption(tmpOption)
    setScrolIndex(optIndx - 1)
  }

  const rmvGroup = () => {
    const tmpOption = [...option]
    let toBeRemovedOptions = 0
    for (let i = optIndx; i < tmpOption.length; i += 1) {
      if ('type' in tmpOption[i] && tmpOption[i].type.includes('end')) {
        toBeRemovedOptions += 1
        break
      }
      toBeRemovedOptions += 1
    }

    tmpOption.splice(optIndx, toBeRemovedOptions)
    setOption(tmpOption)
    setScrolIndex(optIndx - 1)
  }

  const cloneOption = () => {
    if (isGroupStart) return cloneGroup()

    const tmpOption = [...option]
    const clonedOpt = { [lblKey]: `Copy of ${value[lblKey]}`, [valKey]: value[valKey] ? `Copy of ${value[valKey]}` : '', id: newOptKey(optKey) }
    tmpOption.splice(optIndx + 1, 0, clonedOpt)
    setOption(tmpOption)
    setScrolIndex(optIndx + 1)
  }

  const cloneGroup = () => {
    const tmpOption = [...option]
    const toBeClonedOptions = [{ ...tmpOption[optIndx], id: newOptKey(optKey), groupLbl: `Copy of ${tmpOption[optIndx].groupLbl}` }]
    for (let i = optIndx + 1; i < tmpOption.length; i += 1) {
      if ('type' in tmpOption[i] && tmpOption[i].type.includes('end')) {
        toBeClonedOptions.push({ ...tmpOption[i], id: newOptKey(optKey) })
        break
      }
      const clonedOpt = { id: newOptKey(optKey), [lblKey]: `Copy of ${tmpOption[i][lblKey]}`, [valKey]: tmpOption[i][valKey] ? `Copy of ${value[valKey]}` : '' }
      toBeClonedOptions.push(clonedOpt)
    }

    tmpOption.splice(optIndx + toBeClonedOptions.length, 0, ...toBeClonedOptions)
    setOption(tmpOption)
    setScrolIndex(optIndx + toBeClonedOptions.length * 2 - 1)
  }

  function setReq(e, i) {
    const tmpOption = deepCopy([...option])
    if (e.target.checked) {
      tmpOption[i].req = true
    } else {
      delete tmpOption[i].req
    }
    setOption(tmpOption)
    setScrolIndex(optIndx)
  }
  function setDisabled(e, i) {
    const tmpOption = deepCopy([...option])
    if (e.target.checked) {
      tmpOption[i].disabled = true
    } else {
      delete tmpOption[i].disabled
    }
    setOption(tmpOption)
    setScrolIndex(optIndx)
  }

  function setCheck(e, i) {
    const tmp = deepCopy([...option])
    if (type === 'radio' || type === 'rating' || isSingleSelect) {
      const alreadyChecked = tmp.find(opt => opt.check)
      if (alreadyChecked) delete alreadyChecked.check
    }
    if (e.target.checked) {
      tmp[i].check = true
    } else {
      delete tmp[i].check
    }
    setOption(tmp)
    setScrolIndex(optIndx)
  }

  return (
    <div
      data-testid={`sortable-itm-wrp-${optIndx}`}
      className={css(optionStyle.container, (option[optIndx]?.disabled || option[optIndx]?.hide) && optionStyle.disabled, isGroupStart ? optionStyle.groupStart : '', isGroupChild() ? optionStyle.groupChild : '', isGroupEnd ? optionStyle.groupend : '')}
    >
      {!isGroupEnd && (
        <div className={css(optionStyle.inputContainer)}>
          <div className="flx">
            <DragHandle className={css(optionStyle.drag)} />
          </div>
          {isGroupStart && (
            <div>
              <span className={css(ut.flxc, ut.ml2, ut.mr2, optionStyle.groupTitle)}>
                Group Title
              </span>
              <input
                type="text"
                className={css(optionStyle.groupTitleInput)}
                onChange={setGroupTitle}
                value={value.groupLbl}
              />
            </div>
          )}
          {isGroupEnd && (
            <span className={css(ut.flxc, ut.ml2)} style={{ height: 40 }}>
              {`Group ${value.type.split('-')[1]} End`}
            </span>
          )}

          {!('type' in value) && (
            <>
              {showUpload && (
                <div className={css(ut.flxc, ut.ml2)}>
                  <img
                    className={css(optionStyle.img)}
                    src={value?.img || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>"}
                    alt={value?.img}
                  />
                  <button
                    className={css(ut.m10, optionStyle.imgAddBtn)}
                    type="button"
                    onClick={() => setOptionMdl(true)}
                  >
                    <EditIcn size="20" />
                  </button>
                </div>
              )}
              <input
                type="text"
                value={value[lblKey]}
                onChange={e => setOpt(e, optIndx, lblKey)}
                width={140}
                className={css(optionStyle.input)}
              />
              <input
                type="text"
                value={value[valKey]}
                onChange={e => setOpt(e, optIndx, valKey)}
                placeholder={value[lblKey]}
                width={140}
                className={css(optionStyle.input)}
              />
            </>
          )}

          <div className={css(ut.flxc)}>
            <TipGroup interactive={false}>
              {!isGroupStart && checkByDefault && (
                <Tip msg="Check by Default">
                  <CheckBox
                    className={css({ se: 35, mx: 7.5 })}
                    checked={value.check !== undefined}
                    onChange={(e) => setCheck(e, optIndx)}
                  />
                </Tip>
              )}
              {(type === 'check' || type === 'image-select') && (
                <Tip msg="Required">
                  <CheckBox
                    checked={value.req !== undefined}
                    className={css({ se: 35, mx: 7.5 })}
                    onChange={(e) => setReq(e, optIndx)}
                  />
                </Tip>
              )}
              {(type === 'check' || type === 'radio' || type === 'image-select') && !(type === 'rating') && (
                <Tip msg="Disabled">
                  <CheckBox
                    checked={value.disabled !== undefined}
                    className={css({ se: 35, mx: 7.5 })}
                    onChange={(e) => setDisabled(e, optIndx)}
                  />
                </Tip>
              )}
            </TipGroup>
          </div>
          <div className={`${css(optionStyle.action)} acc ${isGroupStart && 'group-acc'} ${value.req && 'active'}`}>
            <div className={`${css(ut.dyn)} btnIcn`}>
              {!hideNDisabledOptions && (
                <TipGroup interactive={false}>
                  <Tip whiteSpaceNowrap className={css({ dy: 'inline-block' })} msg={`Add Option ${isGroupStart ? 'in Group' : ''}`}>
                    <button
                      data-testid={`srtble-itm-add-optn-grp-${optIndx}`}
                      type="button"
                      onClick={() => addOption(optIndx)}
                      className={css(optionStyle.btn, ut.flxc)}
                    >
                      <span className={css(optionStyle.addbtnside)}>
                        <CloseIcn size="12" stroke="4" />
                      </span>
                    </button>
                  </Tip>
                  <Tip msg={`Clone ${isGroupStart ? 'Group' : 'Option'}`}>
                    <button
                      data-testid={`srtble-itm-add-optn-cln-grp-${optIndx}`}
                      type="button"
                      onClick={() => cloneOption()}
                      className={css(optionStyle.btn)}
                    >
                      <CopyIcn size="18" stroke="2.5" />
                    </button>
                  </Tip>
                  <Tip msg={`Delete ${isGroupStart ? 'Group' : 'Option'}`}>
                    <button
                      data-testid={`srtble-itm-add-optn-dlt-grp-${optIndx}`}
                      type="button"
                      onClick={() => rmvOption(optIndx)}
                      className={css(optionStyle.btn)}
                    >
                      <TrashIcn size="18" stroke="2" />
                    </button>
                  </Tip>
                </TipGroup>
              )}
              {hideNDisabledOptions && (
                <TipGroup interactive={false}>
                  <Tip whiteSpaceNowrap className={css({ dy: 'inline-block' })} msg={`Option ${option[optIndx]?.hide ? 'Hide' : 'Show'}`}>
                    <button
                      data-testid={`srtble-itm-add-optn-grp-${optIndx}`}
                      type="button"
                      onClick={() => setOptStatus(optIndx, 'hide')}
                      className={css(optionStyle.btn, ut.flxc)}
                    >
                      {option[optIndx]?.hide ? <EyeOffIcon size="18" /> : <EyeIcon size="18" />}
                    </button>
                  </Tip>
                  <Tip msg={`Field ${option[optIndx]?.disabled ? 'Enabled' : 'Disabled'}`}>
                    <button
                      data-testid={`srtble-itm-add-optn-dlt-grp-${optIndx}`}
                      type="button"
                      onClick={() => setOptStatus(optIndx, 'disabled')}
                      className={css(optionStyle.btn)}
                    >
                      {option[optIndx]?.disabled ? <CloseEyeIcn size="20" /> : <NoneIcn size="15" />}
                    </button>
                  </Tip>
                </TipGroup>
              )}
            </div>
          </div>
        </div>
      )}
      <Modal
        md
        autoHeight
        show={optionMdl}
        setModal={() => setOptionMdl(false)}
        className="o-v "
        title={__('Icons')}
      >
        <IconsModal
          setModal={setOptionMdl}
          setOption={setOption}
          option={option}
          optIndx={optIndx}
          unsplash
        />
      </Modal>
    </div>

  )
}

export default function VisualOptionsTab({
  optKey, options, option, setOption, type, isRating, lblKey, valKey, imgKey, checkByDefault, hasGroup, showUpload, hideNDisabledOptions,
}) {
  const { css } = useFela()
  const [scrolIndex, setScrolIndex] = useState(0)
  useEffect(() => { setOption(flattenOptions(options, optKey)) }, [options])

  const bits = useAtomValue($bits)
  const addOption = () => {
    const { img } = option[0] || {}
    const tmpOption = [...option]
    const id = newOptKey(optKey)
    const newTempOption = (isRating || type === 'image-select') ? { id, [lblKey]: `Option ${id}`, [valKey]: id, [imgKey]: img } : { id, [lblKey]: `Option ${id}` }
    const newIndex = tmpOption.push(newTempOption)
    setScrolIndex(newIndex - 1)
    setOption(tmpOption)
  }

  const addGroup = () => {
    const tmpOption = [...option]
    const totalGroup = tmpOption.filter(opt => opt?.type?.includes?.('start')) || []
    const id = newOptKey(optKey)
    const newIndex = tmpOption.push(
      { id: newOptKey(optKey), groupLbl: `Group ${totalGroup.length + 1}`, type: `group-${totalGroup.length + 1}-start` },
      { id, [lblKey]: `Option ${id}` },
      { id: newOptKey(optKey), type: `group-${totalGroup.length + 1}-end` },
    )
    setOption(tmpOption)
    setScrolIndex(newIndex - 1)
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const sortingItem = option[oldIndex]

    const newOptions = arrayMoveImmutable(option, oldIndex, newIndex)

    if ('type' in sortingItem) {
      const [, groupIndex, groupStatus] = sortingItem.type.split('-')

      if (groupStatus === 'end') {
        let startFound = 0
        for (let i = newIndex - 1; i >= 0; i -= 1) {
          if ('type' in newOptions[i] && newOptions[i].type.includes('start')) {
            if (newOptions[i].type === `group-${groupIndex}-start`) {
              startFound = 1
              break
            }
            if (newOptions[i].type !== `group-${groupIndex}-start`) return
          }
        }
        if (!startFound) return
      } else if (groupStatus === 'start') {
        let endFound = 0
        for (let i = newIndex + 1; i < newOptions.length; i += 1) {
          if ('type' in newOptions[i] && newOptions[i].type.includes('end')) {
            if (newOptions[i].type === `group-${groupIndex}-end`) {
              endFound = 1
              break
            }
            if (newOptions[i].type !== `group-${groupIndex}-end`) return
          }
        }
        if (!endFound) return
      }
    }

    setOption((items) => arrayMoveImmutable(items, oldIndex, newIndex))
    setScrolIndex(newIndex)
  }

  const generateItemSize = () => option.reduce((allItemSize, item) => {
    if ('type' in item && item.type.includes('start')) allItemSize.push(57)
    else if ('type' in item && item.type.includes('end')) allItemSize.push(25)
    else if (!('type' in item)) allItemSize.push(40)
    return allItemSize
  }, [])

  return (
    <>
      <SortableList onSortEnd={onSortEnd} useDragHandle>
        <div className={css(optionStyle.labelWapper)}>
          {(type === 'image-select' || type === 'rating') && <span className={css(optionStyle.imageLabel)}>Image</span>}
          <span className={css(optionStyle.propLabel)}>Label</span>
          <span className={css(optionStyle.propLabel, { ml: 10 })}>Value</span>
          <div className={css({ flxi: 'align-center', ml: 5 })}>
            {checkByDefault && <span className={css(optionStyle.checkLabel)}>Check</span>}
            {(type === 'check' || type === 'image-select') && <span className={css(optionStyle.checkLabel)}>Require</span>}
            {(type === 'check' || type === 'image-select' || type === 'radio') && <span className={css(optionStyle.checkLabel)}>Disable</span>}
          </div>
        </div>
        <div className={css(optionStyle.scroll)}>
          {option.map((_, index) => (
            <SortableItem
              key={`sortable-${option[index].id}`}
              index={index}
            >
              <SortableElm
                optIndx={index}
                value={option[index]}
                type={type}
                option={option}
                setOption={setOption}
                lblKey={lblKey}
                valKey={valKey}
                setScrolIndex={setScrolIndex}
                optKey={optKey}
                checkByDefault={checkByDefault}
                showUpload={showUpload}
                hideNDisabledOptions={hideNDisabledOptions}
                imgKey={imgKey}
                isRating={isRating}
              />
            </SortableItem>
          ))}
        </div>
      </SortableList>
      <div className={`flx ${css({ ml: 11, mt: 7 })}`}>
        <Btn
          size="sm"
          dataTestId="add-mor-opt-btn"
          id="add-more"
          className={css(optionStyle.add_btn)}
          onClick={() => addOption()}
          gap="3px"
        >
          {__('Add More')}
          <PlusIcn size="18" stroke="2" />
        </Btn>
        {hasGroup && (
          <Btn
            size="sm"
            dataTestId="add-mor-grp-btn"
            id="add-grp"
            className={css(optionStyle.add_btn)}
            onClick={addGroup}
            gap="3px"
          >
            {__('Add Group')}
            <PlusIcn size="18" stroke="2" />
          </Btn>
        )}
      </div>
    </>
  )
}

const optionStyle = {
  labelWapper: { p: '5px 30px 0px', fs: 14, fw: 500 },
  propLabel: { dy: 'inline-block', ta: 'center', w: 200 },
  imageLabel: { dy: 'inline-block', ta: 'center', w: 50, mr: 30 },
  checkLabel: { dy: 'inline-block', ta: 'center', w: 50, ow: 'hidden', to: 'ellipsis' },
  disabled: { bd: 'hsla(0, 11%, 93%, 100%)' },
  list: { width: '100%', height: 300 },
  container: {
    flx: '',
    ':hover .acc': { flx: 'align-center' },
    ':hover .acc > div': { flx: 'align-center' },
    ':hover .acc.group-acc': { flx: '', ai: 'flex-end', pb: 0 },
  },
  groupStart: { pt: 7, pb: 5, bc: 'var(--white-0-93)' },
  groupChild: { pl: 25, bc: 'var(--white-0-93)' },
  groupend: { h: 20, bc: 'var(--white-0-93)' },
  groupTitle: { fs: 10 },
  inputContainer: {
    flx: '',
    mnw: 560,
  },
  img: {
    w: 25,
    h: 17,
    brs: 3,
    bd: 'hsla(0, 0%, 0%, 5%)',
    b: '1px solid rgba(0, 0, 0, 0.05)',
  },

  imgAddBtn: {
    se: 25,
    flx: 'center',
    b: 'none',
    p: 3,
    mr: 1,
    tn: '.2s all',
    curp: 1,
    brs: '50%',
    bd: 'none',
    ':hover': { bd: 'var(--b-20-93)', cr: 'var(--blue)' },
  },

  groupTitleInput: {
    bc: 'transparent !important',
    b: '0px !important',
    oe: 0,
    mt: 5,

    ':hover': { bc: 'var(--white-0-0-12) !important' },
    ':focus': { b: '1px solid #ddd', bc: 'var(--white-0-0-12) !important', bs: 'none !important' },
  },

  input: {
    p: 5,
    m: 5,
    b: '1px solid rgb(215 215 215)',
    brs: '8px !important',
    fs: 12,
    w: 200,
    oe: 'none',
    ':focus': {
      bcr: 'var(--blue)',
      bs: '0 0 0 1px var(--blue)',
    },
  },
  label: { w: 175, dy: 'inline-block' },

  btn: {
    flx: 'center',
    brs: 7,
    curp: 1,
    b: 'none',
    p: 0,
    bd: 'none',
    ml: 5,
    se: 35,
    ':hover': {
      bd: 'var(--b-97)',
      cr: 'var(--blue)',
    },
  },
  addbtnside: { dy: 'inline-block', tm: 'rotate(45deg)' },
  add_btn: { ml: 19, p: 5 },
  drag: {
    cr: 'var(--white-0-13)',
    dy: 'inline-block',
    w: 25,
    h: 25,
    p: 5,
    cur: 'move',

    ':hover': { cr: 'var(--white-0-0-12)' },
  },
  List: { b: '1px solid #d9dddd' },
  ListItemOdd: { flx: 'jc' },

  ListItemEven: { bc: '#f8f8f0' },
  action: {
    pn: 'relative',
    flx: 'center',
    '&.active': { flx: 'align-center' },
    '&:hover': {
      flx: 'align-center',
      '& .btnIcn': { flx: 'center' },
    },
  },
  actionWrp: {
    flx: 'center',
    // bd: 'red',
  },
  scroll: {
    mxh: 300,
    owy: 'scroll',
  },
}
