import React from 'react'
import { useFela } from 'react-fela'
import TxtAlignCntrIcn from '../../../Icons/TxtAlignCntrIcn'
import TxtAlignJustifyIcn from '../../../Icons/TxtAlignJustifyIcn'
import TxtAlignLeftIcn from '../../../Icons/TxtAlignLeftIcn'
import TxtAlignRightIcn from '../../../Icons/TxtAlignRightIcn'
import ut from '../../../styles/2.utilities'
import sizeControlStyle from '../../../styles/sizeControl.style'
import CustomInputControl from '../../CompSettings/StyleCustomize/ChildComp/CustomInputControl'
import BackgroundControl from '../../style-new/BackgroundControl'
import BorderControl from '../../style-new/BorderControl'
import BorderImageControl from '../../style-new/BorderImageControl'
import FilterColorPicker from '../../style-new/FilterColorPicker'
import FilterController from '../../style-new/FilterController'
import Important from '../../style-new/Important'
import IndividualShadowControl from '../../style-new/IndividualShadowControl'
import ResetStyle from '../../style-new/ResetStyle'
import SimpleColorPicker from '../../style-new/SimpleColorPicker'
// import SizeControl from '../../style-new/SizeControl'
import SizeControl from '../../CompSettings/StyleCustomize/ChildComp/SizeControl'
import { getValueFromStateVar } from '../../style-new/styleHelpers'
import StylePropertyBlock from '../../style-new/StylePropertyBlock'
import TextDecorationControl from '../../style-new/TextDecorationControl'
import TransformControl from '../../style-new/TransformControl'
import TransitionControl from '../../style-new/TransitionControl'
import SimpleDropdown from '../../Utilities/SimpleDropdown'
import StyleSegmentControl from '../../Utilities/StyleSegmentControl'

// Types
export interface ObjectPaths {
  object: string
  paths: Record<string, string>
}

export interface PropertyControlProps {
  title: string
  subtitle: string
  value: any
  objectPaths: ObjectPaths
  delPropertyHandler: () => void
  clearHandler?: () => void
  fldTitle: string
  themeColors?: any
  themeVars?: any
  existCssPropsObj?: Record<string, any>
  styles?: any
  fldKey?: string
  modalId?: string
  // CSS Variable support - allows controls to update themeColors/themeVars instead of styles
  stateObjName?: 'styles' | 'themeColors' | 'themeVars'
  // For variable-aware controls, provides the resolved value
  resolvedValue?: string
}

export interface SizePropertyProps extends PropertyControlProps {
  sizeValue: number
  sizeUnit: string
  spacingHandler: (params: { unit: string; value: number }, prop: string, prevUnit: string, state?: string) => void
  state?: string
}

export interface FontPropertyProps extends PropertyControlProps {
  fontPropertyUpdateHandler: (property: string, value: string, state?: string) => void
  fontVariants: Record<string, string>
  state?: string
  styles?: any
  fldKey?: string
}

// Background Property Control
export const BackgroundPropertyControl: React.FC<PropertyControlProps> = ({
  title,
  subtitle,
  value,
  objectPaths,
  delPropertyHandler,
  clearHandler,
  existCssPropsObj,
  themeColors,
  stateObjName = 'styles',
  resolvedValue,
}) => {
  const modalId = `${title.toLowerCase().replace(/\s+/g, '-')}-bg`
  const displayValue = resolvedValue || existCssPropsObj?.['background-image']?.replace(/\s?!important/g, '') || getValueFromStateVar(themeColors, existCssPropsObj?.background)

  return (
    <BackgroundControl
      title={title}
      subtitle={subtitle}
      value={displayValue}
      modalId={modalId}
      stateObjName={stateObjName}
      propertyPath={objectPaths.paths?.background}
      objectPaths={objectPaths}
      deleteable
      delPropertyHandler={delPropertyHandler}
      clearHandler={clearHandler}
      allowImportant
    />
  )
}

