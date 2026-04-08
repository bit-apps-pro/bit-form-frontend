/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
import { atomizeCss, combineSelectors, expressAndCleanCssVars, objectToCssText, optimizeAndDefineCssClassProps } from 'atomize-css'
import { getAtom } from '../GlobalStates/BitStore'
import { $breakpointSize, $builderHelperStates, $builderSettings, $fields, $formId, $nestedLayouts, $workflows } from '../GlobalStates/GlobalStates'
import { $staticStylesState } from '../GlobalStates/StaticStylesState'
import { $darkThemeColors, $lightThemeColors } from '../GlobalStates/ThemeColorsState'
import { $themeVarsLgDark, $themeVarsLgLight, $themeVarsMdDark, $themeVarsMdLight, $themeVarsSmDark, $themeVarsSmLight } from '../GlobalStates/ThemeVarsState'
import { generateStylesWithImportantRule, mergeOtherStylesWithAtomicCSS, removeUnusedStyles } from '../components/style-new/styleHelpers'
import { getLayoutDiff, prepareLayout } from './FormBuilderHelper'
import { omitByObj } from './Helpers'
import { getObjectDiff, getOneLvlObjDiff, mergeNestedObj } from './globalHelpers'

export default function atomicStyleGenarate({ sortedLayout, atomicClassSuffix = '' }) {
  const { atomicClassPrefix, darkModeConfig } = getAtom($builderSettings)
  const { styleMergeWithAtomicClasses } = getAtom($staticStylesState)
  const nestedLayouts = getAtom($nestedLayouts)
  const { darkModeSelector, preferSystemColorScheme } = darkModeConfig
  const darkModeOnSystemPreference = preferSystemColorScheme
  const ignoreWithFallbackValues = {
    position: 'unset',
    right: 'unset',
    left: 'unset',
    'justify-content': 'initial',
    'border-style': 'medium',
    'border-width': '0',
    'background-color': 'transparent',
    'border-radius': '0',
    border: 'medium none',
    'box-shadow': 'none',
    margin: '0',
    padding: '0',
    'text-align': 'init',
    color: 'inherit',
    display: 'block',
    'flex-direction': 'row',
    'align-self': 'auto',
    width: 'auto',
  }

  const invalidPropValue = {
    'border-color': 'none',
    margin: '!important',
    paddin: '!important',
    background: '!important',
    'background-color': '!important',
    border: '!important',
    'border-style': '!important',
    'border-width': '!important',
  }

  const atomizeCssConfig = { classPrefix: atomicClassPrefix, classSuffix: atomicClassSuffix }
  const cssFilterConfig = {
    ignoreWithFallbackValues,
    invalidPropValue,
  }

  const formId = getAtom($formId)

  let atomicClassStart = 'A'

  // const layoutRowHeight = 2

  const themeColorsLight = getAtom($lightThemeColors)
  const themeColorsDark = getAtom($darkThemeColors)

  let { lgLightStyles: stylesLgLight,
    lgDarkStyles: stylesLgDark, // eslint-disable-line prefer-const
    mdLightStyles: stylesMdLight,
    mdDarkStyles: stylesMdDark, // eslint-disable-line prefer-const
    smLightStyles: stylesSmLight,
    smDarkStyles: stylesSmDark, // eslint-disable-line prefer-const
  } = removeUnusedStyles()

  // TODO: REMOVE THIS BLOCK OF CODE, IF JCOF IS REFACTORED FOR OBJECTS
  const { lgLightStyles: staticLgLightStyles, mdLightStyles: staticMdLightStyles, smLightStyles: staticSmLightStyles } = styleMergeWithAtomicClasses
  if (Array.isArray(staticLgLightStyles.form)) staticLgLightStyles.form = {}
  if (Array.isArray(staticMdLightStyles.form)) staticMdLightStyles.form = {}
  if (Array.isArray(staticSmLightStyles.form)) staticSmLightStyles.form = {}
  // *** END OF BLOCK
  stylesLgLight = mergeNestedObj(stylesLgLight, staticLgLightStyles)
  stylesMdLight = mergeNestedObj(stylesMdLight, staticMdLightStyles)
  stylesSmLight = mergeNestedObj(stylesSmLight, staticSmLightStyles)

  const themeVarsLgLight = getAtom($themeVarsLgLight)
  const themeVarsMdLight = getAtom($themeVarsMdLight)
  const themeVarsSmLight = getAtom($themeVarsSmLight)

  const themeVarsLgDark = getAtom($themeVarsLgDark)
  const themeVarsMdDark = getAtom($themeVarsMdDark)
  const themeVarsSmDark = getAtom($themeVarsSmDark)

  const { md: mdBreakpointSize, sm: smBreakpointSize } = getAtom($breakpointSize)

  // difference between main themecolor, themevar, style object and dark mode and mobo device breakpoint changes
  const lightThemeColors = themeColorsLight
  const darkThemeColors = getOneLvlObjDiff(lightThemeColors, themeColorsDark)

  const lgLightThemeVars = themeVarsLgLight
  const lgDarkThemeVars = getOneLvlObjDiff(lgLightThemeVars, themeVarsLgDark)
  const mdLightThemeVars = getOneLvlObjDiff(lgLightThemeVars, themeVarsMdLight)
  const mdDarkThemeVars = getOneLvlObjDiff({ ...lgLightThemeVars, ...lgDarkThemeVars }, themeVarsMdDark)
  const smLightThemeVars = getOneLvlObjDiff({ ...lgLightThemeVars, ...mdLightThemeVars }, themeVarsSmLight)
  const smDarkThemeVars = getOneLvlObjDiff({ ...lgLightThemeVars, ...lgDarkThemeVars, ...mdDarkThemeVars }, themeVarsSmDark)

  const lgLightStyles = stylesLgLight
  const lgDarkStyles = getObjectDiff(lgLightStyles, stylesLgDark)
  const mdLightStyles = getObjectDiff(lgLightStyles, stylesMdLight)
  const mdDarkStyles = getObjectDiff(mergeNestedObj(lgLightStyles, lgDarkStyles), stylesMdDark)
  const smLightStyles = getObjectDiff(mergeNestedObj(lgLightStyles, mdLightStyles), stylesSmLight)
  const smDarkStyles = getObjectDiff(mergeNestedObj(lgLightStyles, lgDarkStyles, mdDarkStyles), stylesSmDark)

  // generate lg light styles merged
  const allLgLightVars = { ...lgLightThemeVars, ...lightThemeColors }
  const allLgLightStyles = flatenStyleObj(lgLightStyles)
  const normalizedAllLgLightVars = expressAndCleanCssVars(allLgLightVars)
  const normalizedAllLgLightStyles = optimizeAndDefineCssClassProps(allLgLightStyles, normalizedAllLgLightVars, cssFilterConfig)
  const lgLightStylesWithImportant = generateStylesWithImportantRule(normalizedAllLgLightStyles)
  const { atomicClasses: lgLightAtomicStyles, classMaps: lgLightAtomicClassMap, nextAtomicClass: lgLightNextAtomicClass } = atomizeCss(lgLightStylesWithImportant, { ...atomizeCssConfig, atomicClassStart })
  atomicClassStart = lgLightNextAtomicClass

  // generate lg dark styles merged
  const allLgDarkVars = { ...lgLightThemeVars, ...lgDarkThemeVars, ...lightThemeColors, ...darkThemeColors }
  const allLgDarkStyles = flatenStyleObj(mergeNestedObj(lgLightStyles, lgDarkStyles))
  const normalizedAllLgDarkVars = expressAndCleanCssVars(allLgDarkVars)
  const normalizedAllLgDarkStyles = optimizeAndDefineCssClassProps(allLgDarkStyles, normalizedAllLgDarkVars, cssFilterConfig)
  const lgDarkStylesOnly = getObjectDiff(normalizedAllLgLightStyles, normalizedAllLgDarkStyles)
  const lgDarkStylesOnlyWithImportant = generateStylesWithImportantRule(lgDarkStylesOnly)
  const { atomicClasses: lgDarkAtomicStyles, classMaps: lgDarkAtomicClassMap, nextAtomicClass: lgDarkNextAtomicClass } = atomizeCss(lgDarkStylesOnlyWithImportant, { ...atomizeCssConfig, atomicClassStart })
  atomicClassStart = lgDarkNextAtomicClass

  // generate md light styles merged
  const allMdLightVars = { ...lgLightThemeVars, ...mdLightThemeVars, ...lightThemeColors }
  const allMdLightStyles = flatenStyleObj(mergeNestedObj(lgLightStyles, mdLightStyles))
  const normalizedAllMdLightVars = expressAndCleanCssVars(allMdLightVars)
  const normalizedAllMdLightStyles = optimizeAndDefineCssClassProps(allMdLightStyles, normalizedAllMdLightVars, cssFilterConfig)
  const mdLightStylesOnly = getObjectDiff(normalizedAllLgLightStyles, normalizedAllMdLightStyles)
  const mdLightStylesOnlyWithImportant = generateStylesWithImportantRule(mdLightStylesOnly)
  const { atomicClasses: mdLightAtomicStyles, classMaps: mdLightAtomicClassMap, nextAtomicClass: mdLightNextAtomicClass } = atomizeCss(mdLightStylesOnlyWithImportant, { ...atomizeCssConfig, atomicClassStart })
  atomicClassStart = mdLightNextAtomicClass

  // generate md dark styles merged
  const allMdDarkVars = { ...lgLightThemeVars, ...lgDarkThemeVars, ...mdDarkThemeVars, ...lightThemeColors, ...darkThemeColors }
  const allMdDarkStyles = flatenStyleObj(mergeNestedObj(lgLightStyles, lgDarkStyles, mdDarkStyles))
  const normalizedAllMdDarkVars = expressAndCleanCssVars(allMdDarkVars)
  const normalizedAllMdDarkStyles = optimizeAndDefineCssClassProps(allMdDarkStyles, normalizedAllMdDarkVars, cssFilterConfig)
  const mdDarkStylesOnly = getObjectDiff(mergeNestedObj(normalizedAllLgLightStyles, normalizedAllLgDarkStyles), normalizedAllMdDarkStyles)
  const mdDarkStylesOnlyWithImportant = generateStylesWithImportantRule(mdDarkStylesOnly)
  const { atomicClasses: mdDarkAtomicStyles, classMaps: mdDarkAtomicClassMap, nextAtomicClass: mdDarkNextAtomicClass } = atomizeCss(mdDarkStylesOnlyWithImportant, { ...atomizeCssConfig, atomicClassStart })
  atomicClassStart = mdDarkNextAtomicClass

  // generate sm light styles merged
  const allSmLightVars = { ...lgLightThemeVars, ...mdLightThemeVars, ...smLightThemeVars, ...lightThemeColors }
  const allSmLightStyles = flatenStyleObj(mergeNestedObj(lgLightStyles, mdLightStyles, smLightStyles))
  const normalizedAllSmLightVars = expressAndCleanCssVars(allSmLightVars)
  const normalizedAllSmLightStyles = optimizeAndDefineCssClassProps(allSmLightStyles, normalizedAllSmLightVars, cssFilterConfig)
  const smLightStylesOnly = getObjectDiff(mergeNestedObj(normalizedAllLgLightStyles, normalizedAllMdLightStyles), normalizedAllSmLightStyles)
  const smLightStylesOnlyWithImportant = generateStylesWithImportantRule(smLightStylesOnly)
  const { atomicClasses: smLightAtomicStyles, classMaps: smLightAtomicClassMap, nextAtomicClass: smLightNextAtomicClass } = atomizeCss(smLightStylesOnlyWithImportant, { ...atomizeCssConfig, atomicClassStart })
  atomicClassStart = smLightNextAtomicClass

  // generate sm dark styles merged
  const allSmDarkVars = { ...lgLightThemeVars, ...lgDarkThemeVars, ...mdDarkThemeVars, ...smDarkThemeVars, ...lightThemeColors, ...darkThemeColors }
  const allSmDarkStyles = flatenStyleObj(mergeNestedObj(lgLightStyles, lgDarkStyles, mdDarkStyles, smDarkStyles))
  const normalizedAllSmDarkVars = expressAndCleanCssVars(allSmDarkVars)
  const normalizedAllSmDarkStyles = optimizeAndDefineCssClassProps(allSmDarkStyles, normalizedAllSmDarkVars, cssFilterConfig)
  const smDarkStylesOnly = getObjectDiff(mergeNestedObj(normalizedAllLgLightStyles, normalizedAllLgDarkStyles, normalizedAllMdDarkStyles), normalizedAllSmDarkStyles)
  const smDarkStylesOnlyWithImportant = generateStylesWithImportantRule(smDarkStylesOnly)
  const { atomicClasses: smDarkAtomicStyles, classMaps: smDarkAtomicClassMap, nextAtomicClass: smDarkNextAtomicClass } = atomizeCss(smDarkStylesOnlyWithImportant, { ...atomizeCssConfig, atomicClassStart })
  atomicClassStart = smDarkNextAtomicClass

  const allMergedClassMaps = mergeNestedObj(
    lgLightAtomicClassMap,
    lgDarkAtomicClassMap,
    mdLightAtomicClassMap,
    mdDarkAtomicClassMap,
    smLightAtomicClassMap,
    smDarkAtomicClassMap,
  )

  // optimize css by combine same styles selectors
  const lgLightCombineSelectors = combineSelectors(lgLightAtomicStyles)
  const lgDarkCombinedSelectors = combineSelectors(lgDarkAtomicStyles)
  const mdLightCombinedSelectors = combineSelectors(mdLightAtomicStyles)
  const mdDarkCombinedSelectors = combineSelectors(mdDarkAtomicStyles)
  const smLightCombinedSelectors = combineSelectors(smLightAtomicStyles)
  const smDarkCombinedSelectors = combineSelectors(smDarkAtomicStyles)

  // keep all fields in lay.lg and remove same layout fields from md and sm in order to keep only different fields in md and sm
  const allSortedLayouts = Array.isArray(sortedLayout) ? sortedLayout.map(l => l.layout) : [sortedLayout]
  let sortedLayouts = {}
  if (allSortedLayouts.length > 1) {
    sortedLayouts = mergeNestedObj(...allSortedLayouts, { arrays: 'concat' })
  } else {
    [sortedLayouts] = allSortedLayouts
  }
  const simplyfiedLayout = {}
  simplyfiedLayout.lg = sortedLayouts.lg
  simplyfiedLayout.md = getLayoutDiff(sortedLayouts.lg, sortedLayouts.md)
  simplyfiedLayout.sm = getLayoutDiff(sortedLayouts.md, sortedLayouts.sm)
  const { lgLayoutStyleText, mdLayoutStyleText, smLayoutStyleText } = generateLayoutStyle(simplyfiedLayout)

  // generate css text from objects and add dark mode prefix if need
  const mdLightCssText = objectToCssText(mdLightCombinedSelectors)?.trim()
  const smLightCssText = objectToCssText(smLightCombinedSelectors)?.trim()
  const lgDarkCssText = objectToCssText(lgDarkCombinedSelectors)?.trim()
  const lgPrefixedDarkCssText = objectToCssText(addPrefixInObjectKeys(lgDarkCombinedSelectors, `${darkModeSelector} `))?.trim()
  const mdDarkCssText = objectToCssText(mdDarkCombinedSelectors)?.trim()
  const mdPrefixedDarkCssText = objectToCssText(addPrefixInObjectKeys(mdDarkCombinedSelectors, `${darkModeSelector} `))?.trim()
  const smDarkCssText = objectToCssText(smDarkCombinedSelectors)?.trim()
  const smPrefixedDarkCssText = objectToCssText(addPrefixInObjectKeys(smDarkCombinedSelectors, `${darkModeSelector} `))?.trim()

  const { sortedNestedLayouts, nestedLayoutStyleText } = generateNestedLayoutCSSText()
  const { lg: nestedLayoutLgTxt, md: nestedLayoutMdTxt, sm: nestedLayoutSmTxt } = nestedLayoutStyleText
  // concat css texts
  let cssText = generateFormGridStyle('lg', formId)
  cssText += lgLayoutStyleText
  if (nestedLayoutLgTxt) cssText += nestedLayoutLgTxt
  cssText += objectToCssText(lgLightCombineSelectors)
  if (darkModeSelector?.trim()) {
    cssText += lgPrefixedDarkCssText
  }

  if (mdLayoutStyleText || mdLightCssText || nestedLayoutMdTxt) {
    cssText += `@media (max-width:${mdBreakpointSize}px){`
    if (mdLayoutStyleText) cssText += mdLayoutStyleText
    if (nestedLayoutMdTxt) cssText += nestedLayoutMdTxt
    if (mdLightCssText) cssText += mdLightCssText
    if (darkModeSelector?.trim()) {
      cssText += mdPrefixedDarkCssText
    }
    cssText += '}'
  }

  if (smLayoutStyleText || smLightCssText || nestedLayoutSmTxt) {
    cssText += `@media (max-width:${smBreakpointSize}px){`
    if (smLayoutStyleText) cssText += smLayoutStyleText
    if (nestedLayoutSmTxt) cssText += nestedLayoutSmTxt
    if (smLightCssText) cssText += smLightCssText
    if (darkModeSelector?.trim()) {
      cssText += smPrefixedDarkCssText
    }
    cssText += '}'
  }

  if (lgDarkCssText && darkModeOnSystemPreference) cssText += `@media (prefers-color-scheme:dark){${lgDarkCssText}}`
  if (mdDarkCssText && darkModeOnSystemPreference) cssText += `@media (prefers-color-scheme:dark) and (max-width:${mdBreakpointSize}px){${mdDarkCssText}}`
  if (smDarkCssText && darkModeOnSystemPreference) cssText += `@media (prefers-color-scheme:dark) and (max-width:${smBreakpointSize}px){${smDarkCssText}}`

  const lgLightStylesWithoutMergedStyles = omitByObj(lgLightStyles, styleMergeWithAtomicClasses.lgLightStyles)
  const mdlightStylesWithoutMergedStyles = omitByObj(mdLightStyles, styleMergeWithAtomicClasses.mdLightStyles)
  const smlightStylesWithoutMergedStyles = omitByObj(smLightStyles, styleMergeWithAtomicClasses.smLightStyles)

  cssText += mergeOtherStylesWithAtomicCSS()

  return {
    atomicCssText: cssText,
    atomicClassMap: allMergedClassMaps,
    lightThemeColors,
    darkThemeColors,
    lgLightThemeVars,
    lgDarkThemeVars,
    mdLightThemeVars,
    mdDarkThemeVars,
    smLightThemeVars,
    smDarkThemeVars,
    lgLightStyles: lgLightStylesWithoutMergedStyles,
    lgDarkStyles,
    mdLightStyles: mdlightStylesWithoutMergedStyles,
    mdDarkStyles,
    smLightStyles: smlightStylesWithoutMergedStyles,
    smDarkStyles,
    nestedLayouts: sortedNestedLayouts,
  }
}

