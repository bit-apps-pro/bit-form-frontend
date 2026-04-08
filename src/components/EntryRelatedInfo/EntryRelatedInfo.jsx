import { useAtomValue } from 'jotai'
import { memo } from 'react'
import { useFela } from 'react-fela'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { Link, useParams } from 'react-router-dom'
import { $bits, $fieldLabels, $formId, $integrations, $pdfTemplates } from '../../GlobalStates/GlobalStates'
import DownloadIcon from '../../Icons/DownloadIcon'
import paymentFields from '../../Utils/StaticData/paymentFields'
import { __ } from '../../Utils/i18nwrap'
import FormEntryNotes from './FormEntryNotes'
import FormEntryPayments from './FormEntryPayments'
import FormEntryTimeline from './FormEntryTimeline'
import GoogleAdInfo from './GoogleAdInfo'
import app from '../../styles/app.style'
import DocIcn from '../../Icons/DocIcn'

function EntryRelatedInfo({ entryID, rowDtl, setSnackbar, close }) {
  const formID = useAtomValue($formId)
  const { formType } = useParams()
  const allLabels = useAtomValue($fieldLabels)
  const integrations = useAtomValue($integrations)
  const payFields = allLabels.filter(label => paymentFields.includes(label.type))
  const { css } = useFela()

  const bits = useAtomValue($bits)
  const pdfTemplates = useAtomValue($pdfTemplates)
  const pdfTemplatesPageLink = `/form/settings/${formType}/${formID}/pdf-templates`

  return (
    <Tabs
      selectedTabClassName="s-t-l-active"
    >
      <TabList className="flx m-0">
        {!!(payFields?.length) && (
          <Tab className="btcd-s-tab-link">
            {__('Payment')}
          </Tab>
        )}
        <Tab className="btcd-s-tab-link">
          {__('Timeline')}
        </Tab>
        <Tab className="btcd-s-tab-link">
          {__('Notes')}
        </Tab>
        {bits?.isPro && (
          <Tab className="btcd-s-tab-link">
            {__('PDF Downloads')}
          </Tab>
        )}
        {!!(rowDtl?.GCLID) && (
          <Tab className="btcd-s-tab-link">
            {__('Google Ads Information')}
          </Tab>
        )}
      </TabList>

      {!!(payFields?.length) && (
        <TabPanel>
          <FormEntryPayments
            formID={formID}
            rowDtl={rowDtl}
          />
        </TabPanel>
      )}
      <TabPanel>
        <FormEntryTimeline
          formID={formID}
          entryID={entryID}
          integrations={integrations}
        />
      </TabPanel>
      <TabPanel>
        <FormEntryNotes
          formID={formID}
          entryID={entryID}
          allLabels={allLabels}
          setSnackbar={setSnackbar}
          rowDtl={rowDtl}
        />
      </TabPanel>
      <TabPanel>
        <div className={css({
          ml: 10,
          fs: 14,
          mt: 10,
        })}
        >
          <Link to={pdfTemplatesPageLink}>
            <button type="button" className={css(app.btn)}>Create new template</button>
          </Link>
          {pdfTemplates.length === 0
            ? (
              <div className={css({ mt: 20, cr: 'red' })}>
                {__('No PDF templates available')}
              </div>
            )
            : pdfTemplates.map((pdf, idx) => (
              <div key={pdf.id} className={css(styles.pdfTemplateContainer)}>
                <a
                  target="_blank"
                  href={`${window.origin}?bitform-download-pdf=1&formID=${formID}&pdftemp=${pdf.id}&entryId=${entryID}`}
                  rel="noreferrer"
                >
                  <DownloadIcon size={14} />
                  <span className={css({ ml: 5 })}>
                    {
                      pdf?.title
                    }
                  </span>
                </a>
                <Link to={`${pdfTemplatesPageLink}/${idx}`} className={`pdf-edit-btn icn-btn ml-1 tooltip pos-rel ${css(styles.editPdfButton)}`} style={{ '--tooltip-txt': `'${__('Edit')}'`, fontSize: 16 }}>
                  <DocIcn size="15" />
                </Link>
              </div>
            ))}
        </div>
      </TabPanel>
      {
        !!(rowDtl?.GCLID) && (
          <TabPanel>
            <GoogleAdInfo
              rowDtl={rowDtl}
            />
          </TabPanel>
        )
      }
    </Tabs>
  )
}
export default memo(EntryRelatedInfo)

const styles = {
  pdfTemplateContainer: { mt: 20, display: 'flex', alignItems: 'center', gap: '5rem', width: 'fit-content', '&:hover .pdf-edit-btn': { opacity: 1, visibility: 'visible' } },
  editPdfButton: { opacity: 0, visibility: 'hidden', transition: '0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' },
}
