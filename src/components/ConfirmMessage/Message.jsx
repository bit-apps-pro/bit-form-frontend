/* eslint-disable no-param-reassign */
import { create } from 'mutative'
import { memo, useState } from 'react'
import { useFela } from 'react-fela'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { $confirmations, $fieldsArr, $proModal, $updateBtn } from '../../GlobalStates/GlobalStates'
import BoxFullIcon from '../../Icons/BoxFullIcon'
import BoxIcon from '../../Icons/BoxIcon'
import CloseIcn from '../../Icons/CloseIcn'
import EditIcn from '../../Icons/EditIcn'
import ut from '../../styles/2.utilities'
import app from '../../styles/app.style'
import { IS_PRO } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import proHelperData from '../../Utils/StaticData/proHelperData'
import Grow from '../CompSettings/StyleCustomize/ChildComp/Grow'
import SizeControl from '../CompSettings/StyleCustomize/ChildComp/SizeControl'
import { getNumFromStr, getStrFromStr, objectArrayToStyleStringGenarator, unitConverter } from '../style-new/styleHelpers'
import CheckBox from '../Utilities/CheckBox'
import ProBadge from '../Utilities/ProBadge'
import RenderHtml from '../Utilities/RenderHtml'
import SingleToggle from '../Utilities/SingleToggle'
import SliderModal from '../Utilities/SliderModal'
import StyleSegmentControl from '../Utilities/StyleSegmentControl'
import TinyMCE from '../Utilities/TinyMCE'
import ConfirmMsgPreview from './ConfirmMsgPreview'
import ProOverlay from './ProOverlay'