export function generateNestedLayoutCSSText() {
  const nestedLayouts = getAtom($nestedLayouts)
  const builderHelperStates = getAtom($builderHelperStates)
  const nestedLayoutStyleText = { lg: '', md: '', sm: '' }
  const nestedLayoutsArr = Object.entries(nestedLayouts || {})
  const sortedNestedLayouts = {}
  nestedLayoutsArr.forEach(([fldKey, lay]) => {
    const simplyfiedLayout = {}
    const layouts = prepareLayout(lay, builderHelperStates.respectLGLayoutOrder)
    sortedNestedLayouts[fldKey] = layouts
    simplyfiedLayout.lg = layouts.lg
    simplyfiedLayout.md = getLayoutDiff(layouts.lg, layouts.md)
    simplyfiedLayout.sm = getLayoutDiff(layouts.md, layouts.sm)
    const { lgLayoutStyleText, mdLayoutStyleText, smLayoutStyleText } = generateLayoutStyle(simplyfiedLayout)
    if (lgLayoutStyleText) nestedLayoutStyleText.lg += lgLayoutStyleText
    if (mdLayoutStyleText) nestedLayoutStyleText.md += mdLayoutStyleText
    if (smLayoutStyleText) nestedLayoutStyleText.sm += smLayoutStyleText
  })
  return { sortedNestedLayouts, nestedLayoutStyleText }
}

