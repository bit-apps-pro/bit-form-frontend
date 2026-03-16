/* eslint-disable react/no-array-index-key */
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { __ } from '../Utils/i18nwrap'
import PdfFontList from './PDFSettings/PdfFontList'
import PdfGlobalSetting from './PDFSettings/PdfGlobalSetting'

export default function Pdf() {
  return (
    <div className="btcd-captcha" style={{ padding: 10 }}>
      <div className="pos-rel">
        <Tabs
          selectedTabClassName="s-t-l-active"
        >
          <TabList className="flx mt-0">
            <Tab className="btcd-s-tab-link">
              <b>{__('PDF Global Setting')}</b>
            </Tab>
            <Tab className="btcd-s-tab-link">
              <b>{__('Available Font for PDF')}</b>
            </Tab>
          </TabList>
          <TabPanel>
            <PdfGlobalSetting />
          </TabPanel>
          <TabPanel>
            <PdfFontList />
          </TabPanel>
        </Tabs>
      </div>
    </div>

  )
}
