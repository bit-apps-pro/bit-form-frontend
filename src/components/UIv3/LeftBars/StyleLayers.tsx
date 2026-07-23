import { useAtomValue } from 'jotai'
import { memo } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import { $allLayouts } from '../../../GlobalStates/GlobalStates'
import { $styles } from '../../../GlobalStates/StylesState'
import TweaksIcn from '../../../Icons/TweaksIcn'
import { getFieldsBasedOnLayoutOrder } from '../../../Utils/FormBuilderHelper'
import { ucFirst } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import fieldTypes from '../../../Utils/StaticData/fieldTypes'
import SimpleAccordion from '../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import { isFieldOverrideStyles } from '../../style-new/styleHelpers'
import EmptyFieldState from '../CompSettings/EmptyFieldState'
import LayerAccordion from '../CompSettings/StyleCustomize/ChildComp/LayerAccordion'
import ElementConfiguration from './ElementConfiguration'
import NavBtn from './NavBtn'
import style from './StyleLayers.styles'
import {
  COMMON_ELEMENTS_HIERARCHY,
  HierarchicalElement,
  MULTI_STEP_ELEMENTS_HIERARCHY
} from './StyleLayersConfig'

interface RouteParams {
  formID: string
  formType: string
  '*': string
}

function StyleLayers() {
  const { css } = useFela()
  const styles = useAtomValue($styles)
  const allLayouts = useAtomValue($allLayouts)
  const formLayouts = Array.isArray(allLayouts) ? allLayouts : [allLayouts]
  const isMultiStep = formLayouts.length > 1
  const navigate = useNavigate()
  const { formID, formType, '*': rightBar } = useParams<RouteParams>()
  const [firstRoute, secondRoute, fieldKey] = rightBar?.split('/') || []
  const sortedFields = getFieldsBasedOnLayoutOrder()
  const activeFields = Object.entries(sortedFields).filter(([, fld]) => !fld.hidden)

  const showFldTitle = (typ: string) => ucFirst(fieldTypes[typ] || typ)

  const styleHandler = (route: string, fldKey: string | null = null, fldData: any = null) => {
    if (fldData) {
      route = (fldData.typ === 'html' || fldData.typ === 'divider') ? 'fld-wrp' : route
    }
    if (fldKey) {
      navigate(`/form/builder/${formType}/${formID}/field-theme-customize/${route}/${fldKey}`)
    } else {
      navigate(`/form/builder/${formType}/${formID}/theme-customize/${route}`)
    }
  }

  // Helper function to check if any child element (recursively) is active in the current route
  const hasActiveChild = (element: HierarchicalElement, currentRoute: string): boolean => {
    // Check if this element's route matches the current route
    if (element.route === currentRoute) {
      return true
    }

    // Recursively check children
    if (element.children) {
      return element.children.some(child => hasActiveChild(child, currentRoute))
    }

    return false
  }

  const renderHierarchicalElements = (elements: HierarchicalElement[], level = 1) => {
    // Get current route path for checking active children
    // For theme-customize routes: rightBar = 'theme-customize/lbl-pre-i' or 'theme-customize/multi-step/stp-hdr-lbl'
    // We need the part after 'theme-customize/'
    let currentRoutePath = ''
    if (firstRoute === 'theme-customize') {
      // Reconstruct the route path after 'theme-customize/'
      if (fieldKey) {
        // Multi-step: 'multi-step/stp-hdr-lbl'
        currentRoutePath = `${secondRoute}/${fieldKey}`
      } else {
        // Simple route: 'lbl-pre-i'
        currentRoutePath = secondRoute || ''
      }
    }

    return elements.map((element, index) => {
      // Check if this parent accordion should be open
      // It should be open if:
      // 1. The parent route itself is active, OR
      // 2. Any child (recursively) is active
      let shouldBeOpen = false
      if (currentRoutePath && element.children && element.children.length > 0) {
        // Check if parent itself is active
        if (element.route === currentRoutePath) {
          shouldBeOpen = true
        } else {
          // Check if any child is active
          shouldBeOpen = hasActiveChild(element, currentRoutePath)
        }
      }

      if (element.children && element.children.length > 0) {
        return (
          <LayerAccordion
            key={`${element.route}-${index}`}
            title={element.label}
            level={level}
            route={element.route}
            onClick={() => styleHandler(element.route)}
            highlightSelector={element.highlightSelector}
            hasTarget={element.hasTarget !== false}
            open={shouldBeOpen}
            className={css(style.layerAccordion)}
          >
            {renderHierarchicalElements(element.children, level)}
          </LayerAccordion>
        )
      }

      return (
        <LayerAccordion
          key={`${element.route}-${index}`}
          title={element.label}
          level={level}
          route={element.route}
          onClick={() => styleHandler(element.route)}
          highlightSelector={element.highlightSelector}
          hasTarget={element.hasTarget !== false}
          open={false}
          className={css(style.layerAccordion)}
        />
      )
    })
  }

  return (
    <div className={css(style.con)}>
      <NavBtn
        icn={<TweaksIcn size={13} />}
        route="quick-tweaks"
        label={__("Theme Quick Tweaks")}
        classNames={css(style.themeQuickTweaks)}
      />
      <div className={css(style.divider)} />
      <Scrollbars style={{ height: 'calc(100% - 120px)' }} autoHide>
        <SimpleAccordion
          key={'common-elements'}
          id={`common-elements-fields`}
          title={__('Global Elements')}
          className={css(style.sectionAccordion)}
          open={!['field-theme-customize', 'themes', 'multi-step'].includes(firstRoute) && secondRoute !== 'quick-tweaks'}
        >
          {renderHierarchicalElements(COMMON_ELEMENTS_HIERARCHY)}
        </SimpleAccordion>

        {isMultiStep && (<SimpleAccordion
          key={'multi-step-elements'}
          id={`multi-step-elements-fields`}
          title={__('Multi-Step Elements')}
          className={css(style.sectionAccordion)}
          open={secondRoute === 'multi-step'}
        >
          {renderHierarchicalElements(MULTI_STEP_ELEMENTS_HIERARCHY)}
        </SimpleAccordion>
        )}

        <SimpleAccordion
          key={'individual-elements'}
          id={`individual-elements-fields`}
          title={__('Individual Elements')}
          className={css(style.sectionAccordion)}
          open={firstRoute === 'field-theme-customize'}
        >
          {activeFields?.map(([fldKey, fldData], index) => {
            // const fieldBadge = generateFieldBadge(index)
            //TODO: Check Every Field Layers with Old StyleLayers Component and Remove this Old StyleLayers Component and related files
            return (
              <LayerAccordion
                key={fldKey}
                title={showFldTitle(fldData.typ)}
                // badge={fieldBadge}
                level={1}
                route={`quick-tweaks/${fldKey}`}
                tag={fldKey}
                open={fldKey === fieldKey}
                onClick={() => styleHandler('quick-tweaks', fldKey, fldData)}
                highlightSelector={`[data-dev-fld-wrp="${fldKey}"]`}
                fldData={fldData}
                className={css(style.layerAccordion)}
                styleOverride={isFieldOverrideStyles(styles, fldKey)}
              >
                <FieldRendererHierarchical
                  fldKey={fldKey}
                  fldData={fldData}
                  styles={styles}
                  styleHandler={styleHandler}
                />
              </LayerAccordion>
            )
          })}

          {activeFields.length === 0 && (<EmptyFieldState />)}
        </SimpleAccordion>
      </Scrollbars>
    </div>
  )
}

interface FieldRendererHierarchicalProps {
  fldKey: string
  fldData: any
  styles: any
  styleHandler: (route: string, fldKey?: string | null, fldData?: any) => void
}

function FieldRendererHierarchical({ fldKey, fldData, styles, styleHandler }: FieldRendererHierarchicalProps) {
  const { css } = useFela()

  return (
    <ElementConfiguration fldKey={fldKey} />
  )
}

export default memo(StyleLayers)