/*
  get only css classes from style object
*/
function flatenStyleObj(styleObj) {
  let flatedStyleObj = {}
  flatedStyleObj = styleObj?.form || {}
  const fieldKeys = Object.keys(styleObj.fields)
  const fieldKeyCount = fieldKeys.length

  flatedStyleObj = {
    ...flatedStyleObj,
    ...getConfirmationMsgStyles(styleObj), // get confirmation message styles wich are added in conditonals
  }
  for (let i = 0; i < fieldKeyCount; i += 1) {
    const fieldKey = fieldKeys[i]
    if (styleObj?.fields?.[fieldKey]?.classes) {
      flatedStyleObj = {
        ...flatedStyleObj,
        ...styleObj.fields[fieldKey].classes,
      }
    }
  }
  return flatedStyleObj
}

function getConfirmationMsgStyles(styleObj) {
  const workflows = getAtom($workflows)
  const tempStyleObj = {}
  let msgStyles = {}
  styleObj?.confirmations?.forEach(cmfObj => {
    tempStyleObj[cmfObj.confMsgId] = cmfObj.style
  })

  workflows?.forEach(workflow => {
    workflow.conditions?.forEach(condition => {
      condition.actions?.success?.forEach(conf => {
        if (conf.type === 'successMsg' && conf.details.id) {
          const msgId = JSON.parse(conf.details.id)?.id
          if (tempStyleObj[msgId]) {
            msgStyles = {
              ...msgStyles,
              ...tempStyleObj[msgId],
            }
          }
        }
      })
      if (condition.actions?.failure) {
        const msgId = JSON.parse(condition.actions?.failure)?.id
        if (tempStyleObj[msgId]) {
          msgStyles = {
            ...msgStyles,
            ...tempStyleObj[msgId],
          }
        }
      }
    })
  })
  return msgStyles
}

