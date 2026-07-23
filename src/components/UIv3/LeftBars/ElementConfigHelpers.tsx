import React from 'react'
// import LayerAccordion from '../../CompSettings/StyleCustomize/ChildComp/LayerAccordion'
import { useFela } from 'react-fela'
import { isLabelOverrideStyles, styleClasses } from '../../style-new/styleHelpers'
import LayerAccordion from '../CompSettings/StyleCustomize/ChildComp/LayerAccordion'
import { ElementProps, FieldObject } from '../Types/ElementConfiguration.types'
import NavBtn from './NavBtn'
import style from './StyleLayers.styles'
// import { FieldObject, ElementProps } from './ElementConfigTypes'

interface RenderElementProps extends ElementProps {
  route: string
  label: string
  offset?: string
  condition?: boolean
  preIconKey?: keyof FieldObject
  sufIconKey?: keyof FieldObject
  preIconRoute?: string
  sufIconRoute?: string
  accordionOffset?: string
  childOffset?: string
  additionalChild?: React.ReactNode
  classNames?: string
}

/**
 * Renders a simple NavBtn element
 */
export const SimpleElement: React.FC<Omit<RenderElementProps, 'preIconKey' | 'sufIconKey'>> = ({
  fldKey,
  fieldObj,
  styles,
  route,
  label,
  offset = '1',
  classNames = ''
}) => {
  const styleClass = styleClasses[route]?.[0] || route
  const { css } = useFela()

  return (
    <NavBtn
      cssSelector={`.${fldKey}-${styleClass}`}
      subRoute={fldKey}
      route={route}
      label={label}
      offset={offset}
      highlightSelector={`[data-dev-${route}="${fldKey}"]`}
      styleOverride={isLabelOverrideStyles(styles, fldKey, route)}
      classNames={`${classNames} ${css(style.simpleNavBtn)}`}
    />
  )
}

/**
 * Renders an accordion element with optional prefix/suffix icons
 */
export const AccordionElement: React.FC<RenderElementProps> = ({
  fldKey,
  fieldObj,
  styles,
  selectedFieldKey,
  styleHandler,
  route,
  label,
  offset = '1',
  preIconKey,
  sufIconKey,
  preIconRoute,
  sufIconRoute,
  accordionOffset = '1',
  childOffset = '1',
  additionalChild,
}) => {
  const hasPreIcon = preIconKey && fieldObj[preIconKey]
  const hasSufIcon = sufIconKey && fieldObj[sufIconKey]
  const hasIcons = hasPreIcon || hasSufIcon
  const { css } = useFela()

  // If no icons, render simple element
  if (!hasIcons && !additionalChild) {
    return (
      <SimpleElement
        fldKey={fldKey}
        fieldObj={fieldObj}
        styles={styles}
        selectedFieldKey={selectedFieldKey}
        styleHandler={styleHandler}
        route={route}
        label={label}
        offset={offset}
        classNames={css(style.simpleNavBtn)}
      />
    )
  }

  // Render accordion with icons
  return (
    <LayerAccordion
      childrenAccordion
      route={route}
      onClick={() => styleHandler(route)}
      offset={accordionOffset}
      title={label}
      fldData={fieldObj}
      key={fldKey}
      tag={fldKey}
      open={fldKey === selectedFieldKey && hasIcons}
      highlightSelector={`[data-dev-${route}="${fldKey}"]`}
      styleOverride={isLabelOverrideStyles(styles, fldKey, route)}
      className={css(style.layerAccordion)}
    >
      {hasPreIcon && preIconRoute && (
        <NavBtn
          cssSelector={`.${fldKey}-${styleClasses[preIconRoute]?.[0] || preIconRoute}`}
          subRoute={fldKey}
          route={preIconRoute}
          label="Leading Icon"
          offset={childOffset}
          highlightSelector={`[data-dev-${preIconRoute}="${fldKey}"]`}
          styleOverride={isLabelOverrideStyles(styles, fldKey, preIconRoute)}
          classNames={css(style.simpleNavBtn)}
        />
      )}
      {hasSufIcon && sufIconRoute && (
        <NavBtn
          cssSelector={`.${fldKey}-${styleClasses[sufIconRoute]?.[0] || sufIconRoute}`}
          subRoute={fldKey}
          route={sufIconRoute}
          label="Trailing Icon"
          offset={childOffset}
          highlightSelector={`[data-dev-${sufIconRoute}="${fldKey}"]`}
          styleOverride={isLabelOverrideStyles(styles, fldKey, sufIconRoute)}
          classNames={css(style.simpleNavBtn)}
        />
      )}
      {additionalChild}
    </LayerAccordion>
  )
}

/**
 * Conditionally renders an element based on field properties
 */
export const ConditionalElement: React.FC<RenderElementProps & { condition: boolean }> = ({
  condition,
  ...props
}) => {
  if (!condition) return null

  return <AccordionElement {...props} />
}

/**
 * Renders multiple elements from configuration array
 */
interface ElementGroupProps extends Omit<ElementProps, 'fieldObj'> {
  fieldObj: FieldObject
  elements: Array<{
    condition?: (field: FieldObject) => boolean
    route: string
    label: string
    offset?: string
    preIconKey?: keyof FieldObject
    sufIconKey?: keyof FieldObject
    preIconRoute?: string
    sufIconRoute?: string
    additionalChild?: React.ReactNode
  }>
  additionalChild?: React.ReactNode
}

export const ElementGroup: React.FC<ElementGroupProps> = ({
  fldKey,
  fieldObj,
  styles,
  selectedFieldKey,
  styleHandler,
  elements,
  additionalChild,
}) => {
  return (
    <>
      {elements.map((element, index) => {
        // Check condition if provided
        if (element.condition && !element.condition(fieldObj)) {
          return null
        }

        return (
          <AccordionElement
            key={`${element.route}-${index}`}
            fldKey={fldKey}
            fieldObj={fieldObj}
            styles={styles}
            selectedFieldKey={selectedFieldKey}
            styleHandler={styleHandler}
            {...element}
            additionalChild={
              (element.additionalChild || additionalChild)
                ? <> {element.additionalChild} {additionalChild} </>
                : undefined
            }
          />
        )
      })}
    </>
  )
}