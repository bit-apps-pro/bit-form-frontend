import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import SingleToggle from '../../../../Utilities/SingleToggle'

export default function CurrencyValueFormatSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const {
    formatter,
    numberFormat,
    decimalSeparator,
    minimumFractionDigits,
    maximumFractionDigits,
    symbolPosition,
    currencyPosition,
    roundToClosestInteger,
    roundToClosestFractionDigits,
    showCurrencySymbol,
  } = fieldData.valueFormatOptions

  const handleConfigChange = (val: string | boolean, name: string) => {
    fieldData.valueFormatOptions[name] = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `${propNameLabel[name]} '${String(val || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`,
      type: `${name}_changed`,
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="val-frmt-opt-stng"
      title={__('Value Format Options')}
      className={css(FieldStyle.fieldSection)}
      isPro
      proProperty="valueFormatOptions"
    >
      <div className={css(FieldStyle.placeholder)}>
        {/* Formatter Selection */}
        <div className={css(FieldStyle.labelInput)}>
          <span className={css(ut.m0, FieldStyle.title)}>{__('Formatter:')}</span>
          <select
            data-testid="frmtr-slct"
            className={css(FieldStyle.input, ut.wdt100)}
            aria-label="Formatter"
            value={formatter || 'none'}
            onChange={e => handleConfigChange(e.target.value, 'formatter')}
          >
            <option value="none">{__('None')}</option>
            <option value="browser">{__('Browser')}</option>
            <option value="custom">{__('Custom')}</option>
          </select>
        </div>

        {/* Currency Symbol Toggle */}
        <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
          <SingleToggle
            id="val-crncy-symbl"
            tip="By disabling this option, the currency symbol will be show"
            title={__('Currency Symbol:')}
            action={e => handleConfigChange(e.target.checked, 'showCurrencySymbol')}
            isChecked={showCurrencySymbol || false}
          />
        </div>

        {/* Round to Closest Integer */}
        <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
          <SingleToggle
            id="val-rnd-to-clsst-int"
            tip="By disabling this option, the currency symbol will be show"
            title={__('Round to Closest Integer:')}
            action={e => handleConfigChange(e.target.checked, 'roundToClosestInteger')}
            isChecked={roundToClosestInteger || false}
          />
        </div>

        {/* Custom Formatter Options */}
        {formatter === 'custom' && (
          <>
            {/* Round to Closest Fraction Digits */}
            <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, { pr: '10px', m: 0 })}>
              <SingleToggle
                id="val-rnd-to-clsst-frc-dgt"
                tip="By Enabling this option, the Fraction Will Rounded"
                title={__('Round to Closest Fraction Digits:')}
                action={e => handleConfigChange(e.target.checked, 'roundToClosestFractionDigits')}
                isChecked={roundToClosestFractionDigits || false}
              />
            </div>

            {/* Minimum Fraction Digits */}
            <div className={css(FieldStyle.labelInput)}>
              <span className={css(ut.m0, FieldStyle.title)}>{__('Minimum Fraction Digit:')}</span>
              <input
                data-testid="val-mnmm-frctn-dgt"
                title="Minimum Fraction Digit"
                aria-label="Minimum Fraction Digit"
                placeholder="Minimum Fraction Digit"
                className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                type="number"
                value={minimumFractionDigits || ''}
                onChange={e => handleConfigChange(e.target.value, 'minimumFractionDigits')}
              />
            </div>

            {/* Maximum Fraction Digits */}
            <div className={css(FieldStyle.labelInput)}>
              <span className={css(ut.m0, FieldStyle.title)}>{__('Maximum Fraction Digit:')}</span>
              <input
                data-testid="val-mxmm-frctn-dgt"
                title="Maximum Fraction Digit"
                aria-label="Maximum Fraction Digit"
                placeholder="Maximum Fraction Digit"
                className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                type="number"
                value={maximumFractionDigits || ''}
                onChange={e => handleConfigChange(e.target.value, 'maximumFractionDigits')}
              />
            </div>

            {/* Decimal Separator */}
            <div className={css(FieldStyle.labelInput)}>
              <span className={css(ut.m0, FieldStyle.title)}>{__('Decimal Separator:')}</span>
              <input
                data-testid="val-dcml-sprtr"
                title="Decimal Separator"
                aria-label="Decimal Separator"
                placeholder="Decimal Separator"
                className={css(FieldStyle.input, FieldStyle.w60, ut.mt1)}
                type="text"
                value={decimalSeparator || ''}
                onChange={e => handleConfigChange(e.target.value, 'decimalSeparator')}
              />
            </div>

            {/* Number Format */}
            <div className={css(FieldStyle.labelInput)}>
              <span className={css(ut.m0, FieldStyle.title)}>{__('Number Format:')}</span>
              <input
                data-testid="val-nmbr-frmt-inp"
                title="Number Format"
                aria-label="Value Number Format"
                placeholder="Ex: ###,###,###"
                className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                type="text"
                value={numberFormat || ''}
                onChange={e => handleConfigChange(e.target.value, 'numberFormat')}
              />
            </div>
          </>
        )}

        {/* Position Settings (for custom or none formatter) */}
        {(formatter === 'custom' || formatter === 'none') && (
          <>
            {/* Currency Position */}
            <div className={css(FieldStyle.labelInput)}>
              <span className={css(ut.m0, FieldStyle.title)}>{__('Currency Position:')}</span>
              <select
                data-testid="val-crncy-pstn"
                className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                aria-label="Currency Position"
                value={currencyPosition || 'right'}
                onChange={e => handleConfigChange(e.target.value, 'currencyPosition')}
              >
                <option value="right">{__('Right')}</option>
                <option value="left">{__('Left')}</option>
              </select>
            </div>

            {/* Symbol Position */}
            <div className={css(FieldStyle.labelInput)}>
              <span className={css(ut.m0, FieldStyle.title)}>{__('Symbol Position:')}</span>
              <select
                data-testid="val-smbl-pstn"
                className={css(FieldStyle.input, ut.mt1, { w: 120 })}
                aria-label="Symbol Position"
                value={symbolPosition || 'left-number'}
                onChange={e => handleConfigChange(e.target.value, 'symbolPosition')}
              >
                <option value="left-number">{__('Left Number')}</option>
                <option value="right-number">{__('Right Number')}</option>
                <option value="left-currency">{__('Left Currency')}</option>
                <option value="right-currency">{__('Right Currency')}</option>
              </select>
            </div>
          </>
        )}
      </div>
    </SimpleAccordion>
  )
}

const propNameLabel: Record<string, string> = {
  formatter: 'Value Formatter Changed to',
  showCurrencySymbol: 'Value Show Currency Symbol',
  roundToClosestInteger: 'Value Round to closest integer',
  roundToClosestFractionDigits: 'Value Round to closest Fraction Digit',
  minimumFractionDigits: 'Value Minimum Fraction Digits',
  maximumFractionDigits: 'Value Maximum Fraction Digits',
  decimalSeparator: 'Value Decimal Separator',
  numberFormat: 'Value Number Format',
  currencyPosition: 'Value Currency Position',
  symbolPosition: 'Value Symbol Position',
}