function getElmClassNamesByAtomicClass(atomicClasses, classMaps) {
  const atomicClassNames = Object.keys(atomicClasses)
  const atomicClassNameCount = atomicClassNames.length
  const elementClassNames = Object.keys(classMaps)
  const elementClassNameCount = elementClassNames.length

  if (!elementClassNameCount || !atomicClassNameCount) {
    return {}
  }

  const matchedElementClasses = {}

  for (let i = 0; i < atomicClassNameCount; i += 1) {
    const atomicClassName = atomicClassNames[i].substring(1)
    for (let j = 0; j < elementClassNameCount; j += 1) {
      const elementClassName = elementClassNames[j]
      if (classMaps[elementClassName]?.includes(atomicClassName)) {
        if (Array.isArray(matchedElementClasses[elementClassName])) {
          matchedElementClasses[elementClassName].push(atomicClassName)
        } else {
          matchedElementClasses[elementClassName] = [atomicClassName]
        }
      }
    }
  }
  return matchedElementClasses
}

function addPostfixToAtomicClassAndClassMaps(
  atomicClassesObj,
  classMapObj,
  postfix,
) {
  const renamedAtomicClassObj = {}
  const renamedClassMapObj = {}
  const atomicClassesNames = Object.keys(atomicClassesObj)
  const elementClassNames = Object.keys(classMapObj)

  atomicClassesNames.forEach((atomicClassName) => {
    renamedAtomicClassObj[atomicClassName + postfix] = atomicClassesObj[atomicClassName]
  })

  elementClassNames.forEach((elmClassName) => {
    renamedClassMapObj[elmClassName] = classMapObj[elmClassName]?.map(
      (atomicClassName) => atomicClassName + postfix,
    )
  })

  return [renamedAtomicClassObj, renamedClassMapObj]
}

