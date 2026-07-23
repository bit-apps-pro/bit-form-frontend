import React from 'react'
import SizeControler from '../../style-new/SizeControler'
import SpacingControl from '../../style-new/SpacingControl'
import StylePropertyBlock from '../../style-new/StylePropertyBlock'
import {
  BackgroundPropertyControl,
  BorderImagePropertyControl,
  BorderPropertyControl,
  ColorPropertyControl,
  DimensionPropertyControl,
  FilterColorPickerControl,
  FilterPropertyControl,
  FontPropertyControl,
  ObjectPaths,
  OpacityPropertyControl,
  ShadowPropertyControl,
  SpacingPropertyControl,
  TextAlignPropertyControl,
  TextDecorationPropertyControl,
  TransformPropertyControl,
  TransitionPropertyControl,
  ZIndexPropertyControl,
} from './PropertyControls'

// Types
export interface PropertyFactoryContext {
  fldTitle: string
  fldKey: string
  existCssPropsObj: Record<string, any>
  objectPaths: ObjectPaths
  themeColors: any
  themeVars: any
  styles: any
  state?: string

  // CSS Variable support - allows controls to update themeColors/themeVars instead of styles
  stateObjName?: 'styles' | 'themeColors' | 'themeVars'
  // When value is a CSS variable, this is the resolved value
  resolvedValue?: string

  // Handlers
  delPropertyHandler: (property: string, state?: string) => void
  delMultiPropertyHandler: (paths: string[], state?: string) => void
  clearHandler: (property: string, state?: string) => void
  spacingHandler: (params: { unit: string; value: number }, prop: string, prevUnit: string, state?: string) => void
  fontPropertyUpdateHandler: (property: string, value: string, state?: string) => void
  preDefinedValueHandler: (value: string, property: string, state?: string) => void
  setAlign: (value: string) => void
  fldZIndexHandler: (value: number) => void

  // Values
  getStyleValueAndUnit: (prop: string) => [number, string]
  txtAlignValue: string
  fldZIndex: number
  fontweightVariants: Record<string, string>
  fontStyleVariants: Record<string, string>
}

type PropertyControlRenderer = (context: PropertyFactoryContext) => React.ReactElement