// Border Image Property Control
export const BorderImagePropertyControl: React.FC<PropertyControlProps> = ({
  title,
  subtitle,
  value,
  objectPaths,
  delPropertyHandler,
  clearHandler,
  existCssPropsObj,
}) => {
  const modalId = `${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <BorderImageControl
      title={title}
      subtitle={subtitle}
      value={existCssPropsObj?.['border-image']}
      modalId={modalId}
      stateObjName="styles"
      objectPaths={objectPaths}
      deleteable
      delPropertyHandler={delPropertyHandler}
      clearHandler={clearHandler}
      allowImportant
    />
  )
}

// Simple Color Property Control
export const ColorPropertyControl: React.FC<PropertyControlProps & { propertyKey: string }> = ({
  title,
  subtitle,
  objectPaths,
  delPropertyHandler,
  clearHandler,
  existCssPropsObj,
  propertyKey,
  themeColors,
  modalId,
  stateObjName = 'styles',
  resolvedValue
}) => {
  const modalIdFinal = modalId || `${title.toLowerCase().replace(/\s+/g, '-')}`
  const value = resolvedValue || (propertyKey === 'background-color'
    ? getValueFromStateVar(themeColors, existCssPropsObj?.[propertyKey])
    : existCssPropsObj?.[propertyKey])

  return (
    <SimpleColorPicker
      title={title}
      subtitle={subtitle}
      value={value}
      modalId={modalIdFinal}
      stateObjName={stateObjName}
      propertyPath={objectPaths.paths?.[propertyKey]}
      deleteable
      delPropertyHandler={delPropertyHandler}
      clearHandler={clearHandler}
      allowImportant
      canSetVariable
    />
  )
}

// Border Property Control
export const BorderPropertyControl: React.FC<PropertyControlProps> = ({
  title,
  subtitle,
  objectPaths,
  delPropertyHandler,
}) => {
  const { css } = useFela()
  const id = `${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <StylePropertyBlock delPropertyHandler={delPropertyHandler} title={title}>
      <ResetStyle
        propertyPath={Object.values(objectPaths.paths)}
        stateObjName="styles"
        id={id}
      />
      <BorderControl
        allowImportant
        subtitle={subtitle}
        objectPaths={objectPaths}
        id={id}
      />
    </StylePropertyBlock>
  )
}

// Spacing Property Control (Line Height, Word Spacing, Letter Spacing)
export const SpacingPropertyControl: React.FC<SizePropertyProps & { propertyKey: string; min?: number; max?: number; options: string[] }> = ({
  title,
  objectPaths,
  delPropertyHandler,
  sizeValue,
  sizeUnit,
  spacingHandler,
  propertyKey,
  state = '',
  min,
  max,
  options,
}) => {
  const { css } = useFela()
  const id = `${title.toLowerCase().replace(/\s+/g, '-')}`
  const step = sizeUnit !== 'px' ? '0.1' : '1'

  return (
    <StylePropertyBlock delPropertyHandler={delPropertyHandler} title={title}>
      <ResetStyle
        propertyPath={objectPaths.paths?.[propertyKey]}
        stateObjName="styles"
        id={id}
      />
      <div className={css(ut.flxc)}>
        {sizeValue !== null && (
          <Important
            id={id}
            className={css({ mr: 5 })}
            propertyPath={objectPaths.paths?.[propertyKey]}
            stateObjName={objectPaths.object || 'styles'}
          />
        )}
        <SizeControl
          inputHandler={({ unit, value }) => spacingHandler({ unit, value }, propertyKey, sizeUnit, state)}
          sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, propertyKey, sizeUnit, state)}
          value={sizeValue || 0}
          unit={sizeUnit || ''}
          width="128px"
          options={options}
          step={step}
          min={min}
          max={max}
          dataTestId={id}
        />
      </div>
    </StylePropertyBlock>
  )
}