function Message({ id, msgItem }) {
  const { css } = useFela()

  const setUpdateBtn = useSetAtom($updateBtn)
  const setProModal = useSetAtom($proModal)
  const fieldsArr = useAtomValue($fieldsArr)
  const [allConf, setAllConf] = useAtom($confirmations)
  const [msgActive, setMsgActive] = useState(false)
  const [modal, setModal] = useState({ show: false })
  const [closeColorType, setCloseColorType] = useState('default')
  const [closeIconColorType, setCloseIconColorType] = useState('default')

  const [activePeperties, setActiveProperties] = useState('background')
  const [controller, setController] = useState('All')
  const { msgType, position, animation, autoHide, duration, styles } = msgItem?.config || {}
  const TEMP_CONF_ID = `_tmp_${id}_conf_id`

  const handleActiveProperties = ({ target: { name } }) => {
    setActiveProperties(name)
  }

  const handlePositionChange = ({ target: { value } }) => {
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.position = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleMsgType = ({ target: { value } }) => {
    if (!IS_PRO && value !== 'below') {
      setProModal({ show: true, ...proHelperData[`${value}_msg`] })
      return
    }
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.msgType = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleMsgAnimation = ({ target: { value } }) => {
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.animation = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleDelay = ({ target: { value } }) => {
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.duration = value > 0 ? value : 1
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleAutoHide = () => {
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.autoHide = !draft.type.successMsg[id].config.autoHide
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleColorTypeChange = ({ target: { name, value } }) => {
    if (!IS_PRO) return
    if (name === 'closeColorType') {
      setCloseColorType(value)
    } else if (name === 'closeIconColorType') {
      setCloseIconColorType(value)
    }
  }

  const handleConfirmationStyle = ({ target: { name, value } }) => {
    if (!IS_PRO) return
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.styles[name] = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleConfirmationShadow = ({ target: { name, value } }, index) => {
    if (!IS_PRO) return
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.styles.boxShadow[index][name] = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleShadowDelete = (e, index) => {
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.styles.boxShadow.splice(index, 1)
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleAddShadow = () => {
    if (!IS_PRO) return
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.styles.boxShadow.push({
        x: '0px',
        y: '27px',
        blur: '30px',
        spread: '',
        color: 'rgb(0 0 0 / 18%)',
        inset: '',
      })
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleMsg = (mg, idx) => {
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[idx].msg = mg
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  let values = styles?.padding?.trim().split(' ')
  const handleValues = ({ value: val, unit, id: index }) => {
    if (!IS_PRO) return
    values = styles?.padding?.trim().split(' ')
    const preUnit = getStrFromStr(values[index] || 'px')
    const convertvalue = unitConverter(unit, val, preUnit)

    values[index] = convertvalue + unit

    let v
    if (controller === 'All') {
      v = `${values[0]}`
    } else {
      v = `${values[0] || '0px'} ${values[1] || '0px'} ${values[2] || '0px'} ${values[3] || '0px'}`
    }
    setAllConf(prevConf => create(prevConf, draft => {
      draft.type.successMsg[id].config.styles.padding = v
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const unitOption = ['px', 'em', 'rem']

  const options = [
    { label: 'All', icn: <BoxFullIcon stroke="1.7" size={14} />, show: ['icn'], tip: 'All Side' },
    { label: 'Individual', icn: <BoxIcon stroke="1.7" size="15" />, show: ['icn'], tip: 'Individual Side' },
  ]

  const msgStyles = {
    msgContainer: {
      m: 'auto',
      w: styles?.width,
      h: 'auto',
    },
    msgBackground: {
      w: '100%',
      h: '100%',
      flx: 'center',
      bd: 'rgba(0, 0, 0, 0.0)',
    },
    msgContent: {
      bd: styles?.background,
      cr: styles?.color,
      p: styles?.padding,
      b: `${styles?.borderWidth} ${styles?.borderType} ${styles?.borderColor}`,
      brs: styles?.borderRadius,
      w: '100%',
      m: 'auto',
      pn: 'relative',
      wb: 'break-all',
      bs: objectArrayToStyleStringGenarator(styles?.boxShadow || []),
    },
    close: {
      cr: styles?.closeIconColor,
      bd: styles?.closeBackground,
      pn: 'absolute',
      rt: '7px',
      ...msgType === 'modal' && { tp: '7px' },
      ...msgType === 'snackbar' && { tp: '50%', tm: 'translateY(-50%)' },
      h: '25px',
      w: '25px',
      b: 'none',
      brs: '50%',
      p: 0,
      dy: 'grid',
      g: 'center',
      cur: 'pointer',
      ':hover': {
        cr: styles?.closeIconHover,
        bd: styles?.closeHover,
      },
      ':focus': {
        cr: styles?.closeIconHover,
        cur: 'pointer',
      },
    },
    closeIcon: {
      w: '15px',
      h: '15px',
      // 'stroke-width': 2,
    },
  }

  return (
    <>
      <div className={css({ p: 10, flx: '1', fd: 'column' })}>
        <div className={css({ flx: 1, fd: 'column', rg: 5 })}>
          <div>
            <div className={css({ flx: 'align-center', cg: 5 })}>
              <span className={css({ w: 130, fw: 500 })}>{__('Message Styles')}</span>
              <select
                className={css(uiStyles.selectInput)}
                name="animation"
                value={allConf.type.successMsg[id]?.config?.animation}
                onChange={handleMsgAnimation}
              >
                <option value="custom-style">Custom Style</option>
              </select>
              <button
                type="button"
                className={css(uiStyles.input, { curp: 1 })}
                title="Edit styles"
                onClick={() => setModal({ show: true })}
              >
                <span><EditIcn size="20" /></span>
              </button>
            </div>
          </div>
          <div>
            <span className={css({ w: 130, fw: 500 })}>{__('Message Type')}</span>
            <CheckBox
              radio
              name={`msg-type-${id}`}
              onChange={handleMsgType}
              checked={msgType === 'below'}
              title={<small className="txt-dp"><b>Below of Form</b></small>}
              value="below"
            />
            <CheckBox
              radio
              name={`msg-type-${id}`}
              onChange={handleMsgType}
              checked={msgType === 'snackbar'}
              title={(
                <small className="txt-dp">
                  <b>
                    Snackbar
                    {!IS_PRO && <ProBadge />}
                  </b>
                </small>
              )}
              value="snackbar"
            />
            <CheckBox
              radio
              name={`msg-type-${id}`}
              onChange={handleMsgType}
              checked={msgType === 'modal'}
              title={(
                <small className="txt-dp">
                  <b>
                    Modal
                    {!IS_PRO && <ProBadge />}
                  </b>
                </small>
              )}
              value="modal"
            />
          </div>
          <div className={css({ flx: 1, cg: 5 })}>
            <div className={css({ flx: 'align-center' })}>
              <span className={css({ fs: 16, w: 80, fw: 500 })}>Animation</span>
              <select
                className={css(uiStyles.selectInput)}
                name="animation"
                value={animation}
                onChange={handleMsgAnimation}
              >
                {
                  animations[msgItem.config?.msgType]?.map((value, indx) => <option key={`opt-key${indx + 2}`} value={(value === 'Please Select') ? '' : value}>{value.replace(/-/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())}</option>)
                }
              </select>
            </div>
            {((msgType === 'snackbar' || ['slide-up', 'slide-down'].includes(animation)) && msgType !== 'below') && (
              <div className={css({ flx: 'align-center' })}>
                <span className={css({ fs: 16, w: 65, fw: 500 })}>Position</span>
                <select
                  className={css(uiStyles.selectInput)}
                  name="position"
                  value={position}
                  onChange={handlePositionChange}
                >
                  {
                    (positions[msgType][animation] || positions[msgType])?.map(value => <option key={value} value={(value === 'Please Select') ? '' : value}>{value.replace(/-/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())}</option>)
                  }
                </select>
              </div>
            )}
            <div className={css({ flx: 'align-center' })}>
              <span className={css({ fs: 16, w: 80, fw: 500, ml: 10 })}>Auto Hide</span>
              <SingleToggle
                name={`auto-hide-check-${id}`}
                action={handleAutoHide}
                isChecked={allConf.type.successMsg[id]?.config?.autoHide}
                className="flx"
              />
            </div>
            {allConf.type.successMsg[id]?.config?.autoHide && (
              <div className={css({ flx: 'align-center' })}>
                <span className={css({ fs: 16, w: 70, fw: 500, ml: 10 })}>Duration</span>
                <input
                  placeholder="Duration"
                  className={css(uiStyles.input, { w: 50 })}
                  type="number"
                  value={duration}
                  onChange={handleDelay}
                  aria-label="Confirmation auto hide aftere duration"
                />
                <small>Sec</small>
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              className={css(app.btn, app.blueGrd, { mt: 0 })}
              onClick={() => setMsgActive(!msgActive)}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <SliderModal
        title="Confirmation Style"
        show={modal.show}
        setModal={setModal}
        className={css({ h: '500px !important', w: '550px !important' })}
      >
        <div className={`layout-wrapper confirmation-style ${css({ w: '100%' })}`}>
          <div className={`style-preview ${css({ h: '250px', p: '40px 20px', ow: 'auto', bd: '#E8E8E8' })}`}>
            <div className={`${css(msgStyles.msgContainer)}`}>
              <div className={`${css(msgStyles.msgBackground)}`}>
                <div className={`${css(msgStyles.msgContent)}`}>
                  <button
                    className={`${css(msgStyles.close)}`}
                    type="button"
                  >
                    <svg className={`${css(msgStyles.closeIcon)}`} viewBox="0 0 30 30">
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        x1="4"
                        y1="3.88"
                        x2="26"
                        y2="26.12"
                      />
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        x1="26"
                        y1="3.88"
                        x2="4"
                        y2="26.12"
                      />
                    </svg>
                  </button>
                  <div><RenderHtml html={msgItem?.msg} /></div>
                </div>
              </div>
            </div>
          </div>
          <div className={css({ h: '210px', bd: 'white', bt: '1px solid #abaaaa' })}>
            <div className={css({ p: '10px 20px' })}>
              <button
                type="button"
                name="background"
                className={`${css(uiStyles.styleButton)} ${activePeperties === 'background' && 'active'}`}
                onClick={handleActiveProperties}
              >
                Background
              </button>
              <button
                type="button"
                name="border"
                className={`${css(uiStyles.styleButton)} ${activePeperties === 'border' && 'active'}`}
                onClick={handleActiveProperties}
              >
                Border
              </button>
              <button
                type="button"
                name="shadow"
                className={`${css(uiStyles.styleButton)} ${activePeperties === 'shadow' && 'active'}`}
                onClick={handleActiveProperties}
              >
                Shadow
              </button>
              <button
                type="button"
                name="width"
                className={`${css(uiStyles.styleButton)} ${activePeperties === 'width' && 'active'}`}
                onClick={handleActiveProperties}
              >
                Width
              </button>
              <button
                type="button"
                name="padding"
                className={`${css(uiStyles.styleButton)} ${activePeperties === 'padding' && 'active'}`}
                onClick={handleActiveProperties}
              >
                Padding
              </button>
            </div>
            <div className={`properties-container ${css({ pn: 'relative' })}`}>
              {activePeperties === 'background' && (
                <>
                  <ProOverlay />
                  <div className={css({ dy: 'flex', fd: 'column', p: '0px 20px', rg: 5 })}>
                    <div className={css({ flx: 'align-center', cg: 5 })}>
                      <span
                        className={css(uiStyles.label, uiStyles.backgrounLabel)}
                      >
                        Message Background Color
                      </span>
                      <input
                        type="color"
                        name="background"
                        className={css({ ml: 88 }, uiStyles.input, uiStyles.colorInput)}
                        value={styles?.background}
                        onChange={handleConfirmationStyle}
                      />
                      <input
                        type="text"
                        name="background"
                        className={css({ w: 165 }, uiStyles.input)}
                        value={styles?.background}
                        onChange={handleConfirmationStyle}
                      />
                    </div>
                    <div className={css({ flx: 'align-center', cg: 5 })}>
                      <span
                        className={css(uiStyles.label, uiStyles.backgrounLabel)}
                      >
                        Message Text Color
                      </span>
                      <input
                        type="color"
                        name="color"
                        className={css({ ml: 88 }, uiStyles.input, uiStyles.colorInput)}
                        value={styles?.color}
                        onChange={handleConfirmationStyle}
                      />
                      <input
                        type="text"
                        name="color"
                        className={css({ w: 165 }, uiStyles.input)}
                        value={styles?.color}
                        onChange={handleConfirmationStyle}
                      />
                    </div>
                    <div className={css({ flx: 'align-center', cg: 5 })}>
                      <span
                        className={css(uiStyles.label, uiStyles.backgrounLabel)}
                      >
                        Close Button Background Color
                      </span>
                      <select
                        name="closeColorType"
                        className={css({ w: 80 }, uiStyles.selectInput)}
                        value={closeColorType}
                        onChange={handleColorTypeChange}
                      >
                        <option value="default">Default</option>
                        <option value="hover">Hover</option>
                      </select>
                      <input
                        type="color"
                        name={closeColorType === 'default' ? 'closeBackground' : 'closeHover'}
                        className={css(uiStyles.input, uiStyles.colorInput)}
                        value={closeColorType === 'default' ? styles?.closeBackground : styles?.closeHover}
                        onChange={handleConfirmationStyle}
                      />
                      <input
                        type="text"
                        name={closeColorType === 'default' ? 'closeBackground' : 'closeHover'}
                        className={css({ w: 165 }, uiStyles.input)}
                        value={closeColorType === 'default' ? styles?.closeBackground : styles?.closeHover}
                        onChange={handleConfirmationStyle}
                      />
                    </div>
                    <div className={css({ flx: 'align-center', cg: 5 })}>
                      <span
                        className={css(uiStyles.label, uiStyles.backgrounLabel)}
                      >
                        {__('Close Icon Color')}
                      </span>
                      <select
                        name="closeIconColorType"
                        className={css({ w: 80 }, uiStyles.selectInput)}
                        value={closeIconColorType}
                        onChange={handleColorTypeChange}
                      >
                        <option value="default">Default</option>
                        <option value="hover">Hover</option>
                      </select>
                      <input
                        type="color"
                        name={closeIconColorType === 'default' ? 'closeIconColor' : 'closeIconHover'}
                        className={css(uiStyles.input, uiStyles.colorInput)}
                        value={closeIconColorType === 'default' ? styles?.closeIconColor : styles?.closeIconHover}
                        onChange={handleConfirmationStyle}
                      />
                      <input
                        type="text"
                        name={closeIconColorType === 'default' ? 'closeIconColor' : 'closeIconHover'}
                        className={css({ w: 165 }, uiStyles.input)}
                        value={closeIconColorType === 'default' ? styles?.closeIconColor : styles?.closeIconHover}
                        onChange={handleConfirmationStyle}
                      />
                    </div>
                  </div>
                </>
              )}

              {activePeperties === 'border' && (
                <>
                  <ProOverlay />
                  <div className={css({ dy: 'flex', fd: 'column', p: '0px 20px' })}>
                    <div className={css({ flx: 'align-center' })}>
                      <span className={css(uiStyles.valueLabel, { ml: 102 })}>Color</span>
                      <span className={css(uiStyles.valueLabel, { ml: 124 })}>Thickness</span>
                      <span className={css(uiStyles.valueLabel, { ml: 30 })}>Type</span>
                    </div>
                    <div className={css({ flx: 'align-center', mb: 5, cg: 5 })}>
                      <span className={css({ w: 55 }, uiStyles.label)}>Border</span>
                      <input
                        type="color"
                        name="borderColor"
                        className={css(uiStyles.input, uiStyles.colorInput)}
                        value={styles?.borderColor}
                        onChange={handleConfirmationStyle}
                      />
                      <input
                        type="text"
                        name="borderColor"
                        className={css({ w: 150 }, uiStyles.input)}
                        value={styles?.borderColor}
                        onChange={handleConfirmationStyle}
                      />
                      <input
                        type="text"
                        name="borderWidth"
                        className={css({ w: 80 }, uiStyles.input)}
                        value={styles?.borderWidth}
                        onChange={handleConfirmationStyle}
                      />
                      <select
                        name="borderType"
                        className={css({ w: 80 }, uiStyles.selectInput)}
                        value={styles?.borderType}
                        onChange={handleConfirmationStyle}
                      >
                        <option value="none">None</option>
                        <option value="hidden">Hidden</option>
                        <option value="dotten">Dotted</option>
                        <option value="dashed">Dashed</option>
                        <option value="solid">Solid</option>
                        <option value="double">Double</option>
                        <option value="groove">Groove</option>
                        <option value="ridge">Ridge</option>
                        <option value="inset">Inset</option>
                        <option value="outset">Outset</option>
                        <option value="initial">Inital</option>
                        <option value="inherit">Inherit</option>
                      </select>
                    </div>
                    <div className={css({ flx: 'align-center', cg: 5 })}>
                      <span className={css({ w: 55 }, uiStyles.label)}>Radius</span>
                      <input
                        type="text"
                        name="borderRadius"
                        className={css({ w: 80 }, uiStyles.input)}
                        value={styles?.borderRadius}
                        onChange={handleConfirmationStyle}
                      />
                    </div>
                  </div>
                </>
              )}
              {activePeperties === 'shadow' && (
                <>
                  <ProOverlay />
                  <div className={css({ dy: 'flex', fd: 'column', p: '0px 20px' })}>
                    <div className={css({ flx: 'align-center', cg: 5 })}>
                      <span className={css(uiStyles.valueLabel, { ml: 48 })}>Color</span>
                      <span className={css(uiStyles.valueLabel, { ml: 92 })}>X</span>
                      <span className={css(uiStyles.valueLabel, { ml: 45 })}>Y</span>
                      <span className={css(uiStyles.valueLabel, { ml: 42 })}>Blur</span>
                      <span className={css(uiStyles.valueLabel, { ml: 25 })}>Spread</span>
                      <span className={css(uiStyles.valueLabel, { ml: 12 })}>Inset</span>
                    </div>
                    <div className={css({ flx: 'space-between' })}>
                      <div className={css({ h: 110, ow: 'auto', px: 5, pt: 2, w: '100%' })}>
                        {styles?.boxShadow?.map((shadow, index) => (
                          <div key={`inp-${index + 9}`} className={css({ flx: 'align-center', mb: 5, cg: 5 })}>
                            <input
                              type="color"
                              name="color"
                              className={css(uiStyles.input, uiStyles.colorInput)}
                              value={shadow.color}
                              onChange={(e) => handleConfirmationShadow(e, index)}
                            />
                            <input
                              type="text"
                              name="color"
                              className={css({ w: 120 }, uiStyles.input)}
                              value={shadow.color}
                              onChange={(e) => handleConfirmationShadow(e, index)}
                            />
                            <input
                              type="text"
                              name="x"
                              className={css({ w: 50 }, uiStyles.input)}
                              value={shadow.x}
                              onChange={(e) => handleConfirmationShadow(e, index)}
                            />
                            <input
                              type="text"
                              name="y"
                              className={css({ w: 50 }, uiStyles.input)}
                              value={shadow.y}
                              onChange={(e) => handleConfirmationShadow(e, index)}
                            />
                            <input
                              type="text"
                              name="blur"
                              className={css({ w: 50 }, uiStyles.input)}
                              value={shadow.blur}
                              onChange={(e) => handleConfirmationShadow(e, index)}
                            />
                            <input
                              type="text"
                              name="spread"
                              className={css({ w: 50 }, uiStyles.input)}
                              value={shadow.spread}
                              onChange={(e) => handleConfirmationShadow(e, index)}
                            />

                            <select
                              name="inset"
                              className={css({ w: 72 }, uiStyles.selectInput)}
                              value={shadow.inset}
                              onChange={(e) => handleConfirmationShadow(e, index)}
                            >
                              <option value="">Outset</option>
                              <option value="inset">Inset</option>
                            </select>
                            <span
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => handleShadowDelete(e, index)}
                              onClick={(e) => handleShadowDelete(e, index)}
                            >
                              <CloseIcn size="12" className={css({ curp: 1 })} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={css({ flx: 'center', pt: 5 })}>
                      <span
                        className={css({ curp: 1 })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={handleAddShadow}
                        onClick={handleAddShadow}
                      >
                        <CloseIcn size="12" className={css({ curp: 1, tm: 'rotate(45deg)' })} />
                      </span>
                    </div>
                  </div>
                </>
              )}
              {activePeperties === 'width' && (
                <>
                  <ProOverlay />
                  <div className={css({ dy: 'flex', fd: 'column', p: '0px 20px' })}>
                    <div className={css({ flx: 'align-center', cg: 5 })}>
                      <span className={css(uiStyles.label, { w: 55 })}>Width</span>
                      <input
                        type="text"
                        name="width"
                        className={css({ w: '100px' }, uiStyles.input)}
                        value={styles?.width}
                        onChange={handleConfirmationStyle}
                      />
                    </div>
                  </div>
                </>
              )}
              {activePeperties === 'padding'
                && (
                  <>
                    <ProOverlay />
                    <div className={css(uiStyles.segmentWrapper)}>
                      <div className={css(uiStyles.titlecontainer)}>
                        <span className={css(uiStyles.title)}>Padding</span>
                        <StyleSegmentControl
                          square
                          defaultActive="All"
                          options={options}
                          values={60}
                          component="button"
                          onChange={lbl => setController(lbl)}
                          show={['icn']}
                          variant="lightgray"
                          noShadow
                        />
                      </div>
                      <div className={css(uiStyles.segmentcontainer)}>
                        <Grow open={controller === 'All'}>
                          <div className={css({ p: 2 })}>
                            <SizeControl
                              min="0"
                              inputHandler={handleValues}
                              sizeHandler={({ unitKey, unitValue, indexId }) => handleValues({ value: unitValue, unit: unitKey, indexId })}
                              id="0"
                              label={<BoxFullIcon size={14} />}
                              value={getNumFromStr(values[0]) || 0}
                              unit={getStrFromStr(values[0]) || 'px'}
                              options={unitOption}
                              width="110px"
                            />
                          </div>
                        </Grow>
                        <Grow open={controller === 'Individual'}>
                          <div className={css(ut.flxc, { flxp: 'wrap', jc: 'end', p: 2 })}>
                            <SizeControl
                              min="0"
                              inputHandler={handleValues}
                              sizeHandler={({ unitKey, unitValue, indexId }) => handleValues({ value: unitValue, unit: unitKey, indexId })}
                              id="0"
                              label={<BoxIcon size="14" variant="top" />}
                              width="100px"
                              value={getNumFromStr(values[0]) || 0}
                              unit={getStrFromStr(values[0]) || 'px'}
                              options={unitOption}
                              className={css(ut.mr1, ut.mb1)}
                            />
                            <SizeControl
                              min="0"
                              inputHandler={handleValues}
                              sizeHandler={({ unitKey, unitValue, indexId }) => handleValues({ value: unitValue, unit: unitKey, indexId })}
                              id="1"
                              label={<BoxIcon size="14" variant="right" />}
                              width="100px"
                              value={getNumFromStr(values[1]) || 0}
                              unit={getStrFromStr(values[1]) || 'px'}
                              options={unitOption}
                              className={css(ut.mr1, ut.mb1)}
                            />
                            <SizeControl
                              min="0"
                              inputHandler={handleValues}
                              sizeHandler={({ unitKey, unitValue, indexId }) => handleValues({ value: unitValue, unit: unitKey, indexId })}
                              id="2"
                              label={<BoxIcon size="14" variant="bottom" />}
                              width="100px"
                              value={getNumFromStr(values[2]) || 0}
                              unit={getStrFromStr(values[2]) || 'px'}
                              options={unitOption}
                              className={css(ut.mr1, ut.mb1)}
                            />
                            <SizeControl
                              min="0"
                              inputHandler={handleValues}
                              sizeHandler={({ unitKey, unitValue, indexId }) => handleValues({ value: unitValue, unit: unitKey, indexId })}
                              id="3"
                              label={<BoxIcon size="14" variant="left" />}
                              width="100px"
                              value={getNumFromStr(values[3]) || 0}
                              unit={getStrFromStr(values[3]) || 'px'}
                              options={unitOption}
                              className={css(ut.mr1, ut.mb1)}
                            />
                          </div>
                        </Grow>
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </SliderModal>
      <ConfirmMsgPreview
        index={id}
        msgId={msgItem.id || TEMP_CONF_ID}
        active={msgActive}
        setActive={setMsgActive}
        msgType={msgType || 'snackbar'}
        position={position || 'top-center'}
        animation={animation || 'fade'}
        autoHide={autoHide || false}
        duration={duration || 1}
        message={msgItem?.msg}
        confirmationStyles={styles || ''}
      />
      <TinyMCE
        id={`conf-${id}`}
        formFields={fieldsArr}
        value={msgItem?.msg}
        onChangeHandler={val => handleMsg(val, id)}
      />
    </>
  )
}

export default memo(Message)

const positions = {
  snackbar: [
    'Please Select',
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'],
  modal: {
    'slide-up': [
      'Please Select',
      'center-center',
      'bottom-center'],
    'slide-down': [
      'Please Select',
      'top-center',
      'center-center'],
  },
}
const animations = {
  snackbar: [
    'Please Select',
    'fade',
    'scale',
    'slide-up',
    'slide-down',
    'slide-left',
    'slide-right'],
  modal: [
    'Please Select',
    'fade',
    'scale',
    'slide-up',
    'slide-down'],
  below: [
    'Please Select',
    'fade',
    'scale'],
}

const uiStyles = {

  styleButton: {
    oe: 'none',
    p: '10px 10px',
    fs: '14px',
    fw: '600',
    b: 'none',
    bd: 'none',
    brs: 8,
    w: 'auto',
    h: 33,
    flxi: 'center',
    mr: 2,
    zx: 1,
    ow: 'hidden',
    curp: 1,
    pn: 'relative',
    cr: 'var(--b-54-12)',
    ':disabled': { oy: 0.4, cur: 'not-allowed' },
    ':focus:not(:focus-visible)': { bs: 'none' },
    ':hover:is(:not(:disabled),:not(.active))': { cr: 'var(--b-53-13)' },
    ':focus-visible': { bs: '0 0 0 2px var(--b-50) inset' },
    '&.active': {
      bd: 'var(--b-79-96)',
      cr: 'var(--b-50)',
    },
    '::before': {
      ct: '""',
      zx: -1,
      pn: 'absolute',
      size: 0,
      // tp: '50%',
      // lt: '50%',
      // brs: 8,
      // tm: 'translate(-50%,-50%)',
      tn: '400ms border, opacity 300ms',
      oy: 0,
      b: '0px solid var(--white-0-81-32)',
    },
    ':hover::before': { b: '60px solid var(--white-0-81-32)', oy: 1 },
    ':disabled::before': { dy: 'none' },
  },
  input: {
    h: '30px !important',
    fs: '12px !important',
    fw: 600,
    bd: '#f0f0f1 !important',
    brs: '8px !important',
    b: 'none !important',
    ':hover': { bd: 'var(--b-50-95) !important', cr: 'var(--b-50) !important' },
    ':focus': { bs: '0 0 0 2px var(--b-50) !important' },
  },
  selectInput: {
    h: '30px !important',
    fs: '12px !important',
    fw: 600,
    bc: '#f0f0f1 !important',
    brs: '8px !important',
    b: 'none !important',
    cr: 'var(--dp-blue) !important',
    ':hover': { cr: 'var(--b-50) !important' },
    ':focus': { bs: '0 0 0 2px var(--b-50) !important' },
  },
  colorInput: {
    w: 30,
    p: 0,
    brs: '8px !important',
    '-webkit-appearance': 'none',
    '::-webkit-color-swatch-wrapper': { p: 0 },
    '::-webkit-color-swatch': {
      b: '1px solid #afafaf',
      brs: '8px !important',
    },
    '::-moz-color-swatch': {
      b: '1px solid #afafaf',
      brs: '8px !important',
    },
    '::-moz-focus-inner': {
      b: '1px solid #afafaf',
      brs: '8px !important',
    },
  },
  segmentcontainer: {
    flx: 'align-center',
    jc: 'flex-end',
    flxp: 'wrap',
    mt: 10,
    w: 220,
  },
  segmentWrapper: {
    w: 255,
    p: '0px 20px',
  },
  titlecontainer: { flx: 'center-between' },
  title: { fs: 12, fw: 500 },
  label: {
    fs: '12px',
    fw: '500',
  },
  backgrounLabel: { w: 195 },
  valueLabel: { fs: '12px' },
}
