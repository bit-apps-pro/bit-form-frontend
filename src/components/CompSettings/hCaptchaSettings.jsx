import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import TxtAlignCntrIcn from '../../Icons/TxtAlignCntrIcn'
import TxtAlignLeftIcn from '../../Icons/TxtAlignLeftIcn'
import TxtAlignRightIcn from '../../Icons/TxtAlignRightIcn'
import ut from '../../styles/2.utilities'
import style from '../../styles/FieldSettingTitle.style'
import FieldStyle from '../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import StyleSegmentControl from '../Utilities/StyleSegmentControl'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

export default function HCaptchaSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams()
  const [styles, setStyles] = useAtom($styles)
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { mode, theme, size } = fieldData.config
  const fldStyleObj = styles?.fields?.[fldKey]
  const { fieldType, classes } = fldStyleObj
  const wrpCLass = `.${fldKey}-fld-wrp`
  const { 'justify-content': alignment } = classes[wrpCLass] || ''

  function setConfigValue(propName, value) {
    fieldData.config[propName] = value
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${propName[0].toUpperCase() + propName.slice(1)} changed to ${value} : ${fieldData.adminLbl || fldKey}`, type: `${propName}_change`, state: { fields: allFields, fldKey } })
  }

  const flexDirectionHandle = (val, type) => {
    const newStyles = create(styles, drftStyle => {
      drftStyle.fields[fldKey].classes[wrpCLass].display = 'flex'
      drftStyle.fields[fldKey].classes[wrpCLass][type] = val
    })
    setStyles(newStyles)
    addToBuilderHistory({ event: `Position alignment to "${val}" : ${fieldData.adminLbl || fldKey}`, type: 'position_alignment_change', state: { styles: newStyles, fldKey } })
  }

  return (
    <>
      <FieldSettingTitle
        title="hCaptcha Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />

      <SizeAndPosition />

      <FieldSettingsDivider />

      <SimpleAccordion
        id="visibility-mode"
        title={__('Visibility Mode')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <select
            data-testid="visibility-select"
            className={css(FieldStyle.input)}
            aria-label="Visibility Mode for hCaptcha Field"
            placeholder="Select Mode here..."
            value={mode}
            onChange={e => setConfigValue('mode', e.target.value)}
          >
            <option value="visible">{__('Visible')}</option>
            <option value="invisible">{__('Invisible')}</option>
            <option value="passive">{__('Passive')}</option>
          </select>
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      <SimpleAccordion
        id="theme-setting"
        title={__('Theme')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <select
            data-testid="theme-select"
            className={css(FieldStyle.input)}
            aria-label="Theme for hCaptcha Field"
            placeholder="Select Theme here..."
            value={theme}
            onChange={e => setConfigValue('theme', e.target.value)}
          >
            <option value="dark">{__('Dark')}</option>
            <option value="light">{__('Light')}</option>
          </select>
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      <SimpleAccordion
        id="size-setting"
        title={__('Size')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <select
            data-testid="size-select"
            className={css(FieldStyle.input)}
            aria-label="Size for hCaptcha Field"
            placeholder="Select Size here..."
            value={size}
            onChange={e => setConfigValue('size', e.target.value)}
          >
            <option value="normal">{__('Normal')}</option>
            <option value="compact">{__('Compact')}</option>
          </select>
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      <div className={css(FieldStyle.fieldSection)}>
        <div className={css(ut.flxcb)}>
          <span className={css(style.label)}>Position Alignment</span>
          <StyleSegmentControl
            show={['icn']}
            tipPlace="bottom"
            className={css(style.segment)}
            options={[
              { icn: <TxtAlignLeftIcn size="17" />, label: 'left', tip: 'Left' },
              { icn: <TxtAlignCntrIcn size="17" />, label: 'center', tip: 'Center' },
              { icn: <TxtAlignRightIcn size="17" />, label: 'right', tip: 'Right' },
            ]}
            onChange={val => flexDirectionHandle(val, 'justify-content')}
            defaultActive={alignment}
          />
        </div>
      </div>
      <FieldSettingsDivider />
    </>
  )
}