function addPrefixInObjectKeys(obj, prefix) {
  const objKeys = Object.keys(obj)
  const newObj = {}
  objKeys.forEach((key) => {
    // if key contains , it means it has multiple selectors, so we need to add prefix to each selector
    if (key.includes(',')) {
      const splittedKeys = key.split(',').map(k => k.trim())
      const prefixedSplittedKeys = splittedKeys.map(k => prefix + k)
      newObj[prefixedSplittedKeys.join(', ')] = { ...obj[key] }
    } else {
      newObj[prefix + key] = { ...obj[key] }
    }
  })
  return newObj
}

export function generateLayoutStyle(layouts) {
  const fields = getAtom($fields)
  let lgLayoutStyleText = ''
  let mdLayoutStyleText = ''
  let smLayoutStyleText = ''

  for (let i = 0; i < layouts.lg.length; i += 1) {
    // for large screen
    const lgFld = layouts.lg[i]
    const lgClsName = lgFld.i
    const fldData = fields[lgClsName]

    const lg_g_r_s = Math.round(lgFld.y + 1)
    const lg_g_c_s = Math.round(lgFld.x + 1)
    const lg_g_r_e = Math.round(lgFld.y !== 1 ? lgFld.h + (lgFld.y + 1) : 1)
    const lg_g_c_e = Math.round((lgFld.x + 1) + lgFld.w)
    // const lg_g_r_span = lg_g_r_e - lg_g_r_s
    // const lg_g_c_span = lg_g_c_e - lg_g_c_s
    const lg_min_height = `${lgFld.h}px`

    lgLayoutStyleText += `.${lgClsName}{`
    lgLayoutStyleText += `grid-area:${lg_g_r_s}/${lg_g_c_s}/${lg_g_r_e}/${lg_g_c_e};`
    // lgLayoutStyleText += `-ms-grid-row:${lg_g_r_s};`
    // lgLayoutStyleText += `-ms-grid-row-span:${lg_g_r_span};`
    // lgLayoutStyleText += `-ms-grid-column:${lg_g_c_s};`
    // lgLayoutStyleText += `-ms-grid-column-span:${lg_g_c_span};`
    if (!fldData?.layout?.autoHeight) {
      lgLayoutStyleText += `min-height:${lg_min_height}`
    }
    lgLayoutStyleText += '}'
  }
  for (let i = 0; i < layouts.md.length; i += 1) {
    // for medium screen
    const mdFld = layouts.md[i]
    const mdClsName = mdFld.i
    const fldData = fields[mdClsName]

    const md_g_r_s = Math.round(mdFld.y + 1)
    const md_g_c_s = Math.round(mdFld.x + 1)
    const md_g_r_e = Math.round(mdFld.y !== 1 ? mdFld.h + (mdFld.y + 1) : 1)
    const md_g_c_e = Math.round((mdFld.x + 1) + mdFld.w)
    // const md_g_r_span = md_g_r_e - md_g_r_s
    // const md_g_c_span = md_g_c_e - md_g_c_s
    const md_min_height = `${mdFld.h}px`

    mdLayoutStyleText += `.${mdClsName}{`
    mdLayoutStyleText += `grid-area:${md_g_r_s}/${md_g_c_s}/${md_g_r_e}/${md_g_c_e};`
    // mdLayoutStyleText += `-ms-grid-row:${md_g_r_s};`
    // mdLayoutStyleText += `-ms-grid-row-span:${md_g_r_span};`
    // mdLayoutStyleText += `-ms-grid-column:${md_g_c_s};`
    // mdLayoutStyleText += `-ms-grid-column-span:${md_g_c_span};`
    if (!fldData?.layout?.autoHeight) {
      mdLayoutStyleText += `min-height:${md_min_height}`
    }
    mdLayoutStyleText += '}'
  }
  for (let i = 0; i < layouts.sm.length; i += 1) {
    // for small screen
    const smFld = layouts.sm[i]
    const smClsName = smFld.i
    const fldData = fields[smClsName]

    const sm_g_r_s = Math.round(smFld.y + 1)
    const sm_g_c_s = Math.round(smFld.x + 1)
    const sm_g_r_e = Math.round(smFld.y !== 1 ? smFld.h + (smFld.y + 1) : 1)
    const sm_g_c_e = Math.round((smFld.x + 1) + smFld.w)
    // const sm_g_r_span = sm_g_r_e - sm_g_r_s
    // const sm_g_c_span = sm_g_c_e - sm_g_c_s
    const sm_min_height = `${smFld.h}px`

    smLayoutStyleText += `.${smClsName}{`
    smLayoutStyleText += `grid-area:${sm_g_r_s}/${sm_g_c_s}/${sm_g_r_e}/${sm_g_c_e};`
    // smLayoutStyleText += `-ms-grid-row:${sm_g_r_s};`
    // smLayoutStyleText += `-ms-grid-row-span:${sm_g_r_span};`
    // smLayoutStyleText += `-ms-grid-column:${sm_g_c_s};`
    // smLayoutStyleText += `-ms-grid-column-span:${sm_g_c_span};`
    if (!fldData?.layout?.autoHeight) {
      smLayoutStyleText += `min-height:${sm_min_height}`
    }
    smLayoutStyleText += '}'
  }

  return {
    lgLayoutStyleText,
    mdLayoutStyleText,
    smLayoutStyleText,
  }
}

export function generateFormGridStyle(breakpoint, formId) {
  const columnRepeat = 60
  // breakpoint === 'md' && (columnRepeat = 40)
  // breakpoint === 'sm' && (columnRepeat = 20)
  let style = ''
  formId && (style += `._frm-b${formId}`)
  style += '{'
  breakpoint === 'lg' && (style += 'display:grid;')
  style += `grid-template-columns:repeat(${columnRepeat},minmax(1px,1fr))`
  style += '}'
  return style
}