// Dimension Property Control (Width, Height, Max/Min variants)
export const DimensionPropertyControl: React.FC<SizePropertyProps & { propertyKey: string }> = ({
  title,
  objectPaths,
  delPropertyHandler,
  sizeValue,
  sizeUnit,
  spacingHandler,
  propertyKey,
  state = '',
}) => {
  const { css } = useFela()
  const id = `${title.toLowerCase().replace(/\s+/g, '-')}`
  const cls = { mr2: { mr: 2 } }

  return (
    <StylePropertyBlock delPropertyHandler={delPropertyHandler} title={title}>
      <ResetStyle
        propertyPath={objectPaths.paths?.[propertyKey]}
        stateObjName="styles"
        id={id}
      />
      <div className={css(ut.flxc, { cg: 3 })}>
        {sizeValue && (
          <Important
            className={css(cls.mr2)}
            propertyPath={objectPaths.paths?.[propertyKey]}
            stateObjName={objectPaths.object || 'styles'}
            id={id}
          />
        )}
        <SizeControl
          width="128px"
          value={Number(sizeValue)}
          unit={sizeUnit}
          inputHandler={({ unit, value }) => spacingHandler({ unit, value }, propertyKey, sizeUnit, state)}
          sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, propertyKey, sizeUnit, state)}
          options={['px', 'em', 'rem', '%']}
          dataTestId={id}
        />
      </div>
    </StylePropertyBlock>
  )
}

// Text Align Property Control
export const TextAlignPropertyControl: React.FC<PropertyControlProps & { setAlign: (value: string) => void; txtAlignValue: string }> = ({
  title,
  objectPaths,
  delPropertyHandler,
  setAlign,
  txtAlignValue,
}) => {
  const { css } = useFela()

  return (
    <StylePropertyBlock delPropertyHandler={delPropertyHandler} title={title}>
      <ResetStyle id="txt-align" propertyPath={objectPaths.paths?.['text-align']} stateObjName="styles" />
      <div className={css(ut.flxc, { cg: 3 })}>
        <StyleSegmentControl
          className={css({ w: 130 })}
          show={['icn']}
          tipPlace="bottom"
          options={[
            { icn: <TxtAlignLeftIcn size="17" />, label: 'left', tip: 'Left' },
            { icn: <TxtAlignCntrIcn size="17" />, label: 'center', tip: 'Center' },
            { icn: <TxtAlignJustifyIcn size="17" />, label: 'justify', tip: 'Justify' },
            { icn: <TxtAlignRightIcn size="17" />, label: 'right', tip: 'Right' },
          ]}
          onChange={setAlign}
          defaultActive={txtAlignValue}
        />
      </div>
    </StylePropertyBlock>
  )
}

// Font Property Control (Font Weight, Font Style, White Space, Word Wrap)
export const FontPropertyControl: React.FC<FontPropertyProps & { propertyKey: string; showWarning?: boolean; warningMessage?: string }> = ({
  title,
  objectPaths,
  delPropertyHandler,
  fontPropertyUpdateHandler,
  fontVariants,
  existCssPropsObj,
  propertyKey,
  state = '',
  showWarning = false,
  warningMessage = '',
  styles,
}) => {
  const { css } = useFela()
  const id = `${title.toLowerCase().replace(/\s+/g, '-')}`
  const cls = {
    comSection: { dy: 'flex', fd: 'column' },
    warningBorder: { b: '1px solid yellow' },
    clr: { cr: 'red' },
  }

  return (
    <StylePropertyBlock delPropertyHandler={delPropertyHandler} title={title}>
      <ResetStyle id={id} propertyPath={objectPaths.paths?.[propertyKey]} stateObjName="styles" />
      <div className={css(ut.flxc, { cg: 3 })}>
        {existCssPropsObj?.[propertyKey] && (
          <Important id={id} propertyPath={objectPaths.paths?.[propertyKey]} stateObjName={objectPaths.object || 'styles'} />
        )}
        <div className={css(cls.comSection)}>
          <SimpleDropdown
            options={fontVariants}
            value={String(existCssPropsObj?.[propertyKey])}
            onChange={(val) => fontPropertyUpdateHandler(propertyKey, val, state)}
            w={130}
            h={30}
            id={id}
            cls={css(showWarning ? cls.warningBorder : {})}
          />
          {showWarning && <span className={css(cls.clr)}>{warningMessage}</span>}
        </div>
      </div>
    </StylePropertyBlock>
  )
}

