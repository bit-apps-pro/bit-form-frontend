import { useAtomValue } from 'jotai'
import { useNavigate, useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import LayerAccordion from '../CompSettings/StyleCustomize/ChildComp/LayerAccordion'
import { isLabelOverrideStyles, styleClasses } from '../style-new/styleHelpers'
import NavBtn from './NavBtn'

export default function ElementConfiguration({ fldKey }) {
  const styles = useAtomValue($styles)
  const { formType, formID } = useParams()
  const navigate = useNavigate()

  const fields = useAtomValue($fields)
  const fieldObj = fields[fldKey]

  const selectedFieldKey = useAtomValue($selectedFieldId)

  const styleHandler = (route) => {
    navigate(`/form/builder/${formType}/${formID}/field-theme-customize/${route}/${fldKey}`)
  }
  // console.log('fieldObj', fieldObj)
  return (

    <>
      {fieldObj.logo && (
        <NavBtn
          cssSelector={`.${fldKey}-${styleClasses.logo[0]}`}
          subRoute={fldKey}
          route="logo"
          label="Logo"
          offset="2.5"
          highlightSelector={`[data-dev-logo="${fldKey}"]`}
          styleOverride={isLabelOverrideStyles(styles, fldKey, 'logo')}
        />
      )}
      {(fieldObj.typ === 'title' && (fieldObj.title || fieldObj.titlePreIcn || fieldObj.titleSufIcn || fieldObj.subtitle || fieldObj.subTitlPreIcn || fieldObj.subTitlSufIcn))
        && (
          <NavBtn
            cssSelector={`.${fldKey}-titl-wrp`}
            subRoute={fldKey}
            route="titl-wrp"
            label="Title Container"
            offset="2.5"
            highlightSelector={`[data-dev-titl-wrp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'titl-wrp')}
          />
        )}
      {(fieldObj.title || fieldObj.titlePreIcn || fieldObj.titleSufIcn)
        && (
          <>
            {!(fieldObj.titlePreIcn || fieldObj.titleSufIcn) && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.title[0]}`}
                subRoute={fldKey}
                route="title"
                label="Title"
                offset="2.5"
                highlightSelector={`[data-dev-title="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'title')}
              />
            )}
            {(fieldObj.titlePreIcn || fieldObj.titleSufIcn) && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('title')}
                offset="3.1"
                title="Title"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey && (fieldObj.titlePreIcn || fieldObj.titleSufIcn)}
                highlightSelector={`[data-dev-title="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'title')}
              >
                {fieldObj.titlePreIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.titlePreIcn[0]}`}
                    subRoute={fldKey}
                    route="title-pre-i"
                    label="Leading Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-title-pre-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'title-pre-i')}
                  />
                )}
                {fieldObj.titleSufIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.titleSufIcn[0]}`}
                    subRoute={fldKey}
                    route="title-suf-i"
                    label="Trailing Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-title-suf-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'title-suf-i')}
                  />
                )}
              </LayerAccordion>
            )}
          </>
        )}
      {
        ((fieldObj.lbl || fieldObj.lblPreIcn || fieldObj.lblSufIcn || fieldObj.subtitle || fieldObj.subTlePreIcn || fieldObj.subTleSufIcn) && fieldObj.typ !== 'title')
        && (
          <NavBtn
            cssSelector={`.${fldKey}-${styleClasses.lbl[0]}`}
            subRoute={fldKey}
            route="lbl-wrp"
            label="Label Container"
            offset="2.5"
            highlightSelector={`[data-dev-lbl-wrp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'lbl-wrp')}
          />
        )
      }

      {(fieldObj.lbl || fieldObj.lblPreIcn || fieldObj.lblSufIcn) && !fieldObj.typ.match(/^(decision-box|gdpr|razorpay|paypal)$/gi)?.[0] && (
        <>
          {!(fieldObj.lblPreIcn || fieldObj.lblSufIcn || (fieldObj.valid.req && fieldObj.valid.reqShow)) && (
            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.lbl[1]}`}
              subRoute={fldKey}
              route="lbl"
              label="Label"
              offset="2.5"
              highlightSelector={`[data-dev-lbl="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'lbl')}
            />
          )}
          {(fieldObj.lblPreIcn || fieldObj.lblSufIcn || (fieldObj.valid.req && fieldObj.valid.reqShow)) && (
            <LayerAccordion
              childrenAccodin
              onClick={() => styleHandler('lbl')}
              offset="3.1"
              title="Label"
              fldData={fieldObj}
              key={fldKey}
              open={fldKey === selectedFieldKey && (fieldObj.lblPreIcn || fieldObj.lblSufIcn)}
              highlightSelector={`[data-dev-lbl="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'lbl')}
            >
              {fieldObj.lblPreIcn && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.lblPreIcn[0]}`}
                  subRoute={fldKey}
                  route="lbl-pre-i"
                  label="Leading Icon"
                  offset="3.3"
                  highlightSelector={`[data-dev-lbl-pre-i="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'lbl-pre-i')}
                />
              )}
              {fieldObj.lblSufIcn && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.lblSufIcn[0]}`}
                  subRoute={fldKey}
                  route="lbl-suf-i"
                  label="Trailing Icon"
                  offset="3.3"
                  highlightSelector={`[data-dev-lbl-suf-i="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'lbl-suf-i')}
                />
              )}
              {(fieldObj.valid.req && fieldObj.valid.reqShow) && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.reqSmbl[0]}`}
                  subRoute={fldKey}
                  route="req-smbl"
                  label="Asterisk"
                  offset="3.3"
                  highlightSelector={`[data-dev-req-smbl="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'req-smbl')}
                />
              )}
            </LayerAccordion>
          )}
        </>
      )}
      {(fieldObj.subtitle || fieldObj.subTlePreIcn || fieldObj.subTleSufIcn || fieldObj.subTitlPreIcn || fieldObj.subTitlSufIcn)
        && (
          <>
            {!(fieldObj.subTlePreIcn || fieldObj.subTleSufIcn || fieldObj.subTitlPreIcn || fieldObj.subTitlSufIcn) && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.subTitl[0]}`}
                subRoute={fldKey}
                route="sub-titl"
                label="Subtitle"
                offset="2.5"
                highlightSelector={`[data-dev-sub-titl="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'sub-titl')}
              />
            )}
            {(fieldObj.subTlePreIcn || fieldObj.subTleSufIcn || fieldObj.subTitlPreIcn || fieldObj.subTitlSufIcn) && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('sub-titl')}
                offset="3.1"
                title="Subtitle"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey && (fieldObj.subTlePreIcn || fieldObj.subTleSufIcn || fieldObj.subTitlPreIcn || fieldObj.subTitlSufIcn)}
                highlightSelector={`[data-dev-sub-titl="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'sub-titl')}
              >
                {(fieldObj.subTlePreIcn || fieldObj.subTitlPreIcn) && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.subTlePreIcn[0]}`}
                    subRoute={fldKey}
                    route="sub-titl-pre-i"
                    label="Leading Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-sub-titl-pre-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'sub-titl-pre-i')}
                  />
                )}
                {(fieldObj.subTleSufIcn || fieldObj.subTitlSufIcn) && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.subTleSufIcn[0]}`}
                    subRoute={fldKey}
                    route="sub-titl-suf-i"
                    label="Trailing Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-sub-titl-suf-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'sub-titl-suf-i')}
                  />
                )}
              </LayerAccordion>
            )}
          </>
        )}
      {fieldObj.divider && (
        <NavBtn
          cssSelector={`.${fldKey}-${styleClasses.divider[0]}`}
          subRoute={fldKey}
          route="divider"
          label="Divider"
          offset="2.5"
          highlightSelector={`data-dev-divider="${fldKey}"`}
          styleOverride={isLabelOverrideStyles(styles, fldKey, 'divider')}
        />
      )}
      {fieldObj.img && (
        <NavBtn
          cssSelector={`.${fldKey}-${styleClasses.image[0]}`}
          subRoute={fldKey}
          route="img"
          label="Image"
          offset="2.5"
          highlightSelector={`[data-dev-img="${fldKey}"]`}
          styleOverride={isLabelOverrideStyles(styles, fldKey, 'image')}
        />
      )}
      {fieldObj.typ.match(/^(text|number|password|username|email|url|date|datetime-local|time|month|week|color|textarea|range|hidden|advanced-datetime|)$/)
        && (
          <>
            {!(fieldObj.prefixIcn || fieldObj.suffixIcn) && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.fld[0]}`}
                subRoute={fldKey}
                route="fld"
                label="Input"
                offset="2.5"
                highlightSelector={`[data-dev-fld="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'fld')}
              />
            )}
            {(fieldObj.prefixIcn || fieldObj.suffixIcn) && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('fld')}
                offset="3.1"
                title="Input"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey && (fieldObj.prefixIcn || fieldObj.suffixIcn)}
                highlightSelector={`[data-dev-fld="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'fld')}
              >
                {fieldObj.prefixIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.prefixIcn[0]}`}
                    subRoute={fldKey}
                    route="pre-i"
                    label="Leading Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-pre-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'pre-i')}
                  />
                )}
                {fieldObj.suffixIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.suffixIcn[0]}`}
                    subRoute={fldKey}
                    route="suf-i"
                    label="Trailing Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-suf-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'suf-i')}
                  />
                )}
              </LayerAccordion>
            )}
          </>
        )}
      {fieldObj.typ.match(/^(html-select|)$/)
        && (
          <>
            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.fld[0]}`}
              subRoute={fldKey}
              route="fld"
              label="Select"
              offset="2.5"
              highlightSelector={`[data-dev-fld="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'fld')}
            />
            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.prefixIcn[0]}`}
              subRoute={fldKey}
              route="slct-optn"
              label="Options"
              offset="2.5"
              highlightSelector={`[data-dev-slct-optn="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'slct-optn')}
            />
            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.prefixIcn[0]}`}
              subRoute={fldKey}
              route="slct-opt-grp"
              label="Options Group"
              offset="2.5"
              highlightSelector={`[data-dev-slct-opt-grp="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'slct-opt-grp')}
            />
          </>
        )}
      {
        fieldObj.typ.match(/^(advanced-file-up)/) && (
          <LayerAccordion
            childrenAccodin
            onClick={() => styleHandler('filepond--drop-label')}
            offset="3.5"
            title="File Upload Field"
            fldData={fieldObj}
            key={fldKey}
            open={fldKey === selectedFieldKey && (fieldObj.prefixIcn || fieldObj.suffixIcn)}
            highlightSelector={`[data-dev-filepond--drop-label="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--drop-label')}
          >
            {/* <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
              subRoute={fldKey}
              route="filepond--root"
              label="Root"
              offset="3.1"
              highlightSelector={`[data-dev-filepond--root="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--root')}
            /> */}
            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
              subRoute={fldKey}
              route="filepond--drop-label"
              label="Drop Label"
              offset="3.1"
              highlightSelector={`[data-dev-filepond--drop-label="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--drop-label')}
            />

            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
              subRoute={fldKey}
              route="filepond--label-action"
              label="Label Action"
              offset="3.1"
              highlightSelector={`[data-dev-filepond--label-action="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--label-action')}
            />

            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
              subRoute={fldKey}
              route="filepond--panel-root"
              label="Paenl Root"
              offset="3.1"
              highlightSelector={`[data-dev-filepond--panel-root="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--panel-root')}
            />

            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
              subRoute={fldKey}
              route="filepond--item-panel"
              label="Item Panel"
              offset="3.1"
              highlightSelector={`[data-dev-filepond--item-panel="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--item-panel')}
            />

            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
              subRoute={fldKey}
              route="filepond--file-action-button"
              label="File Action Button"
              offset="3.1"
              highlightSelector={`[data-dev-filepond--file-action-button="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--file-action-button')}
            />

            {/* <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
              subRoute={fldKey}
              route="filepond--drip-blob"
              label="Drip Blob"
              offset="3.1"
              highlightSelector={`[data-dev-filepond--drip-blob="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--drip-blob')}
            /> */}

            <NavBtn
              cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
              subRoute={fldKey}
              route="filepond--file"
              label="File"
              offset="3.1"
              highlightSelector={`[data-dev-filepond--file="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'filepond--file')}
            />

          </LayerAccordion>
        )
      }
      {
        fieldObj.typ.match(/^(file-up)/) && (
          <>
            <NavBtn
              cssSelector={`.${fldKey}-file-up-wrpr`}
              subRoute={fldKey}
              route="file-up-wrpr"
              label="Input Container"
              offset="2.5"
              highlightSelector={`[data-dev-file-up-wrpr="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'file-up-wrpr')}
            />
            <LayerAccordion
              childrenAccodin
              onClick={() => styleHandler('inp-btn')}
              offset="3.5"
              title="Button"
              fldData={fieldObj}
              key={`inp-${fldKey}`}
              open={fldKey === selectedFieldKey && (fieldObj.prefixIcn || fieldObj.suffixIcn)}
              highlightSelector={`[data-dev-inp-btn="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'inp-btn')}
            >
              {fieldObj.prefixIcn && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.prefixIcn[0]}`}
                  subRoute={fldKey}
                  route="pre-i"
                  label="Leading Icon"
                  offset="3.1"
                  highlightSelector={`[data-dev-pre-i="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'pre-i')}
                />
              )}
              {fieldObj.btnTxt && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.btnTxt[0]}`}
                  subRoute={fldKey}
                  route="btn-txt"
                  label="Text"
                  offset="3.1"
                  highlightSelector={`[data-dev-btn-txt="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'btn-txt')}
                />
              )}
              {fieldObj.suffixIcn && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.suffixIcn[0]}`}
                  subRoute={fldKey}
                  route="suf-i"
                  label="Trailing Icon"
                  offset="3.1"
                  highlightSelector={`[data-dev-suf-i="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'suf-i')}
                />
              )}
            </LayerAccordion>
            {fieldObj.config.showSelectStatus && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.fileSelectStatus[0]}`}
                subRoute={fldKey}
                route="file-select-status"
                label="File Select Status"
                offset="2.5"
                highlightSelector={`[data-dev-file-select-status="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'file-select-status')}
              />
            )}
            {fieldObj.config.showMaxSize && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.maxSizeLbl[0]}`}
                subRoute={fldKey}
                route="max-size-lbl"
                label="Max Size Label"
                offset="2.5"
                highlightSelector={`[data-dev-max-size-lbl="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'max-size-lbl')}
              />
            )}

            {fieldObj.config.showFileList && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('files-list')}
                offset="3.5"
                title="Files list"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey}
                highlightSelector={`[data-dev-files-list="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'files-list')}
              >
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.fileWpr[0]}`}
                  subRoute={fldKey}
                  route="file-wrpr"
                  label="File Wrapper"
                  offset="3.1"
                  highlightSelector={`[data-dev-file-wrpr="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'file-wrpr')}
                />

                {fieldObj.config.showFilePreview && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.filePreview[0]}`}
                    subRoute={fldKey}
                    route="file-preview"
                    label="File Preview"
                    offset="3.1"
                    highlightSelector={`[data-dev-file-preview="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'file-preview')}
                  />
                )}
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.fileTitl[0]}`}
                  subRoute={fldKey}
                  route="file-title"
                  label="File Title"
                  offset="3.1"
                  highlightSelector={`[data-dev-file-title="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'file-title')}
                />
                {fieldObj.config.showFileSize && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.fileSize[0]}`}
                    subRoute={fldKey}
                    route="file-size"
                    label="File Size"
                    offset="3.1"
                    highlightSelector={`[data-dev-file-size="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'file-size')}
                  />
                )}
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.crossBtn[0]}`}
                  subRoute={fldKey}
                  route="cross-btn"
                  label="Cross Button"
                  offset="3.1"
                  highlightSelector={`[data-dev-cross-btn="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'cross-btn')}
                />
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.errWrp[0]}`}
                  subRoute={fldKey}
                  route="err-wrp"
                  label="Warning/Invalid"
                  offset="3.1"
                  highlightSelector={`[data-dev-err-wrp="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'err-wrp')}
                />
              </LayerAccordion>
            )}
          </>
        )
      }
      {fieldObj.typ.match(/^(button|)$/)
        && (
          <>
            {!(fieldObj.btnPreIcn || fieldObj.btnSufIcn) && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
                subRoute={fldKey}
                route="btn"
                label="Button"
                offset="2.5"
                highlightSelector={`[data-dev-btn="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'btn')}
              />
            )}
            {(fieldObj.btnPreIcn || fieldObj.btnSufIcn) && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('btn')}
                offset="3.1"
                title="Button"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey && (fieldObj.btnPreIcn || fieldObj.btnSufIcn)}
                highlightSelector={`[data-dev-btn="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'btn')}
              >
                {fieldObj.btnPreIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.btnPreIcn[0]}`}
                    subRoute={fldKey}
                    route="btn-pre-i"
                    label="Leading Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-btn-pre-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'btn-pre-i')}
                  />
                )}
                {fieldObj.btnSufIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.btnSufIcn[0]}`}
                    subRoute={fldKey}
                    route="btn-suf-i"
                    label="Trailing Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-btn-suf-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'btn-suf-i')}
                  />
                )}
              </LayerAccordion>
            )}
          </>
        )}
      {fieldObj.typ.match(/^(section|repeater)$/gi) && (
        <NavBtn
          subRoute={fldKey}
          route="inp-fld-wrp"
          label="Inner Fields Container"
          offset="2.5"
          highlightSelector={`[data-dev-inp-fld-wrp="${fldKey}"]`}
        />
      )}
      {fieldObj.typ === 'rating' && (
        <>
          <NavBtn
            subRoute={fldKey}
            route="inp-fld-wrp"
            label="Field Wrapper"
            offset="2.5"
            highlightSelector={`[data-dev-inp-fld-wrp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'inp-fld-wrp')}
          />
          <NavBtn
            subRoute={fldKey}
            route="rating-img"
            label="Rating Image"
            offset="2.5"
            highlightSelector={`[data-dev-rating-img="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'rating-img')}
          />
          <NavBtn
            subRoute={fldKey}
            route="rating-msg"
            label="Rating Message"
            offset="2.5"
            highlightSelector={`[data-dev-rating-msg="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'rating-msg')}
          />
        </>
      )}

      {fieldObj.typ === 'image-select' && (
        <>
          <NavBtn
            subRoute={fldKey}
            route="ic"
            label="Field Wrapper"
            offset="2.5"
            highlightSelector={`[data-dev-ic="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'ic')}
          />
          <NavBtn
            subRoute={fldKey}
            route="inp-opt"
            label="Image Option"
            offset="2.5"
            highlightSelector={`[data-dev-inp-opt="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'inp-opt')}
          />

          <NavBtn
            subRoute={fldKey}
            route="img-inp"
            label="Input"
            offset="2.5"
            highlightSelector={`[data-dev-img-inp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'img-inp')}
          />
          <NavBtn
            subRoute={fldKey}
            route="img-wrp"
            label="Image Wrapper"
            offset="2.5"
            highlightSelector={`[data-dev-img-wrp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'img-wrp')}
          />
          <NavBtn
            subRoute={fldKey}
            route="check-box"
            label="Check Box"
            offset="2.5"
            highlightSelector={`[data-dev-check-box="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'check-box')}
          />
          <NavBtn
            subRoute={fldKey}
            route="check-img"
            label="Check Box Image"
            offset="2.5"
            highlightSelector={`[data-dev-check-img="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'check-img')}
          />
          <NavBtn
            subRoute={fldKey}
            route="img-card-wrp"
            label="Image Container"
            offset="2.5"
            highlightSelector={`[data-dev-img-card-wrp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'img-card-wrp')}
          />
          <NavBtn
            subRoute={fldKey}
            route="select-img"
            label="Image"
            offset="2.5"
            highlightSelector={`[data-dev-select-img="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'select-img')}
          />
          {!fieldObj.optLblHide && (
            <>
              <NavBtn
                subRoute={fldKey}
                route="tc"
                label="Image Label Container"
                offset="2.5"
                highlightSelector={`[data-dev-tc="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'tc')}
              />
              <NavBtn
                subRoute={fldKey}
                route="img-title"
                label="Image Label"
                offset="2.5"
                highlightSelector={`[data-dev-img-title="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'img-title')}
              />
            </>
          )}
        </>
      )}

      {fieldObj.typ === 'signature'
        && (
          <>
            <NavBtn
              subRoute={fldKey}
              route="inp-fld-wrp"
              label="Field Wrapper"
              offset="2.5"
              highlightSelector={`[data-dev-inp-fld-wrp="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'inp-fld-wrp')}
            />
            <NavBtn
              subRoute={fldKey}
              route="signature-pad"
              label="Signature Pad"
              offset="2.5"
              highlightSelector={`[data-dev-fld="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'signature-pad')}
            />

            {!(fieldObj.clrPreIcn || fieldObj.clrSufIcn) && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
                subRoute={fldKey}
                route="clr-btn"
                label="Clear Button"
                offset="2.5"
                highlightSelector={`[data-dev-clr-btn="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'clr-btn')}
              />
            )}
            {(fieldObj.clrPreIcn || fieldObj.clrSufIcn) && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('btn')}
                offset="3.1"
                title="Clear Button"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey && (fieldObj.clrPreIcn || fieldObj.clrSufIcn)}
                highlightSelector={`[data-dev-btn="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'btn')}
              >
                {fieldObj.clrPreIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.clrPreIcn[0]}`}
                    subRoute={fldKey}
                    route="clr-btn-pre-i"
                    label="Leading Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-clr-btn-pre-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'clr-btn-pre-i')}
                  />
                )}
                {fieldObj.clrSufIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.btnSufIcn[0]}`}
                    subRoute={fldKey}
                    route="clr-btn-suf-i"
                    label="Trailing Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-clr-btn-suf-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'clr-btn-suf-i')}
                  />
                )}
              </LayerAccordion>
            )}
            {!(fieldObj.undoPreIcn || fieldObj.undoSufIcn) && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
                subRoute={fldKey}
                route="undo-btn"
                label="Undo Button"
                offset="2.5"
                highlightSelector={`[data-dev-undo-btn="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'undo-btn')}
              />
            )}
            {(fieldObj.undoPreIcn || fieldObj.undoSufIcn) && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('btn')}
                offset="3.1"
                title="Undo Button"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey && (fieldObj.undoPreIcn || fieldObj.undoSufIcn)}
                highlightSelector={`[data-dev-undo-btn="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'undo-btn')}
              >
                {fieldObj.undoPreIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.undoPreIcn[0]}`}
                    subRoute={fldKey}
                    route="undo-btn-pre-i"
                    label="Leading Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-undo-btn-pre-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'undo-btn-pre-i')}
                  />
                )}
                {fieldObj.undoSufIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.btnSufIcn[0]}`}
                    subRoute={fldKey}
                    route="undo-btn-suf-i"
                    label="Trailing Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-undo-btn-suf-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'undo-btn-suf-i')}
                  />
                )}
              </LayerAccordion>
            )}
            {!(fieldObj.redoPreIcn || fieldObj.redoSufIcn) && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.button[0]}`}
                subRoute={fldKey}
                route="redo-btn"
                label="Redo Button"
                offset="2.5"
                highlightSelector={`[data-dev-redo-btn="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'redo-btn')}
              />
            )}
            {(fieldObj.redoPreIcn || fieldObj.redoSufIcn) && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('btn')}
                offset="3.1"
                title="redo Button"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey && (fieldObj.redoPreIcn || fieldObj.redoSufIcn)}
                highlightSelector={`[data-dev-redo-btn="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'redo-btn')}
              >
                {fieldObj.redoPreIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.redoPreIcn[0]}`}
                    subRoute={fldKey}
                    route="redo-btn-pre-i"
                    label="Leading Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-redo-btn-pre-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'redo-btn-pre-i')}
                  />
                )}
                {fieldObj.redoSufIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.btnSufIcn[0]}`}
                    subRoute={fldKey}
                    route="redo-btn-suf-i"
                    label="Trailing Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-redo-btn-suf-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'redo-btn-suf-i')}
                  />
                )}
              </LayerAccordion>
            )}
          </>
        )}
      {fieldObj.typ === 'repeater' && (
        <>
          <NavBtn
            subRoute={fldKey}
            route="rpt-wrp"
            label="Repeatative Container"
            offset="2.5"
            highlightSelector={`[data-dev-rpt-wrp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-wrp')}
          />
          <NavBtn
            subRoute={fldKey}
            route="rpt-grid-wrp"
            label="Grid Container"
            offset="2.5"
            highlightSelector={`[data-dev-rpt-grid-wrp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-grid-wrp')}
          />
          <NavBtn
            subRoute={fldKey}
            route="pair-btn-wrp"
            label="Button Container"
            offset="2.5"
            highlightSelector={`[data-dev-pair-btn-wrp="${fldKey}"]`}
            styleOverride={isLabelOverrideStyles(styles, fldKey, 'pair-btn-wrp')}
          />

          {!(fieldObj.addBtnPreIcn || fieldObj.addBtnSufIcn) && (
            <NavBtn
              cssSelector={`.${fldKey}-rpt-add-btn`}
              subRoute={fldKey}
              route="rpt-add-btn"
              label="Add Button"
              offset="2.5"
              highlightSelector={`[data-dev-rpt-add-btn="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-add-btn')}
            />
          )}
          {(fieldObj.addBtnPreIcn || fieldObj.addBtnSufIcn) && (
            <LayerAccordion
              childrenAccodin
              onClick={() => styleHandler('rpt-add-btn')}
              offset="3.1"
              title="Add Button"
              fldData={fieldObj}
              key={`${fldKey}-add-btn`}
              open={fldKey === selectedFieldKey && (fieldObj.addBtnPreIcn || fieldObj.addBtnSufIcn)}
              highlightSelector={`[data-dev-rpt-add-btn="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-add-btn')}
            >
              {fieldObj.addBtnPreIcn && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.addBtnPreIcn[0]}`}
                  subRoute={fldKey}
                  route="rpt-add-btn-pre-i"
                  label="Leading Icon"
                  offset="3.3"
                  highlightSelector={`[data-dev-rpt-add-btn-pre-i="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-add-btn-pre-i')}
                />
              )}
              {fieldObj.addBtnSufIcn && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.addBtnSufIcn[0]}`}
                  subRoute={fldKey}
                  route="rpt-add-btn-suf-i"
                  label="Trailing Icon"
                  offset="3.3"
                  highlightSelector={`[data-dev-rpt-add-btn-suf-i="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-add-btn-suf-i')}
                />
              )}
            </LayerAccordion>
          )}

          {!(fieldObj.removeBtnPreIcn || fieldObj.removeBtnSufIcn) && (
            <NavBtn
              cssSelector={`.${fldKey}-rpt-rmv-btn`}
              subRoute={fldKey}
              route="rpt-rmv-btn"
              label="Remove Button"
              offset="2.5"
              highlightSelector={`[data-dev-rpt-rmv-btn="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-rmv-btn')}
            />
          )}
          {(fieldObj.removeBtnPreIcn || fieldObj.removeBtnSufIcn) && (
            <LayerAccordion
              childrenAccodin
              onClick={() => styleHandler('rpt-rmv-btn')}
              offset="3.1"
              title="Remove Button"
              fldData={fieldObj}
              key={`${fldKey}-rmv-btn`}
              open={fldKey === selectedFieldKey && (fieldObj.removeBtnPreIcn || fieldObj.removeBtnSufIcn)}
              highlightSelector={`[data-dev-rpt-rmv-btn="${fldKey}"]`}
              styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-rmv-btn')}
            >
              {fieldObj.removeBtnPreIcn && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.removeBtnPreIcn[0]}`}
                  subRoute={fldKey}
                  route="rpt-rmv-btn-pre-i"
                  label="Leading Icon"
                  offset="3.3"
                  highlightSelector={`[data-dev-rpt-rmv-btn-pre-i="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-rmv-btn-pre-i')}
                />
              )}
              {fieldObj.removeBtnSufIcn && (
                <NavBtn
                  cssSelector={`.${fldKey}-${styleClasses.removeBtnSufIcn[0]}`}
                  subRoute={fldKey}
                  route="rpt-rmv-btn-suf-i"
                  label="Trailing Icon"
                  offset="3.3"
                  highlightSelector={`[data-dev-rpt-rmv-btn-suf-i="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'rpt-rmv-btn-suf-i')}
                />
              )}
            </LayerAccordion>
          )}
          {fieldObj.addToEndBtn.show && (
            <>
              <NavBtn
                subRoute={fldKey}
                route="add-to-end-btn-wrp"
                label="End Button Container"
                offset="2.5"
                highlightSelector={`[data-dev-add-to-end-btn-wrp="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'add-to-end-btn-wrp')}
              />
              {!(fieldObj.addToEndBtnPreIcn || fieldObj.addToEndBtnSufIcn) && (
                <NavBtn
                  cssSelector={`.${fldKey}-add-to-end-btn`}
                  subRoute={fldKey}
                  route="add-to-end-btn"
                  label="Add to End Button"
                  offset="2.5"
                  highlightSelector={`[data-dev-add-to-end-btn="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'add-to-end-btn')}
                />
              )}
              {(fieldObj.addToEndBtnPreIcn || fieldObj.addToEndBtnSufIcn) && (
                <LayerAccordion
                  childrenAccodin
                  onClick={() => styleHandler('add-to-end-btn')}
                  offset="3.1"
                  title="Add To End Button"
                  fldData={fieldObj}
                  key={`${fldKey}-add-end-btn`}
                  open={fldKey === selectedFieldKey && (fieldObj.addToEndBtnPreIcn || fieldObj.addToEndBtnSufIcn)}
                  highlightSelector={`[data-dev-add-to-end-btn="${fldKey}"]`}
                  styleOverride={isLabelOverrideStyles(styles, fldKey, 'add-to-end-btn')}
                >
                  {fieldObj.addToEndBtnPreIcn && (
                    <NavBtn
                      cssSelector={`.${fldKey}-${styleClasses.addToEndBtnPreIcn[0]}`}
                      subRoute={fldKey}
                      route="add-to-end-btn-pre-i"
                      label="Leading Icon"
                      offset="3.3"
                      highlightSelector={`[data-dev-add-to-end-btn-pre-i="${fldKey}"]`}
                      styleOverride={isLabelOverrideStyles(styles, fldKey, 'add-to-end-btn-pre-i')}
                    />
                  )}
                  {fieldObj.addToEndBtnSufIcn && (
                    <NavBtn
                      cssSelector={`.${fldKey}-${styleClasses.addToEndBtnSufIcn[0]}`}
                      subRoute={fldKey}
                      route="add-to-end-btn-suf-i"
                      label="Trailing Icon"
                      offset="3.3"
                      highlightSelector={`[data-dev-add-to-end-btn-suf-i="${fldKey}"]`}
                      styleOverride={isLabelOverrideStyles(styles, fldKey, 'add-to-end-btn-suf-i')}
                    />
                  )}
                </LayerAccordion>
              )}
            </>
          )}
        </>
      )}
      {(fieldObj.helperTxt || fieldObj.hlpPreIcn || fieldObj.hlpSufIcn)
        && (
          <>
            {!(fieldObj.hlpPreIcn || fieldObj.hlpSufIcn) && (
              <NavBtn
                cssSelector={`.${fldKey}-${styleClasses.hlpTxt[0]}`}
                subRoute={fldKey}
                route="hlp-txt"
                label="Helper Text"
                offset="2.5"
                highlightSelector={`[data-dev-hlp-txt="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'hlp-txt')}
              />
            )}
            {(fieldObj.hlpPreIcn || fieldObj.hlpSufIcn) && (
              <LayerAccordion
                childrenAccodin
                onClick={() => styleHandler('hlp-txt')}
                offset="3.1"
                title="Helper Text"
                fldData={fieldObj}
                key={fldKey}
                open={fldKey === selectedFieldKey && (fieldObj.hlpPreIcn || fieldObj.hlpSufIcn)}
                highlightSelector={`[data-dev-hlp-txt="${fldKey}"]`}
                styleOverride={isLabelOverrideStyles(styles, fldKey, 'hlp-txt')}
              >
                {fieldObj.hlpPreIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.hlpPreIcn[0]}`}
                    subRoute={fldKey}
                    route="hlp-txt-pre-i"
                    label="Leading Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-hlp-txt-pre-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'hlp-txt-pre-i')}
                  />
                )}
                {fieldObj.hlpSufIcn && (
                  <NavBtn
                    cssSelector={`.${fldKey}-${styleClasses.hlpSufIcn[0]}`}
                    subRoute={fldKey}
                    route="hlp-txt-suf-i"
                    label="Trailing Icon"
                    offset="3.3"
                    highlightSelector={`[data-dev-hlp-txt-suf-i="${fldKey}"]`}
                    styleOverride={isLabelOverrideStyles(styles, fldKey, 'hlp-txt-suf-i')}
                  />
                )}
              </LayerAccordion>
            )}
          </>
        )}
    </>
  )
}
