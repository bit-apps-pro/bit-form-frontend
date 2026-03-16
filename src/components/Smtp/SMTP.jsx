/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { __ } from '../../Utils/i18nwrap'
import useSWROnce from '../../hooks/useSWROnce'
import MailSendTest from './MailSendTest'
import SMTPConfigForm from './SMTPConfigForm'

export default function SMTP() {
  const [mail, setMail] = useState({})
  const [status, setStatus] = useState('')

  useSWROnce('bitforms_get_mail_config', {}, {
    onSuccess: data => {
      setMail(JSON.parse(data[0].integration_details))
      setStatus(Number(data[0].status))
    },
  })

  return (
    <div className="btcd-captcha w-5" style={{ padding: 10 }}>
      <div className="pos-rel">
        <Tabs
          selectedTabClassName="s-t-l-active"
        >
          <TabList className="flx mt-0">
            <Tab className="btcd-s-tab-link">
              <b>{__('Configuration')}</b>
            </Tab>
            <Tab className="btcd-s-tab-link">
              <b>{__('Mail Test')}</b>
            </Tab>
          </TabList>
          <TabPanel>
            <SMTPConfigForm
              mail={mail}
              setMail={setMail}
              status={status}
              smtpStatus={setStatus}
            />
          </TabPanel>
          <TabPanel>
            <MailSendTest />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}
