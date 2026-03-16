/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { postFields } from '../../../Utils/StaticData/postField'
import Cooltip from '../../Utilities/Cooltip'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import SaveIntegrationBtn from '../SaveIntegrationBtn'
import FieldMap from './FieldMap'
import { addFieldMap, checkMappedAcfFields, checkMappedPostFields, refreshMetaboxFields, refreshPostTypes } from './MetaboxHelperFunction'

function EdtiMetabox({ formFields, setIntegration, integrations, allIntegURL }) {
  const history = useNavigate()
  const { id } = useParams()
  const [postTypes, setPostTypes] = useState([])
  const [metaboxFields, setMetaboxFields] = useState([])
  const [metaboxFileFields, setMetaboxFileFields] = useState([])
  const [users, setUsers] = useState([])
  const [data, setData] = useState({ ...integrations[id] })
  const [snack, setSnackbar] = useState({ show: false })

  useEffect(() => {
    bitsFetch({}, 'bitforms_get_post_type').then((res) => {
      if (res?.success) {
        setPostTypes(Object.values(res?.data?.post_types))
        setUsers(res?.data?.users)
      }
    })

    bitsFetch({ post_type: data?.post_type }, 'bitforms_get_metabox_fields').then((res) => {
      if (res?.success && res !== undefined) {
        setMetaboxFields(res?.data?.metaboxFields)
        setMetaboxFileFields(res?.data?.metaboxFile)
      }
    })
  }, [])

  const handleInput = (typ, val, isNumber) => {
    const tmpData = { ...data }
    if (isNumber) {
      tmpData[typ] = Number(val)
    } else {
      tmpData[typ] = val
    }
    setData(tmpData)
  }

  const getCustomFields = (typ, val) => {
    const tmpData = { ...data }
    tmpData[typ] = val
    bitsFetch({ post_type: val }, 'bitforms_get_metabox_fields').then((res) => {
      if (res?.success && res !== undefined) {
        setMetaboxFields(res?.data?.metaboxFields)
        if (res?.data?.metaboxFields) {
          tmpData.metabox_map = res?.data?.metaboxFields?.filter(fld => fld.required).map(fl => ({ formField: '', metaboxField: fl.key, required: fl.required }))
          if (tmpData?.metabox_map?.length < 1) {
            tmpData.acf_map = [{}]
          }
        }
        if (res?.data?.metaboxFile) {
          tmpData.metabox_file_map = res?.data?.metaboxFile.filter(fld => fld.required).map(fl => ({ formField: '', metaboxFileUpload: fl.key, required: fl.required }))
          if (tmpData?.metabox_file_map?.length < 1) {
            tmpData.metabox_file_map = [{}]
          }
        }
        setData(tmpData)
      }
    })
  }

  const saveConfig = () => {
    if (!checkMappedPostFields(data)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields') })
      return
    }
    if (!checkMappedAcfFields(data)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields') })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, data, history, id, 'edit')
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="mt-3"><b>{__('Integration Name')}</b></div>
      <input
        className="btcd-paper-inp w-5 mt-1"
        onChange={(e) => handleInput(e.target.name, e.target.value)}
        name="name"
        value={data.name}
        type="text"
        placeholder={__('Integration Name...')}
      />

      <div className="mt-3 flx">
        <b>{__('Post Type')}</b>
        <Cooltip width={250} icnSize={17} className="ml-2">
          <div className="txt-body">
            Select one of the defined WordPress post types Or custom post types for the post.
            <br />
          </div>
        </Cooltip>
      </div>
      <div>
        <select
          name="post_type"
          onChange={(e) => getCustomFields(e.target.name, e.target.value)}
          value={data.post_type}
          className="btcd-paper-inp w-5 mt-1"
        >
          <option disabled selected>Select Post Type</option>
          {postTypes.map((postType, i) => (
            <option key={`pos-t-${i * 9}`} value={postType?.name}>{postType?.label}</option>
          ))}
        </select>
        <button
          onClick={() => refreshPostTypes(postTypes, setPostTypes)}
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{ '--tooltip-txt': `'${__('Refresh Post Types')}'` }}
          type="button"
        >
          &#x21BB;
        </button>
      </div>

      <div className="mt-3">
        <b>{__('Post Status')}</b>
        <Cooltip width={250} icnSize={17} className="ml-2">
          <div className="txt-body">
            Select the status for the post. If published status is selected and the post date is in the future, it will automatically be changed to scheduled
            <br />
          </div>
        </Cooltip>
      </div>
      <select
        name="post_status"
        onChange={(e) => handleInput(e.target.name, e.target.value)}
        value={data.post_status}
        className="btcd-paper-inp w-5 mt-1"
      >
        <option value="publish">Publish</option>
        <option value="draft">Draft</option>
        <option value="auto-draft">Auto-Draft</option>
        <option value="private">Private</option>
        <option value="pending">Pending</option>
      </select>

      <div className="mt-3 flx">
        <b>{__('Author')}</b>
        <Cooltip width={250} icnSize={17} className="ml-2">
          <div className="txt-body">
            Select the user to be assigned to the post.
            <br />
          </div>
        </Cooltip>
      </div>
      <div>
        <select
          name="post_author"
          onChange={(e) => handleInput(e.target.name, e.target.value)}
          value={data.post_author}
          className="btcd-paper-inp w-5 mt-2"
        >
          <option disabled selected>{__('Select Author')}</option>
          <option value="logged_in_user">Logged In User</option>
          {users.map((user, i) => (
            <option key={`pa-${i * 2}`} value={user.ID}>{user.display_name}</option>
          ))}
        </select>
      </div>

      <div className="mt-3"><b>{__('Comment Status')}</b></div>
      <select
        name="comment_status"
        onChange={(e) => handleInput(e.target.name, e.target.value)}
        value={data.comment_status}
        className="btcd-paper-inp w-5 mt-1"
      >
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>

      <br />
      <div>
        <div className="mt-3 mb-1"><b>{__('Field Mapping')}</b></div>
        <div className="btcd-hr" />
        <div className="flx flx-around mt-2 mb-1">
          <div className="txt-dp"><b>{__('Form Fields')}</b></div>
          <div className="txt-dp"><b>{__('Post Fields')}</b></div>
        </div>
      </div>
      {data?.post_map?.map((itm, i) => (
        <FieldMap
          key={`analytics-m-${i + 9}`}
          i={i}
          type="post"
          field={itm}
          formFields={formFields}
          dataConf={data}
          setDataConf={setData}
          customFields={postFields}
        />
      ))}
      <div
        className="txt-center  mt-2"
        style={{ marginRight: 85 }}
      >
        <button
          onClick={() => addFieldMap('post_map', data?.post_map?.length, data, setData)}
          className="icn-btn sh-sm"
          type="button"
        >
          +
        </button>
      </div>
      <div>
        <p className="p-1 f-m">
          <strong>Note</strong>
          {' '}
          : All your taxonomies will be mapped automatically from your form fields.
        </p>
      </div>

      <div>
        <div>
          <div className="mt-3 mb-1">
            <b>{__('MetaBox Fields Mapping')}</b>
            <button
              onClick={() => refreshMetaboxFields(data, setMetaboxFields, setMetaboxFileFields)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh MetaBox List')}'` }}
              type="button"
            >
              &#x21BB;
            </button>
          </div>
          <div className="btcd-hr" />
          <div className="flx flx-around mt-2 mb-1">
            <div className="txt-dp"><b>{__('Form Fields')}</b></div>
            <div className="txt-dp">
              <b>{__('Metabox Fields')}</b>
            </div>
          </div>
        </div>
        {
          data?.metabox_map?.map((itm, i) => (
            <FieldMap
              key={`analytics-m-${i + 9}`}
              i={i}
              type="metabox"
              field={itm}
              formFields={formFields}
              dataConf={data}
              setDataConf={setData}
              customFields={metaboxFields}
            />
          ))
        }
        <div
          className="txt-center  mt-2"
          style={{ marginRight: 85 }}
        >
          <button
            onClick={() => addFieldMap('metabox_map', data.metabox_map.length, data, setData)}
            className="icn-btn sh-sm"
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <div>
        <div>
          <div className="mt-3 mb-1">
            <b>{__('Metabox File Upload Fields Map')}</b>
            <button
              onClick={() => refreshMetaboxFields(data, setMetaboxFields, setMetaboxFileFields)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh MetaBox List')}'` }}
              type="button"
            >
              &#x21BB;
            </button>
          </div>
          <div className="btcd-hr" />
          <div className="flx flx-around mt-2 mb-1">
            <div className="txt-dp"><b>{__('Form Fields')}</b></div>
            <div className="txt-dp">
              <b>{__('Metaxbox Fields')}</b>
            </div>
          </div>
        </div>
        {
          data?.metabox_file_map?.map((itm, i) => (
            <FieldMap
              key={`analytics-m-${i + 9}`}
              i={i}
              type="metaboxFile"
              field={itm}
              formFields={formFields}
              dataConf={data}
              setDataConf={setData}
              customFields={metaboxFileFields}
              fieldType="file"
            />
          ))
        }
        <div
          className="txt-center  mt-2"
          style={{ marginRight: 85 }}
        >
          <button
            onClick={() => addFieldMap('metabox_file_map', data.metabox_file_map.length, data, setData)}
            className="icn-btn sh-sm"
            type="button"
          >
            +
          </button>
        </div>
      </div>

      <SaveIntegrationBtn onClick={() => saveConfig()} />

      {/* <button
        className={`${css(app.btn)} f-left btcd-btn-lg green sh-sm flx`}
        type="button"
        onClick={() => saveConfig()}
      >
        {__('Save')}
        {' '}
      </button> */}

    </div>

  )
}

export default EdtiMetabox