// Opacity Property Control
export const OpacityPropertyControl: React.FC<SizePropertyProps> = ({
  title,
  objectPaths,
  delPropertyHandler,
  sizeValue,
  sizeUnit,
  spacingHandler,
  state = '',
}) => {
  const { css } = useFela()
  const cls = { mr2: { mr: 2 } }

  return (
    <StylePropertyBlock delPropertyHandler={delPropertyHandler} title={title}>
      <ResetStyle id="fld-opacity" propertyPath={objectPaths.paths?.opacity} stateObjName="styles" />
      <div className={css(ut.flxc, { cg: 3 })}>
        {sizeValue && (
          <Important
            className={css(cls.mr2)}
            propertyPath={objectPaths.paths?.opacity}
            stateObjName={objectPaths.object || 'styles'}
            id="fld-opacity"
          />
        )}
        <SizeControl
          className={css({ w: 130 })}
          inputHandler={({ unit, value }) => spacingHandler({ unit, value }, 'opacity', sizeUnit, state)}
          sizeHandler={({ unitKey, unitValue }) => spacingHandler({ unit: unitKey, value: unitValue }, 'opacity', sizeUnit, state)}
          value={sizeValue || 1}
          unit={sizeUnit}
          min={0}
          max={sizeUnit === '' ? 1 : 100}
          width="128px"
          options={['', '%']}
          step={sizeUnit === '' ? 0.1 : 1}
          dataTestId="fld-opacity"
        />
      </div>
    </StylePropertyBlock>
  )
}

// Z-Index Property Control
export const ZIndexPropertyControl: React.FC<{
  title: string
  objectPaths: ObjectPaths
  delPropertyHandler: () => void
  zIndexValue: number
  zIndexHandler: (value: number) => void
}> = ({ title, objectPaths, delPropertyHandler, zIndexValue, zIndexHandler }) => {
  const { css } = useFela()

  return (
    <StylePropertyBlock delPropertyHandler={delPropertyHandler} title={title}>
      <ResetStyle id="fld-z-index" propertyPath={objectPaths.paths?.['z-index']} stateObjName="styles" />
      <div className={css(ut.flxc, { cg: 3 })}>
        {zIndexValue && (
          <Important
            id="fld-z-index"
            propertyPath={objectPaths.paths?.['z-index']}
            stateObjName={objectPaths.object || 'styles'}
            className={css({ mr: 2 })}
          />
        )}
        <div className={css(sizeControlStyle.container)}>
          <CustomInputControl
            className={css(sizeControlStyle.input)}
            label=""
            value={zIndexValue || 0}
            min={0}
            max={100}
            step={1}
            width="120px"
            onChange={zIndexHandler}
            dataTestId="fld-z-index"
          />
        </div>
      </div>
    </StylePropertyBlock>
  )
}

// Shadow Property Control (Box Shadow, Text Shadow)
export const ShadowPropertyControl: React.FC<PropertyControlProps & {
  propertyKey: string
  defaultValue?: string
  propertyArray?: string[]
}> = ({
  title,
  subtitle,
  objectPaths,
  delPropertyHandler,
  clearHandler,
  existCssPropsObj,
  propertyKey,
  defaultValue,
  propertyArray,
  fldKey,
}) => {
    const modalId = `${title.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <IndividualShadowControl
        title={title}
        subtitle={subtitle}
        value={existCssPropsObj?.[propertyKey]}
        defaultValue={defaultValue}
        modalId={modalId}
        stateObjName="styles"
        propertyPath={objectPaths.paths?.[propertyKey]}
        propertyArray={propertyArray}
        deleteable
        delPropertyHandler={delPropertyHandler}
        clearHandler={clearHandler}
        allowImportant
        fldKey={fldKey}
      />
    )
  }

// Transform Property Control
export const TransformPropertyControl: React.FC<PropertyControlProps> = ({
  title,
  subtitle,
  objectPaths,
  delPropertyHandler,
  clearHandler,
  existCssPropsObj,
}) => {
  const modalId = `${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <TransformControl
      title={title}
      subtitle={subtitle}
      value={existCssPropsObj?.transform}
      modalId={modalId}
      stateObjName="styles"
      propertyPath={objectPaths.paths?.transform}
      deleteable
      delPropertyHandler={delPropertyHandler}
      clearHandler={clearHandler}
      allowImportant
    />
  )
}

