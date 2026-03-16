// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postFields } from '../../../Utils/StaticData/postField'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import bitsFetch from '../../../Utils/bitsFetch'
import SnackMsg from '../../Utilities/SnackMsg'
import TutorialLink from '../../Utilities/TutorialLink'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import SaveIntegrationBtn from '../SaveIntegrationBtn'
import { addFieldMap, checkMappedPodFields, checkMappedPostFields } from './PodHelperFunction'
import PodsFieldMap from './PodsFieldMap'

function Pods({ formFields, setIntegration, integrations, allIntegURL }) {
  const [types, setTypes] = useState([])
  const [pods, setPods] = useState([])
  const [users, setUsers] = useState([])

  const history = useNavigate()
  const [data, setData] = useState({
    name: 'Pods',
    type: 'Pods',
    post_map: [{ post_author: 'logged_in_user' }],
    pod_map: [{}],
  })
  const [snack, setSnackbar] = useState({ show: false })
  const handleInput = (typ, val, isNumber) => {
    const tmpData = { ...data }
    if (isNumber) {
      tmpData[typ] = Number(val)
    } else {
      tmpData[typ] = val
    }
    setData(tmpData)
  }

  const getPodsField = (typ, val) => {
    const tmpData = { ...data }
    tmpData[typ] = val
    bitsFetch({ pod_type: val }, 'bitforms_get_pod_field').then((res) => {
      if (res?.success && res !== undefined) {
        setPods(Object.values(res?.data))
        if (res?.data) {
          tmpData.pod_map = Object.values(res.data).filter(fld => fld.required).map(fl => ({ formField: '', podFormField: fl.key, required: fl.required }))
          if (tmpData?.pod_map?.length < 1) {
            tmpData.pod_map = [{}]
          }
        }
        setData(tmpData)
      }
    })
  }

  useEffect(() => {
    bitsFetch({}, 'bitforms_get_pod_type').then((res) => {
      if (res?.success && res !== undefined) {
        setTypes(Object.values(res.data?.post_types))
        setUsers(res.data?.users)
      }
    })

    const newConf = { ...data }
    newConf.post_map = postFields.filter(fld => fld.required).map(fl => ({ formField: '', postFormField: fl.key, required: fl.required }))
    setData(newConf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveConfig = () => {
    if (!data.post_type) {
      setSnackbar({ show: true, msg: __('Pod cann\'t be empty') })
      return
    }
    if (!data.post_status) {
      setSnackbar({ show: true, msg: __('Post Status cann\'t be empty') })
      return
    }
    if (!checkMappedPostFields(data)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields') })
      return
    }
    if (!checkMappedPodFields(data)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields') })
      return
    }
    saveIntegConfig(integrations, setIntegration, allIntegURL, data, history)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <TutorialLink
        title={tutorialLinks.pods.title}
        youTubeLink={tutorialLinks.pods.link}
      />
      <div className="mt-3"><b>{__('Integration Name')}</b></div>
      <input
        className="btcd-paper-inp w-5 mt-1"
        onChange={(e) => handleInput(e.target.name, e.target.value)}
        name="name"
        value={data.name}
        type="text"
        placeholder={__('Integration Name...')}
      />
      <div className="mt-3">
        <b>{__('Pod')}</b>
        {' '}
        <span style={{ color: 'red' }}>*</span>
      </div>
      <select
        name="post_type"
        onChange={(e) => getPodsField(e.target.name, e.target.value)}
        className="btcd-paper-inp w-5 mt-1"
      >
        <option disabled selected>Select Type</option>
        {types.map((type, key) => (
          <option key={`pod-${key * 2}`} value={type.name}>{type.label}</option>
        ))}
      </select>

      <div className="mt-3">
        <b>{__('Post Status')}</b>
        {' '}
        <span style={{ color: 'red' }}>*</span>
      </div>
      <select
        name="post_status"
        onChange={(e) => handleInput(e.target.name, e.target.value)}
        className="btcd-paper-inp w-5 mt-1"
      >
        <option disabled selected>{__('Select Status')}</option>
        <option value="publish">Publish</option>
        <option value="draft">Draft</option>
        <option value="inherit">Inherit</option>
        <option value="auto-draft">Auto-Draft</option>
        <option value="private ">Private</option>
        <option value="pending">Pending</option>
      </select>

      <div className="mt-3"><b>{__('Comment Status')}</b></div>
      <select
        name="comment_status"
        onChange={(e) => handleInput(e.target.name, e.target.value)}
        className="btcd-paper-inp w-5 mt-1"
      >
        <option disabled selected>{__('Select Status')}</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>

      <div className="mt-3"><b>{__('Author')}</b></div>
      <select
        name="post_author"
        onChange={(e) => handleInput(e.target.name, e.target.value)}
        className="btcd-paper-inp w-5 mt-1"
      >
        <option disabled selected>{__('Select Author')}</option>
        <option value="logged_in_user">Logged In User</option>
        {users.map((user, key) => (
          <option key={`pod-${key * 2}`} value={user.ID}>{user.display_name}</option>
        ))}
      </select>
      <div>
        <p className="p-1 f-m">
          <strong>Note</strong>
          {' '}
          : All your taxonomies will be mapped automatically from your form fields.
        </p>
      </div>
      <div>
        <div>
          <div className="mt-3 mb-1"><b>Pod Fields Mapping</b></div>
          <div className="btcd-hr" />
          <div className="flx flx-around mt-2 mb-1">
            <div className="txt-dp"><b>{__('Form Fields')}</b></div>
            <div className="txt-dp"><b>{__('Pod Fields')}</b></div>
          </div>
        </div>
        {
          data.pod_map.map((itm, i) => (
            <PodsFieldMap
              key={`analytics-m-${i + 9}`}
              i={i}
              type="pod"
              field={itm}
              formFields={formFields}
              dataConf={data}
              setDataConf={setData}
              podFields={pods}
            />
          ))
        }
        <div
          className="txt-center  mt-2"
          style={{ marginRight: 85 }}
        >
          <button
            onClick={() => addFieldMap('pod_map', data.pod_map.length, data, setData)}
            className="icn-btn sh-sm"
            type="button"
          >
            +
          </button>
        </div>

        <div>
          <div className="mt-3 mb-1"><b>Post Fields Mapping</b></div>
          <div className="btcd-hr" />
          <div className="flx flx-around mt-2 mb-1">
            <div className="txt-dp"><b>{__('Form Fields')}</b></div>
            <div className="txt-dp"><b>{__('Post Fields')}</b></div>
          </div>
        </div>
        {
          data.post_map.map((itm, i) => (
            <PodsFieldMap
              key={`analytics-m-${i + 9}`}
              i={i}
              type="post"
              field={itm}
              formFields={formFields}
              dataConf={data}
              setDataConf={setData}
              podFields={postFields}
            />
          ))
        }

        <div
          className="txt-center  mt-2"
          style={{ marginRight: 85 }}
        >
          <button
            onClick={() => addFieldMap('post_map', data.post_map.length, data, setData)}
            className="icn-btn sh-sm"
            type="button"
          >
            +
          </button>
        </div>
      </div>

      {/* <button
        id="secondary-update-btn"
        className={`${css(app.btn)} f-left btcd-btn-lg green sh-sm flx`}
        type="button"
        // onClick={() => saveIntegConfig(integrations, setIntegration, allIntegURL, data, history)}
        onClick={() => saveConfig()}
      >
        {__('Save')}
        {' '}
      </button> */}

      <SaveIntegrationBtn onClick={() => saveConfig()} />
    </div>
  )
}

export default Pods
