/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import app from '../../styles/app.style'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'

export default function MailSendTest({ settab }) {
  const [isTestLoading, setisTestLoading] = useState(false)
  const { css } = useFela()
  const [testMail, setTestMail] = useState({ to: '', subject: '', message: '' })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setTestMail({ ...testMail, [name]: value })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setisTestLoading(true)
    const prom = bitsFetch(
      testMail,
      'bitforms_test_email',
    )
      .then((res) => {
        setisTestLoading(false)
        if (res !== undefined && res.success) {
          if (res.data) {

            return __('Email sent successfully.')
          }
          return __(`${res?.data?.errors?.[0]}`)
        }
        return __(`${res?.data?.errors?.[0]}`)
      })
    toast.promise(prom, {
      success: data => data,
      loading: __('Sending...'),
      error: data => data,
    })
  }

  return (
    <div>
      <h2>
        {__('Email Test')}
      </h2>
      <div>
        <div className="mt-2 flx">
          <label htmlFor="form_email_address" className="mr-2 wdt-150">
            <b>{__('To:')}</b>
          </label>
          <input value={testMail.to} onChange={onChangeHandler} id="form_email_address" name="to" className="btcd-paper-inp" placeholder="Email" type="email" required />
        </div>
        <div className="mt-2 flx">
          <label htmlFor="subject" className="mr-2 wdt-150">
            <b>{__('Subject:')}</b>
          </label>
          <input value={testMail.subject} onChange={onChangeHandler} id="subject" name="subject" className="btcd-paper-inp" placeholder="Subject" type="text" required />
        </div>
        <div className="mt-2 flx">
          <label htmlFor="message" className="mr-2 wdt-150">
            <b>{__('Message:')}</b>
          </label>
          <input value={testMail.message} onChange={onChangeHandler} id="message" name="message" className="btcd-paper-inp" placeholder="Message" type="text" required />
        </div>
        <button type="button" onClick={handleSubmit} className={`${css(app.btn)} f-left btcd-btn-lg blue sh-sm flx`} disabled={isTestLoading}>
          {__('Send Test Mail')}
          {isTestLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
        </button>

      </div>
    </div>
  )
}
