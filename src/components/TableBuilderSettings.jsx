/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $breakpoint, $builderSettings } from '../GlobalStates/GlobalStates'
import { $staticStylesState } from '../GlobalStates/StaticStylesState'
import { deleteNestedObj } from '../Utils/FormBuilderHelper'
import { IS_PRO } from '../Utils/Helpers'
import ut from '../styles/2.utilities'
import PremiumSettingsOverlay from './CompSettings/StyleCustomize/ChildComp/PremiumSettingsOverlay'
import SizeControl from './CompSettings/StyleCustomize/ChildComp/SizeControl'
import Cooltip from './Utilities/Cooltip'
import Input from './Utilities/Input'
import ProBadge from './Utilities/ProBadge'
import Select from './Utilities/Select'
import SingleToggle from './Utilities/SingleToggle'
import { assignNestedObj, getNumFromStr, getStrFromStr, unitConverter } from './style-new/styleHelpers'

export default function TableBuilderSettings() {
  const { css } = useFela()
  const { formID } = useParams()
  const [staticStylesState, setStaticStyleState] = useAtom($staticStylesState)
  const breakpoints = useAtomValue($breakpoint)
  const [brkpnt, setBrkpnt] = useState(breakpoints)
  const [{ atomicClassPrefix, darkModeConfig, addImportantRuleToStyles }, setBuilderSettings] = useAtom($builderSettings)
  let darkModePrefereceInitialValue = 'disabled'
  if (darkModeConfig?.preferSystemColorScheme) darkModePrefereceInitialValue = 'system-preference'
  if (darkModeConfig?.darkModeSelector) darkModePrefereceInitialValue = 'selector'
  if (darkModeConfig?.darkModeSelector && darkModeConfig?.preferSystemColorScheme) darkModePrefereceInitialValue = 'selector-and-system-preference'

  const [darkModePreference, setDarkModePreference] = useState(darkModePrefereceInitialValue)
  const formWidth = staticStylesState.styleMergeWithAtomicClasses[`${brkpnt}LightStyles`]?.form?.[`._frm-bg-b${formID}`]?.width

  const handleDarkModePreference = (value) => {
    setDarkModePreference(value)
    if (value.match(/system-preference|selector-and-system-preference/g)) {
      setBuilderSettings(prv => ({
        ...prv,
        darkModeConfig: {
          ...prv.darkModeConfig,
          preferSystemColorScheme: true,
          darkModeSelector: value === 'system-preference'
            ? ''
            : prv.darkModeConfig.darkModeSelector,
        },
      }))
      return
    }
    setBuilderSettings(prv => ({
      ...prv,
      darkModeConfig: {
        ...prv.darkModeConfig,
        preferSystemColorScheme: false,
        darkModeSelector: value === 'disabled'
          ? ''
          : prv.darkModeConfig.darkModeSelector,
      },
    }))
  }

  const handleClassPrefix = (value) => {
    setBuilderSettings(prv => ({ ...prv, atomicClassPrefix: value }))
  }

  const handleImportantStyles = e => {
    setBuilderSettings(prv => ({ ...prv, addImportantRuleToStyles: e.target.checked }))
  }

  const handleDarkModeSelector = (value) => {
    setBuilderSettings(prv => ({
      ...prv,
      darkModeConfig: {
        ...prv.darkModeConfig,
        darkModeSelector: value,
      },
    }))
  }

  const handleFormWidth = ({ value: val, unit }) => {
    const preUnit = getStrFromStr(formWidth)
    const convertValue = unitConverter(unit, val, preUnit)
    setStaticStyleState(preStyle => create(preStyle, draft => {
      const path = `styleMergeWithAtomicClasses->${brkpnt}LightStyles->form->._frm-bg-b${formID}->width`
      const value = convertValue + unit
      if (val === '') {
        deleteNestedObj(draft, path)
      } else {
        assignNestedObj(draft, path, value)
      }
    }))
  }

  return (
    <div className={css(ut.mt2, ut.p1)}>
      <div className={css({ flx: 'align-center', gap: '10px' })}>
        <SettingsBlock title="Form width" isPro proProperty="formWidth">
          <div className="pos-rel">
            {!IS_PRO && <PremiumSettingsOverlay hideText proProperty="formWidth" />}
            <SizeControl
              className={css(style.select)}
              width={250}
              max={1000}
              inputHandler={handleFormWidth}
              sizeHandler={({ unitKey, unitValue }) => handleFormWidth({ value: unitValue, unit: unitKey })}
              value={(formWidth && getNumFromStr(formWidth)) || ''}
              unit={(formWidth && getStrFromStr(formWidth)) || 'px'}
              sliderWidth="40%"
              actualValue="auto"
            />
          </div>

          <Select
            color="primary"
            value={brkpnt || 'lg'}
            onChange={(value) => setBrkpnt(value)}
            options={[
              { label: 'lg' },
              { label: 'md' },
              { label: 'sm' },
            ]}
            w={60}
            className={css({ fs: 14, ml: 10 })}
          />
          <Cooltip>
            Add form width.
            {' '}
            <a className={css(ut.cooltipLearnMoreLink)} href="#">Learn More</a>
          </Cooltip>
        </SettingsBlock>
      </div>
      <SettingsBlock title="Atomic Class Prefix">
        <Input
          placeholder="Class Prefix"
          value={atomicClassPrefix}
          onChange={handleClassPrefix}
          onBlur={() => handleClassPrefix(atomicClassPrefix.trim())}
          w={250}
        />
        <Cooltip>
          Add prefix to atomic classes.
          {' '}
          <a className={css(ut.cooltipLearnMoreLink)} href="#">Learn More</a>
        </Cooltip>
      </SettingsBlock>

      <SettingsBlock title="Dark Mode">
        <Select
          color="primary"
          value={darkModePreference}
          onChange={handleDarkModePreference}
          options={[
            { label: 'Disabled', value: 'disabled' },
            { label: 'User system preference', value: 'system-preference' },
            { label: 'Parent selector', value: 'selector' },
            { label: 'Parent selector & user system preference', value: 'selector-and-system-preference' },
          ]}
          w={250}
        />
        {darkModePreference.match(/selector|selector-and-system-preference/g) && (
          <Input
            value={darkModeConfig.darkModeSelector}
            onChange={handleDarkModeSelector}
            onBlur={() => handleDarkModeSelector(darkModeConfig.darkModeSelector.trim())}
            className={css(ut.ml2)}
            w={250}
            placeholder="Selector"
          />
        )}

        <Cooltip>
          Set when dark mode style should be applied.
          <br />
          It may based on user system preference or parent class or attribute.
          <br />
          <a href="doclink for dark mode selector">Learn More</a>
        </Cooltip>
      </SettingsBlock>

      <SettingsBlock title="Add !important rule">
        <SingleToggle action={handleImportantStyles} isChecked={addImportantRuleToStyles} />
        <Cooltip>
          Add important rule to all styles to override the conflicting styles in frontend.
        </Cooltip>
      </SettingsBlock>
    </div>
  )
}

const SettingsBlock = ({ title, children, isPro, proProperty }) => {
  const { css } = useFela()
  return (
    <div className={css(ut.mt2, ut.flxc)}>
      <div className={css(ut.w1, ut.fw500, { w: 150 })}>
        {title}
        {isPro && !IS_PRO && (<ProBadge proProperty={proProperty} />)}
      </div>
      <div className={css(ut.flxc)}>
        {children}
      </div>
    </div>
  )
}

const style = {
  select: {
    brs: '8px',
    bd: 'var(--b-79-96) !important',
    h: '35px',
    b: '1px solid rgb(230, 230, 230) !important',
  },
}
