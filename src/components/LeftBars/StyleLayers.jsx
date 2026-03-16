/* eslint-disable no-param-reassign */
import { useAtomValue } from 'jotai'
import { memo } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import { $allLayouts } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import TweaksIcn from '../../Icons/TweaksIcn'
import { getFieldsBasedOnLayoutOrder } from '../../Utils/FormBuilderHelper'
import { IS_PRO, ucFirst } from '../../Utils/Helpers'
import fieldTypes from '../../Utils/StaticData/fieldTypes'
import ut from '../../styles/2.utilities'
import LayerAccordion from '../CompSettings/StyleCustomize/ChildComp/LayerAccordion'
import ProBadge from '../Utilities/ProBadge'
import { isFieldOverrideStyles, isLabelOverrideStyles } from '../style-new/styleHelpers'
import ElementConfiguration from './ElementConfiguration'
import NavBtn from './NavBtn'

function StyleLayers() {
  const { css } = useFela()
  const styles = useAtomValue($styles)
  const allLayouts = useAtomValue($allLayouts)
  const formLayouts = Array.isArray(allLayouts) ? allLayouts : [allLayouts]
  const isMultiStep = formLayouts.length > 1
  const navigate = useNavigate()
  const { formID, formType, '*': rightBar } = useParams()
  const fieldKey = rightBar.split('/')[2]
  const sortedFields = getFieldsBasedOnLayoutOrder()
  const activeFields = Object.entries(sortedFields).filter(([, fld]) => !fld.hidden)
  const showFldTitle = (typ) => ucFirst(fieldTypes[typ] || typ)
  const styleHandler = (route, fldKey = null, fldData = null) => {
    if (fldData) {
      route = (fldData.typ === 'html' || fldData.typ === 'divider') ? 'fld-wrp' : route
    }
    if (fldKey) navigate(`/form/builder/${formType}/${formID}/field-theme-customize/${route}/${fldKey}`)
    else navigate(`/form/builder/${formType}/${formID}/theme-customize/${route}`)
  }
  return (
    <div className={css(s.con)}>
      <h4 className={css(s.title)}>Elements & Layers</h4>
      <div className={css(s.divider)} />
      <Scrollbars style={{ height: 'calc(100% - 120px)' }} autoHide>
        <div className={css(s.scrollDiv)}>
          <h5 className={css(s.subtitle, ut.mt1, ut.fontH)}>Common Elements</h5>
          <NavBtn
            route="quick-tweaks"
            label={<span className={css({ fw: 500 })}>Theme Quick Tweaks</span>}
            icn={<TweaksIcn size={13} />}
          />
          <NavBtn
            route="_frm-bg"
            label="Form Wrapper"
            highlightSelector="[data-dev-_frm-bg]"
            offset="3"
          />
          <NavBtn
            route="_frm"
            label="Form Container"
            highlightSelector="[data-dev-_frm]"
            offset="3"
          />

          {isMultiStep && (
            <LayerAccordion
              childrenAccodin
              onClick={() => styleHandler('multi-step/quick-tweaks')}
              offset="6"
              title="Multi Step"
              highlightSelector="[data-dev-stp-cntnr]"
              route="multi-step/quick-tweaks"
            >
              <NavBtn
                route="multi-step/stp-hdr-wrpr"
                label="Step Header Wrapper"
                offset="3.5"
                highlightSelector="[data-dev-stp-hdr-wrpr]"
              />
              <NavBtn
                route="multi-step/stp-hdr"
                label="Step Header"
                offset="3.5"
                highlightSelector="[data-dev-stp-hdr]"
              />
              <NavBtn
                route="multi-step/stp-icn-cntn"
                label="Header Icon"
                offset="3.5"
                highlightSelector="[data-dev-stp-icn-cntn]"
              />
              <NavBtn
                route="multi-step/stp-hdr-lbl"
                label="Header Label"
                offset="3.5"
                highlightSelector="[data-dev-stp-hdr-lbl]"
              />
              <NavBtn
                route="multi-step/stp-hdr-sub-titl"
                label="Header Subtitle"
                offset="3.5"
                highlightSelector="[data-dev-stp-hdr-sub-titl]"
              />
              <NavBtn
                route="multi-step/stp-wrpr"
                label="Step Wrapper"
                offset="3.5"
                highlightSelector="[data-dev-stp-wrpr]"
              />
              <NavBtn
                route="multi-step/stp-progress-wrpr"
                label="Progress Wrapper"
                offset="3.5"
                highlightSelector="[data-dev-stp-progress-wrpr]"
              />
              <NavBtn
                route="multi-step/stp-progress-bar"
                label="Progress Bar"
                offset="3.5"
                highlightSelector="[data-dev-stp-progress-bar]"
              />
              <NavBtn
                route="multi-step/stp-cntn"
                label="Step Content"
                offset="3.5"
                highlightSelector="[data-dev-stp-cntnt]"
              />
              <NavBtn
                route="multi-step/stp-btn-wrpr"
                label="Button Wrapper"
                offset="3.5"
                highlightSelector="[data-dev-stp-btn-wrpr]"
              />
              <NavBtn
                route="multi-step/prev-step-btn"
                label="Prevous Button"
                offset="3.5"
                highlightSelector="[data-dev-prev-step-btn]"
              />
              <NavBtn
                route="multi-step/next-step-btn"
                label="Next Button"
                offset="3.5"
                highlightSelector="[data-dev-next-step-btn]"
              />
            </LayerAccordion>
          )}
          <NavBtn
            route="field-containers"
            label="Field Containers"
            highlightSelector="[data-dev-fld-wrp]"
            offset="3"
          />
          <NavBtn
            route="label-containers"
            label="Label Container(s)"
            offset="3"
            highlightSelector="[data-dev-lbl-wrp]"
          />

          <LayerAccordion
            childrenAccodin
            onClick={() => styleHandler('lbl')}
            offset="6"
            title="Label(s)"
            highlightSelector="[data-dev-lbl]"
            route="lbl"
          >
            <NavBtn
              route="lbl-pre-i"
              label="Leading Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-lbl-pre-i]"
            />
            <NavBtn
              route="lbl-suf-i"
              label="Trailing Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-lbl-suf-i]"
            />
            <NavBtn
              route="req-smbl"
              label="Asterisk Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-req-smbl]"
            />
          </LayerAccordion>

          <LayerAccordion
            childrenAccodin
            onClick={() => styleHandler('sub-titl')}
            offset="6"
            title="Subtitle(s)"
            highlightSelector="[data-dev-sub-titl]"
            route="sub-titl"
          >
            <NavBtn
              route="sub-titl-pre-i"
              label="Leading Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-sub-titl-pre-i]"
            />
            <NavBtn
              route="sub-titl-suf-i"
              label="Trailing Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-sub-titl-suf-i]"
            />
          </LayerAccordion>

          <LayerAccordion
            childrenAccodin
            onClick={() => styleHandler('fld')}
            offset="6"
            title="Input(s)"
            highlightSelector="[data-dev-fld]"
            route="fld"
          >
            <NavBtn
              route="pre-i"
              label="Leading Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-pre-i]"
            />
            <NavBtn
              route="suf-i"
              label="Trailing Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-suf-i]"
            />
          </LayerAccordion>

          <LayerAccordion
            childrenAccodin
            onClick={() => styleHandler('hlp-txt')}
            offset="6"
            title="Helper Text(s)"
            highlightSelector="[data-dev-hlp-txt]"
            route="hlp-txt"
          >
            <NavBtn
              route="hlp-txt-pre-i"
              label="Leading Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-hlp-txt-pre-i]"
            />
            <NavBtn
              route="hlp-txt-suf-i"
              label="Trailing Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-hlp-txt-suf-i]"
            />
          </LayerAccordion>

          <LayerAccordion
            route="err-msg"
            childrenAccodin
            onClick={() => styleHandler('err-msg')}
            offset="6"
            title="Error Message(s)"
            highlightSelector="[data-dev-err-msg]"
          >
            <NavBtn
              route="err-txt-pre-i"
              label="Leading Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-err-txt-pre-i]"
            />
            <NavBtn
              route="err-txt-suf-i"
              label="Trailing Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-err-txt-suf-i]"
            />
          </LayerAccordion>

          <LayerAccordion
            route="btn"
            childrenAccodin
            onClick={() => styleHandler('btn')}
            offset="6"
            title="Button(s)"
            highlightSelector="[data-dev-btn]"
          >
            <NavBtn
              route="btn-pre-i"
              label="Leading Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-btn-pre-i]"
            />
            <NavBtn
              route="btn-suf-i"
              label="Trailing Icon(s)"
              offset="3.5"
              highlightSelector="[data-dev-btn-suf-i]"
            />
          </LayerAccordion>

          <h5 className={css(s.subtitle, ut.fontH, { mt: 12 })}>
            Individual Elements
            {!IS_PRO && <ProBadge proProperty="individualStyle" />}
          </h5>

          {activeFields.map(([fldKey, fldData]) => (
            <LayerAccordion
              key={fldKey}
              onClick={() => styleHandler('quick-tweaks', fldKey, fldData)}
              title={showFldTitle(fldData.typ)}
              fldData={fldData}
              tag={fldKey}
              open={fldKey === fieldKey}
              highlightSelector={`[data-dev-fld-wrp="${fldKey}"]`}
              styleOverride={isFieldOverrideStyles(styles, fldKey)}
            >
              {!fldData.typ.match(/^(title|image|html|divider)$/gi) && (
                <NavBtn
                  subRoute={fldKey}
                  route="quick-tweaks"
                  label="Quick Tweaks"
                  offset="2.5"
                  highlightSelector={`[data-dev-fld-wrp="${fldKey}"]`}
                />
              )}
              {fldData.typ !== 'paypal' && (
                <NavBtn
                  subRoute={fldKey}
                  route="fld-wrp"
                  label="Field Container"
                  offset="2.5"
                  highlightSelector={`[data-dev-fld-wrp="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'fld-wrp')}
                />
              )}
              <ElementConfiguration fldKey={fldKey} />
              {fldData.typ.match(/^(check|radio|decision-box|gdpr)/gi) && (
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="cc"
                    label="Check Container"
                    offset="2.5"
                    highlightSelector={`[data-dev-cc="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'cc')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="ct"
                    label="Option Label"
                    offset="2.5"
                    highlightSelector={`[data-dev-ct="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'ct')}
                  />
                </>
              )}
              {fldData.typ.match(/^(check|radio)$/gi) && (
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="cw"
                    label="Check Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-cw="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'cw')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="cl"
                    label="Option Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-cl="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'cl')}
                  />
                </>
              )}

              {fldData.typ.match(/(check|decision-box|radio|gdpr)/gi) && (
                <NavBtn
                  subRoute={fldKey}
                  route="bx"
                  label={fldData.typ === 'radio' ? 'Radio Box' : 'Check Box'}
                  offset="2.5"
                  highlightSelector={`[data-dev-bx="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'bx')}
                />
              )}

              {fldData.typ.match(/(check|radio)/gi) && (
                <NavBtn
                  subRoute={fldKey}
                  route="other-inp"
                  label="Other Option Input"
                  offset="2.5"
                  highlightSelector={`[data-dev-other-inp="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'other-inp')}
                />
              )}

              {fldData.typ === 'stripe' && (
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="stripe-btn"
                    label="Stripe Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-stripe-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'stripe-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="stripe-icn"
                    label="Stripe Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-stripe-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'stripe-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="stripe-pay-btn"
                    label="Stripe Pay Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-stripe-pay-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'stripe-pay-btn')}
                  />
                </>
              )}
              {fldData.typ === 'mollie' && (
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="mollie-btn"
                    label="Mollie Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-mollie-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'mollie-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="mollie-icn"
                    label="Mollie Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-mollie-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'mollie-icn')}
                  />
                </>
              )}

              {fldData.typ === 'razorpay' && (
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="razorpay-btn"
                    label="Razorpay Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-razorpay-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'razorpay-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="razorpay-btn-text"
                    label="Button Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-razorpay-btn-text="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'razorpay-btn-text')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="razorpay-btn-title"
                    label="Button Title"
                    offset="2.5"
                    highlightSelector={`[data-dev-razorpay-btn-title="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'razorpay-btn-title')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="razorpay-btn-sub-title"
                    label="Button Subtitle"
                    offset="2.5"
                    highlightSelector={`[data-dev-razorpay-btn-sub-title="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'razorpay-btn-sub-title')}
                  />
                </>
              )}

              {fldData.typ === 'currency' && (
                // currency field
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="currency-fld-wrp"
                    label="Currency Field Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-currency-fld-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'currency-fld-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="dpd-wrp"
                    label="Dropdown Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-dpd-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'dpd-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="selected-currency-img"
                    label="Selected Currency Image"
                    offset="2.5"
                    highlightSelector={`[data-dev-selected-currency-img="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'selected-currency-img')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="currency-amount-input"
                    label="Currency Amount Input"
                    offset="2.5"
                    highlightSelector={`[data-dev-currency-amount-input="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'currency-amount-input')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="input-clear-btn"
                    label="Input Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-input-clear-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'input-clear-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-wrp"
                    label="Option Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-search-wrp"
                    label="Option Search Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-search-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-search-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-search-icn"
                    label="Option Search Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-search-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-search-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-search-input"
                    label="Option Search Input"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-search-input="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-search-input')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="search-clear-btn"
                    label="Search Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-search-clear-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'search-clear-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-list"
                    label="Option List"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-list="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-list')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option"
                    label="Currency Option"
                    offset="2.5"
                    highlightSelector={`[data-dev-option="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-lbl-wrp"
                    label="Currency Option Label Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-lbl-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-lbl-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-icn"
                    label="Currency Option Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-lbl"
                    label="Currency Option Label"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-lbl="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-lbl')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-suffix"
                    label="Currency Option Trailing"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-suffix="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-suffix')}
                  />
                </>
              )}
              {fldData.typ === 'phone-number' && (
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="phone-fld-wrp"
                    label="Phone Field Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-phone-fld-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'phone-fld-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="dpd-wrp"
                    label="Dropdown Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-dpd-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'dpd-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="selected-country-img"
                    label="Selected Country Image"
                    offset="2.5"
                    highlightSelector={`[data-dev-selected-phone-img="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'phone-selected-country-img')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="phone-number-input"
                    label="Phone Number Input"
                    offset="2.5"
                    highlightSelector={`[data-dev-phone-number-input="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'phone-number-input')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="input-clear-btn"
                    label="Input Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-input-clear-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'phone-input-clear-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-wrp"
                    label="Option Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-search-wrp"
                    label="Option Search Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-search-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-search-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-search-icn"
                    label="Option Search Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-search-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'phone-opt-search-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-search-input"
                    label="Option Search Input"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-search-input="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'phone-opt-search-input')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="search-clear-btn"
                    label="Search Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-search-clear-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'phone-search-clear-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-list"
                    label="Option List"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-list="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-list')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option"
                    label="Phone Number Option"
                    offset="2.5"
                    highlightSelector={`[data-dev-option="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-lbl-wrp"
                    label="Option Label Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-lbl-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-lbl-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-icn"
                    label="Phone Option Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-lbl"
                    label="Phone Option Label"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-lbl="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-lbl')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-suffix"
                    label="Phone Option Suffix"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-suffix="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-suffix')}
                  />
                </>
              )}
              {fldData.typ === 'country' && (
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="country-fld-wrp"
                    label="Country Field Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-country-fld-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'country-fld-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="selected-country-img"
                    label="Selected Country Image"
                    offset="2.5"
                    highlightSelector={`[data-dev-selected-country-img="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'selected-country-img')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="selected-country-lbl"
                    label="Selected Country Label"
                    offset="2.5"
                    highlightSelector={`[data-dev-selected-country-lbl="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'selected-country-lbl')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="inp-clr-btn"
                    label="Input Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-inp-clr-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'inp-clr-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-wrp"
                    label="Option Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-search-wrp"
                    label="Option Search Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-search-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-search-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-search-icn"
                    label="Option Search Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-search-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-search-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-search-input"
                    label="Option Search Input"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-search-input="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-search-input')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="search-clear-btn"
                    label="Search Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-search-clear-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'search-clear-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-list"
                    label="Option List"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-list="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-list')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option"
                    label="Country Option"
                    offset="2.5"
                    highlightSelector={`[data-dev-option="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-lbl-wrp"
                    label="Option Label Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-lbl-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-lbl-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-icn"
                    label="Country Option Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-lbl"
                    label="Country Option Label"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-lbl="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-lbl')}
                  />
                </>
              )}
              {fldData.typ === 'select' && (
                <>
                  <NavBtn
                    subRoute={fldKey}
                    route="dpd-fld-wrp"
                    label="Dropdown Field Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-dpd-fld-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'dpd-fld-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="dpd-wrp"
                    label="Dropdown Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-dpd-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'dpd-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="selected-opt-img"
                    label="Selected Option Image"
                    offset="2.5"
                    highlightSelector={`[data-dev-selected-opt-img="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'selected-opt-img')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="selected-opt-lbl"
                    label="Selected Option Label"
                    offset="2.5"
                    highlightSelector={`[data-dev-selected-opt-lbl="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'selected-opt-lbl')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="selected-opt-clear-btn"
                    label="Input Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-selected-opt-clear-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'selected-opt-clear-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-wrp"
                    label="Option Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-search-wrp"
                    label="Option Search Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-search-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-search-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-search-input"
                    label="Option Search Input"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-search-input="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-search-input')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-search-icn"
                    label="Option Search Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-search-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-search-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="search-clear-btn"
                    label="Search Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-search-clear-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'search-clear-btn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option-list"
                    label="Option List"
                    offset="2.5"
                    highlightSelector={`[data-dev-option-list="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option-list')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="option"
                    label="Option"
                    offset="2.5"
                    highlightSelector={`[data-dev-option="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'option')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-lbl-wrp"
                    label="Option Label Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-lbl-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-lbl-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-icn"
                    label="Option Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="opt-lbl"
                    label="Option Label"
                    offset="2.5"
                    highlightSelector={`[data-dev-opt-lbl="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'opt-lbl')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="chip-wrp"
                    label="Chip Wrapper"
                    offset="2.5"
                    highlightSelector={`[data-dev-chip-wrp="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'chip-wrp')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="chip-icn"
                    label="Chip Icon"
                    offset="2.5"
                    highlightSelector={`[data-dev-chip-icn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'chip-icn')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="chip-lbl"
                    label="Chip Label"
                    offset="2.5"
                    highlightSelector={`[data-dev-chip-lbl="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'chip-lbl')}
                  />
                  <NavBtn
                    subRoute={fldKey}
                    route="chip-clear-btn"
                    label="Chip Clear Button"
                    offset="2.5"
                    highlightSelector={`[data-dev-chip-clear-btn="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'chip-clear-btn')}
                  />
                </>
              )}
              {!fldData.typ.match(/^(button|divider|spacer|title|image|html|razorpay|paypal|recaptcha|section|repeater|turnstile|hcaptcha)$/) && (
                <NavBtn
                  subRoute={fldKey}
                  route="err-msg"
                  label="Error Message"
                  offset="2.5"
                  highlightSelector={`[data-dev-err-msg="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'err-msg')}
                />
              )}
            </LayerAccordion>
          ))}
        </div>
      </Scrollbars>
    </div>
  )
}

export default memo(StyleLayers)

const s = {
  con: {
    ff: 'Roboto, sans-serif',
    mxw: 250,
    h: '100%',
    bs: '0 0 0 1px var(--b-44-87)',
    ow: 'hidden',
    '& .toggle-icn': { oy: '0' },
    ':hover': { '& .toggle-icn': { oy: '1' } },
  },
  title: {
    ff: '"Outfit", sans-serif',
    mt: 7,
    bs: 'none',
    mb: 10,
    mx: 8,
    wb: 'keep-all',
    ws: 'nowrap',
  },
  subtitle: {
    mx: 8,
    mb: 8,
    fs: 14,
    fw: 500,
    cr: '#9a9fb9',
    wb: 'keep-all',
    ws: 'nowrap',
  },

  scrollDiv: { ow: 'hidden', mb: 300 },
  divider: { bb: '1px solid var(--white-0-83)' },
}
