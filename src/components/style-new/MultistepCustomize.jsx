import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $builderRightPanelScroll, $flags } from '../../GlobalStates/GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import RightPanelTopBar from '../UIv3/CompSettings/RightPanelTopBar'
import StyleSectionHeader from '../UIv3/CompSettings/StyleCustomize/StyleSectionHeader'
import MultiStepCommonStyle from './MultiStepCommonStyle'

export default function MultiStepCustomize() {
  const { css } = useFela()
  const { formType, formID, element } = useParams()
  const setFlags = useSetAtom($flags)
  const scrollTo = useAtomValue($builderRightPanelScroll)

  useEffect(() => {
    setFlags(oldFlgs => ({ ...oldFlgs, styleMode: true }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const genarateTitle = () => {
    const title = {
      'quick-tweaks': __('Multi Step Quick Tweaks'),
      'stp-cntnr': __('Step Container'),
      'stp-hdr-wrpr': __('Step Header Wrapper'),
      'stp-hdr': __('Step Header'),
      'stp-icn-cntn': __('Step Icon'),
      'stp-hdr-lbl': __('Step Header Label'),
      'stp-hdr-sub-titl': __('Step Header Subtitle'),
      'stp-wrpr': __('Step Wrapper'),
      'stp-progress-wrpr': __('Step Progress Wrapper'),
      'stp-progress-bar': __('Step Progress Bar'),
      'stp-cntnt': __('Step Content'),
      'stp-btn-wrpr': __('Step Button Wrapper'),
      'stp-btn': __('Step Button'),
      'stp-lbl-pre-i': __('Step Label Prefix Icon'),
      'stp-lbl-suf-i': __('Step Label Suffix Icon'),
      'stp-sub-titl-pre-i': __('Step Subtitle Prefix Icon'),
      'stp-sub-titl-suf-i': __('Step Subtitle Suffix Icon'),
      'prev-step-btn-pre-i': __('Previous Button Prefix Icon'),
      'prev-step-btn-suf-i': __('Previous Button Suffix Icon'),
      'next-step-btn-pre-i': __('Next Button Prefix Icon'),
      'next-step-btn-suf-i': __('Next Button Suffix Icon'),

    }
    return title[element] || __('Theme Customization')
  }

  return (
    <div className={css(cls.mainWrapper)}>
      <RightPanelTopBar title={__('Multi Step Customize')} />
      <div className={css(cls.contentWrapper)}>

        <StyleSectionHeader
          title={genarateTitle()}
          isCommon
          highlightSelector={`[data-dev-${element}]`}
        />
        <div className={css(cls.wrp)}>
          {element === 'quick-tweaks' && <span>{__('Multi step quick tweaks is not available. this feature will coming soon.')}</span>}
          {element !== 'quick-tweaks' && <MultiStepCommonStyle element={element} isMultistep />}
        </div>
      </div>
    </div>
  )
}

const cls = {
  title: { mt: 5, mb: 2, fs: 18 },
  breadcumbLink: { fs: 11, flxi: 'center', mr: 3, ':focus': { bs: 'none' } },
  l1: { cr: 'var(--white-0-61)', ':hover': { textDecoration: 'underline !important' } },
  l2: { cr: 'var(--white-0-21)' },
  wrp: { ml: 5, mr: 8, mt: 10, fs: 12 },
  mainWrapper: {
    bd: 'var(--white-100)',
  },
  contentWrapper: {
    p: '15px 20px',
  },
  subTitle: { mt: 10, mb: 5, fs: 15, cr: 'var(--white-0-31)' },
  divider: { bb: '1px solid var(--white-0-83)', mx: 3, my: 10 },
  thmBtn: {
    flxi: 'center',
    cg: 4,
    h: 30,
    ws: 'nowrap',
    fs: 12,
    fw: 500,
    b: 'none',
    bd: 'transparent',
    curp: 1,
    py: 8,
    px: 15,
    brs: 20,
    pn: 'relative',
    ':hover:not([data-active="true"])': { bd: 'var(--b-79-96)' },
  },
  clrActive: {
    bd: 'var(--b-50)',
    cr: 'var(--white-100)',
  },
}
