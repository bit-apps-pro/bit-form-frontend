/* eslint-disable no-param-reassign */

import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import { $bits, $fieldsArr, $mailTemplates } from '../GlobalStates/GlobalStates'
import BackIcn from '../Icons/BackIcn'
import { deepCopy } from '../Utils/Helpers'
import { SmartTagField } from '../Utils/StaticData/SmartTagField'
import { nonMappableFields } from '../Utils/StaticData/allStaticArrays'
import { __ } from '../Utils/i18nwrap'
import app from '../styles/app.style'
import TinyMCE from './Utilities/TinyMCE'

function EmailTemplateEdit() {
  const { formType, formID, id } = useParams()
  const navigate = useNavigate()
  const [mailTemp, setMailTem] = useAtom($mailTemplates)
  const formFields = useAtomValue($fieldsArr)
  const [filterFields] = useState(() => formFields.filter(field => !nonMappableFields.includes(field.typ)))
  const { css } = useFela()

  const bits = useAtomValue($bits)
  const { isPro } = bits

  const handleTitle = e => {
    const mailTem = deepCopy(mailTemp)
    mailTem[id].title = e.target.value
    setMailTem(mailTem)
  }

  const handleSubject = e => {
    const mailTem = deepCopy(mailTemp)
    mailTem[id].sub = e.target.value
    setMailTem(mailTem)
  }

  const handleBody = val => {
    setMailTem(prevState => create(prevState, draft => {
      draft[id].body = val
    }))
  }

  const addFieldToSubject = e => {
    const mailTem = deepCopy(mailTemp)
    mailTem[id].sub += e.target.value
    setMailTem(mailTem)
  }

  const save = () => {
    const newMailTem = create(mailTemp, draft => {
      draft.push({ updateTem: 1 })
    })
    setMailTem(newMailTem)
    navigate(`/form/settings/${formType}/${formID}/email-templates`)
  }

  return (
    mailTemp.length < 1 ? <Navigate to={`/form/settings/edit/${formID}/email-templates`} replace /> : (
      <div style={{ width: 900 }}>
        <NavLink
          to={`/form/settings/${formType}/${formID}/email-templates`}
          className={`${css(app.btn)} btcd-btn-o-gray`}
        >
          <BackIcn className="mr-1" />
          {__('Back')}
        </NavLink>

        <button
          id="secondary-update-btn"
          onClick={save}
          className={`${css(app.btn)} blue f-right`}
          type="button"
        >
          {__('Update Template')}

        </button>

        <div className="mt-3 flx">
          <b style={{ width: 102 }}>
            {__('Template Name:')}
          </b>
          <input
            onChange={handleTitle}
            type="text"
            className="btcd-paper-inp w-9"
            placeholder="Name"
            value={mailTemp[id].title}
          />
        </div>
        <div className="mt-3 flx">
          <b style={{ width: 100 }}>{__('Subject:')}</b>
          <input
            onChange={handleSubject}
            type="text"
            className="btcd-paper-inp w-7"
            placeholder={__('Email Subject Here')}
            value={mailTemp[id].sub}
          />
          <select
            onChange={addFieldToSubject}
            className="btcd-paper-inp ml-2"
            style={{ width: 150 }}
          >
            <option value="">{__('Add field')}</option>
            <optgroup label="Form Fields">
              {filterFields !== null && filterFields.map(f => !f.type.match(/^(file-up|recaptcha)$/) && <option key={f.key} value={`\${${f.key}}`}>{f.name}</option>)}
            </optgroup>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={`\${${f.name}}`}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="mt-3">
          <div><b>{__('Body:')}</b></div>

          <label
            htmlFor={`t-m-e-${id}-${formID}`}
            className="mt-2 w-10"
          >
            <TinyMCE
              id={`mail-tem-${formID}`}
              formFields={formFields}
              value={mailTemp[id].body}
              onChangeHandler={handleBody}
              width="100%"
              mapAllFieldWithTable
              mapAllField
              height="400"
            />
          </label>
        </div>

      </div>
    )
  )
}

export default EmailTemplateEdit