// Transition Property Control
export const TransitionPropertyControl: React.FC<PropertyControlProps> = ({
  title,
  subtitle,
  objectPaths,
  delPropertyHandler,
  clearHandler,
  existCssPropsObj,
}) => {
  const modalId = `${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <TransitionControl
      title={title}
      subtitle={subtitle}
      value={existCssPropsObj?.transition}
      modalId={modalId}
      stateObjName="styles"
      propertyPath={objectPaths.paths?.transition}
      deleteable
      delPropertyHandler={delPropertyHandler}
      clearHandler={clearHandler}
      allowImportant
    />
  )
}

// Filter Property Control
export const FilterPropertyControl: React.FC<PropertyControlProps & { propertyKey: string }> = ({
  title,
  subtitle,
  objectPaths,
  delPropertyHandler,
  propertyKey,
}) => {
  const { css } = useFela()
  const id = `${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <StylePropertyBlock delPropertyHandler={delPropertyHandler} title={title}>
      <ResetStyle
        propertyPath={objectPaths.paths?.[propertyKey]}
        stateObjName="styles"
        id={id}
      />
      <div className={css(ut.flxc, { cg: 3 })}>
        <FilterController
          action={{ type: 'filter-control' }}
          subtitle={subtitle}
          objectPaths={objectPaths}
          id={id}
          allowImportant
        />
      </div>
    </StylePropertyBlock>
  )
}

// Text Decoration Property Control
export const TextDecorationPropertyControl: React.FC<PropertyControlProps & {
  delMultiPropertyHandler: (paths: string[], state?: string) => void
  state?: string
}> = ({
  title,
  subtitle,
  objectPaths,
  delPropertyHandler,
  delMultiPropertyHandler,
  existCssPropsObj,
  state = '',
}) => {
    return (
      <StylePropertyBlock
        delPropertyHandler={() => {
          delPropertyHandler()
          delMultiPropertyHandler(Object.values(objectPaths.paths), state)
        }}
        title={title}
      >
        <ResetStyle
          propertyPath={objectPaths.paths?.['text-decoration-line']}
          stateObjName="styles"
          id="txt-decor-line"
        />
        <TextDecorationControl
          subtitle={subtitle}
          value={existCssPropsObj?.['text-decoration-line']}
          objectPaths={objectPaths}
          id="fld-txt-dcrtn"
          allowImportant
        />
      </StylePropertyBlock>
    )
  }

// Filter Color Picker Property Control
export const FilterColorPickerControl: React.FC<PropertyControlProps & {
  delMultiPropertyHandler: (paths: string[], state?: string) => void
  state?: string
  propertyKey: string
}> = ({
  title,
  subtitle,
  objectPaths,
  delMultiPropertyHandler,
  clearHandler,
  existCssPropsObj,
  state = '',
  propertyKey,
}) => {
    const modalId = `${title.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <FilterColorPicker
        title={title}
        subtitle={subtitle}
        value={existCssPropsObj?.[propertyKey]}
        modalId={modalId}
        stateObjName="styles"
        propertyPath={objectPaths.paths?.[propertyKey]}
        objectPaths={objectPaths}
        deleteable
        delPropertyHandler={() => delMultiPropertyHandler([objectPaths.paths?.[propertyKey]], state)}
        clearHandler={clearHandler}
        allowImportant
      />
    )
  }