// Property control mapping
export const propertyControlMap: Record<string, PropertyControlRenderer> = {
  background: (context) => (
    <BackgroundPropertyControl
      title="Background"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.['background-image']}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('background', context.state)}
      clearHandler={() => context.clearHandler('background', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      themeColors={context.themeColors}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
      stateObjName={context.stateObjName}
      resolvedValue={context.resolvedValue}
    />
  ),

  'border-image': (context) => (
    <BorderImagePropertyControl
      title="Border Image"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.['border-image']}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('border-image', context.state)}
      clearHandler={() => context.clearHandler('border-image', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),

  'background-color': (context) => (
    <ColorPropertyControl
      title="Background Color"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.['background-color']}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('background-color', context.state)}
      clearHandler={() => context.clearHandler('background-color', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="background-color"
      themeColors={context.themeColors}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
      stateObjName={context.stateObjName}
      resolvedValue={context.resolvedValue}
    />
  ),

  color: (context) => (
    <ColorPropertyControl
      title="Text Color"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.color}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('color', context.state)}
      clearHandler={() => context.clearHandler('color', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="color"
      themeColors={context.themeColors}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
      stateObjName={context.stateObjName}
      resolvedValue={context.resolvedValue}
    />
  ),

  'accent-color': (context) => (
    <ColorPropertyControl
      title="Accent Color"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.['accent-color']}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('accent-color', context.state)}
      clearHandler={() => context.clearHandler('accent-color', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="accent-color"
      themeColors={context.themeColors}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
      stateObjName={context.stateObjName}
      resolvedValue={context.resolvedValue}
    />
  ),

  '--bfv-upper-track-clr': (context) => (
    <ColorPropertyControl
      title="Track Color"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.['--bfv-upper-track-clr']}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('--bfv-upper-track-clr', context.state)}
      clearHandler={() => context.clearHandler('--bfv-upper-track-clr', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="--bfv-upper-track-clr"
      themeColors={context.themeColors}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),

  '--bfv-lower-track-clr': (context) => (
    <ColorPropertyControl
      title="Progress Fill Color"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.['--bfv-lower-track-clr']}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('--bfv-lower-track-clr', context.state)}
      clearHandler={() => context.clearHandler('--bfv-lower-track-clr', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="--bfv-lower-track-clr"
      themeColors={context.themeColors}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),

  border: (context) => (
    <BorderPropertyControl
      title="Border"
      subtitle={context.fldTitle}
      value={null}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('border', context.state)}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      existCssPropsObj={context.existCssPropsObj}
      styles={context.styles}
    />
  ),

  'line-height': (context) => {
    const [value, unit] = context.getStyleValueAndUnit('line-height')
    return (
      <SpacingPropertyControl
        title="Line Height"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('line-height', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="line-height"
        state={context.state}
        options={['', 'px', 'em', 'rem']}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'word-spacing': (context) => {
    const [value, unit] = context.getStyleValueAndUnit('word-spacing')
    return (
      <SpacingPropertyControl
        title="Word Spacing"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('word-spacing', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="word-spacing"
        state={context.state}
        min={0.1}
        max={100}
        options={['px', 'em', 'rem', '%']}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'letter-spacing': (context) => {
    const [value, unit] = context.getStyleValueAndUnit('letter-spacing')
    return (
      <SpacingPropertyControl
        title="Letter Spacing"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('letter-spacing', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="letter-spacing"
        state={context.state}
        min={0.1}
        max={100}
        options={['px', 'em', 'rem', '']}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  margin: (context) => (
    <StylePropertyBlock
      delPropertyHandler={() => context.delPropertyHandler('margin', context.state)}
      title="Margin"
    >
      <SpacingControl
        mainTitle="Margin"
        allowImportant
        action={{ type: 'spacing-control' }}
        subtitle={context.fldTitle}
        objectPaths={context.objectPaths}
        id="fld-mrgn-ctrl"
      />
    </StylePropertyBlock>
  ),

  padding: (context) => (
    <StylePropertyBlock
      delPropertyHandler={() => context.delPropertyHandler('padding', context.state)}
      title="Padding"
    >
      <SpacingControl
        mainTitle="Padding"
        allowImportant
        action={{ type: 'spacing-control' }}
        subtitle={context.fldTitle}
        objectPaths={context.objectPaths}
        id="fld-pddng-ctrl"
      />
    </StylePropertyBlock>
  ),

  size: (context) => (
    <StylePropertyBlock
      delPropertyHandler={() => {
        context.delPropertyHandler('width', context.state)
        context.delPropertyHandler('height', context.state)
        context.delPropertyHandler('size', context.state)
      }}
      title="Size"
    >
      <SizeControler
        action={{ type: 'size-control' }}
        subtitle={`${context.fldTitle} Size`}
        objectPaths={context.objectPaths}
        id="size-control"
        width="128px"
      />
    </StylePropertyBlock>
  ),

  width: (context) => {
    const [value, unit] = context.getStyleValueAndUnit('width')
    return (
      <DimensionPropertyControl
        title="Width"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('width', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="width"
        state={context.state}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'max-width': (context) => {
    const [value, unit] = context.getStyleValueAndUnit('max-width')
    return (
      <DimensionPropertyControl
        title="Max Width"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('max-width', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="max-width"
        state={context.state}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'min-width': (context) => {
    const [value, unit] = context.getStyleValueAndUnit('min-width')
    return (
      <DimensionPropertyControl
        title="Min Width"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('min-width', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="min-width"
        state={context.state}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  height: (context) => {
    const [value, unit] = context.getStyleValueAndUnit('height')
    return (
      <DimensionPropertyControl
        title="Height"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('height', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="height"
        state={context.state}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'max-height': (context) => {
    const [value, unit] = context.getStyleValueAndUnit('max-height')
    return (
      <DimensionPropertyControl
        title="Max Height"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('max-height', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="max-height"
        state={context.state}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'min-height': (context) => {
    const [value, unit] = context.getStyleValueAndUnit('min-height')
    return (
      <DimensionPropertyControl
        title="Min Height"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('min-height', context.state)}
        sizeValue={value}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        propertyKey="min-height"
        state={context.state}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'text-align': (context) => (
    <TextAlignPropertyControl
      title="Text Align"
      subtitle={context.fldTitle}
      value={null}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('text-align', context.state)}
      setAlign={context.setAlign}
      txtAlignValue={context.txtAlignValue}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      existCssPropsObj={context.existCssPropsObj}
      styles={context.styles}
    />
  ),

  'text-decoration': (context) => (
    <TextDecorationPropertyControl
      title="Text Decoration"
      subtitle={context.fldTitle}
      value={null}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('text-decoration', context.state)}
      delMultiPropertyHandler={context.delMultiPropertyHandler}
      existCssPropsObj={context.existCssPropsObj}
      state={context.state}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),

  'text-shadow': (context) => (
    <ShadowPropertyControl
      title="Text Shadow"
      subtitle={`${context.fldTitle} Text Shadow`}
      value={context.existCssPropsObj?.['text-shadow']}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('text-shadow', context.state)}
      clearHandler={() => context.clearHandler('text-shadow', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="text-shadow"
      defaultValue="0px 1px 2px hsla(0, 0%, 0%, 35%)"
      propertyArray={['xOffset', 'yOffset', 'blur', 'color']}
      fldKey={context.fldKey}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),

  'box-shadow': (context) => (
    <ShadowPropertyControl
      title="Box Shadow"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.['box-shadow']}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('box-shadow', context.state)}
      clearHandler={() => context.clearHandler('box-shadow', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="box-shadow"
      fldKey={context.fldKey}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),

  transition: (context) => (
    <TransitionPropertyControl
      title="Transition"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.transition}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('transition', context.state)}
      clearHandler={() => context.clearHandler('transition', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),

  filter: (context) => (
    <FilterPropertyControl
      title="Filter"
      subtitle={context.fldTitle}
      value={null}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('filter', context.state)}
      propertyKey="filter"
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      existCssPropsObj={context.existCssPropsObj}
      styles={context.styles}
    />
  ),

  'backdrop-filter': (context) => {
    // Modify objectPaths for backdrop-filter
    const modifiedContext = {
      ...context,
      objectPaths: {
        ...context.objectPaths,
        paths: {
          ...context.objectPaths.paths,
          filter: context.objectPaths.paths?.['backdrop-filter'],
        },
      },
    }

    return (
      <FilterPropertyControl
        title="Backdrop Filter"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={modifiedContext.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('backdrop-filter', context.state)}
        propertyKey="backdrop-filter"
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'font-size': (context) => {
    const [value, unit] = context.getStyleValueAndUnit('font-size')
    return (
      <SpacingPropertyControl
        title="Font Size"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('font-size', context.state)}
        sizeValue={value || 12}
        sizeUnit={unit || 'px'}
        spacingHandler={context.spacingHandler}
        propertyKey="font-size"
        state={context.state}
        options={['px', 'em', 'rem']}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'font-weight': (context) => {
    const showWarning =
      context.styles?.font?.fontType === 'Google' &&
      context.existCssPropsObj?.['font-weight'] &&
      !context.styles.font?.fontWeightVariants.includes(Number(context.existCssPropsObj?.['font-weight']))

    return (
      <FontPropertyControl
        title="Font Weight"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('font-weight', context.state)}
        fontPropertyUpdateHandler={context.fontPropertyUpdateHandler}
        fontVariants={context.fontweightVariants}
        existCssPropsObj={context.existCssPropsObj}
        propertyKey="font-weight"
        state={context.state}
        showWarning={showWarning}
        warningMessage="Font weight not found!"
        styles={context.styles}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
      />
    )
  },

  'font-style': (context) => {
    const showWarning =
      context.styles?.font?.fontType === 'Google' &&
      context.existCssPropsObj?.['font-style'] &&
      !context.styles.font?.fontStyle.includes(context.existCssPropsObj?.['font-style'])

    return (
      <FontPropertyControl
        title="Font Style"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('font-style', context.state)}
        fontPropertyUpdateHandler={context.fontPropertyUpdateHandler}
        fontVariants={context.fontStyleVariants}
        existCssPropsObj={context.existCssPropsObj}
        propertyKey="font-style"
        state={context.state}
        showWarning={showWarning}
        warningMessage="Font style not found!"
        styles={context.styles}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
      />
    )
  },

  'white-space': (context) => (
    <FontPropertyControl
      title="White Space"
      subtitle={context.fldTitle}
      value={null}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('white-space', context.state)}
      fontPropertyUpdateHandler={context.fontPropertyUpdateHandler}
      fontVariants={[
        { value: 'normal', label: 'Normal' },
        { value: 'nowrap', label: 'No Wrap' },
        { value: 'pre', label: 'Pre' },
        { value: 'pre-wrap', label: 'Pre Wrap' },
        { value: 'pre-line', label: 'Pre Line' }]}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="white-space"
      state={context.state}
      styles={context.styles}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
    />
  ),

  'word-wrap': (context) => (
    <FontPropertyControl
      title="Word Wrap"
      subtitle={context.fldTitle}
      value={null}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('word-wrap', context.state)}
      fontPropertyUpdateHandler={context.fontPropertyUpdateHandler}
      fontVariants={{ normal: 'Normal', 'break-word': 'Break Word' }}
      existCssPropsObj={context.existCssPropsObj}
      propertyKey="word-wrap"
      state={context.state}
      styles={context.styles}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
    />
  ),

  opacity: (context) => {
    const [value, unit] = context.getStyleValueAndUnit('opacity')
    return (
      <OpacityPropertyControl
        title="Opacity"
        subtitle={context.fldTitle}
        value={null}
        objectPaths={context.objectPaths}
        delPropertyHandler={() => context.delPropertyHandler('opacity', context.state)}
        sizeValue={value || 1}
        sizeUnit={unit}
        spacingHandler={context.spacingHandler}
        state={context.state}
        fldTitle={context.fldTitle}
        themeVars={context.themeVars}
        existCssPropsObj={context.existCssPropsObj}
        styles={context.styles}
      />
    )
  },

  'z-index': (context) => (
    <ZIndexPropertyControl
      title="Z-Index"
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('z-index', context.state)}
      zIndexValue={context.fldZIndex}
      zIndexHandler={context.fldZIndexHandler}
    />
  ),

  transform: (context) => (
    <TransformPropertyControl
      title="Transform"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.transform}
      objectPaths={context.objectPaths}
      delPropertyHandler={() => context.delPropertyHandler('transform', context.state)}
      clearHandler={() => context.clearHandler('transform', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),

  'color(filter)': (context) => (
    <FilterColorPickerControl
      title="Color"
      subtitle={context.fldTitle}
      value={context.existCssPropsObj?.['icon-color']}
      objectPaths={context.objectPaths}
      delMultiPropertyHandler={context.delMultiPropertyHandler}
      clearHandler={() => context.clearHandler('icon-color', context.state)}
      existCssPropsObj={context.existCssPropsObj}
      state={context.state}
      propertyKey="icon-color"
      fldTitle={context.fldTitle}
      themeVars={context.themeVars}
      styles={context.styles}
    />
  ),
}

/**
 * Gets the appropriate property control component for a given CSS property
 */
export const getPropertyControl = (
  propName: string,
  context: PropertyFactoryContext
): React.ReactElement | null => {
  const renderer = propertyControlMap[propName]

  if (!renderer) {
    console.warn(`No property control found for: ${propName}`)
    return null
  }

  return renderer(context)
}
