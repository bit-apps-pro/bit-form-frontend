/* eslint-disable max-len */
import { useState } from 'react'
import { useFela } from 'react-fela'
import app from '../../styles/app.style'
import bitsFetch from '../../Utils/bitsFetch'
import { IS_PRO } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import SnackMsg from '../Utilities/SnackMsg'
import TableCheckBox from '../Utilities/TableCheckBox'

const initialCptConfig = {
  slug: '',
  singular_label: '',
  menu_name: '',
  menu_icon: '',
  public: 1,
  public_queryable: 1,
  show_in_rest: 1,
  show_in_menu: 1,
  show_ui: 1,
}

export default function Cpt({ settab, types }) {
  const { css } = useFela()
  const [snack, setsnack] = useState({ show: false })
  const [isLoading, setLoading] = useState(false)

  const [cptConfig, setCptConfig] = useState(initialCptConfig)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCptConfig(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (e) => {
    const { name, checked } = e.target
    setCptConfig(prev => ({ ...prev, [name]: checked ? 1 : 0 }))
  }

  const existPostType = (val) => {
    const exists = types.find(post => post === val)
    if (exists) {
      setCptConfig(prev => ({ ...prev, slug: '' }))
      alert('Slug already exists')
    }
  }

  const handleSubmit = async () => {
    if (!IS_PRO) return
    setLoading(true)

    try {
      const res = await bitsFetch(cptConfig, 'bitforms_add_post_type')

      if (res?.success) {
        setsnack({ show: true, msg: __('CPT added successfully, refresh your window') })
        setCptConfig(initialCptConfig)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setsnack} />

      <small className="d-blk mt-1">
        <a
          className="btcd-link"
          href="https://bitapps.pro/docs/bit-form/integrations/custom-post-type-integrations/"
          target="_blank"
          rel="noreferrer"
        >
          {__('Learn more about CPT Integration')}
        </a>
      </small>

      <div>

        <div className="mt-3">
          <label htmlFor="slug">
            <b>{__('Post Type Slug *')}</b>
            <input
              id="slug"
              name="slug"
              className="btcd-paper-inp mt-1"
              placeholder="(e.g. slug)"
              type="text"
              required
              value={cptConfig.slug}
              onChange={(e) => {
                handleChange(e)
                existPostType(e.target.value)
              }}
            />
          </label>
        </div>

        <div className="mt-2">
          <label htmlFor="singular_label">
            <b>{__('Singular Label *')}</b>
            <input
              id="singular_label"
              name="singular_label"
              className="btcd-paper-inp mt-1"
              placeholder="(e.g. Video)"
              type="text"
              required
              value={cptConfig.singular_label}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="mt-2">
          <label htmlFor="menu_name">
            <b>{__('Menu Name *')}</b>
            <input
              id="menu_name"
              name="menu_name"
              className="btcd-paper-inp mt-1"
              placeholder="(e.g. My Videos)"
              type="text"
              required
              value={cptConfig.menu_name}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="mt-2">
          <label htmlFor="menu_icon">
            <b>{__('Menu Icon ')}</b>
            <input
              id="menu_icon"
              name="menu_icon"
              className="btcd-paper-inp mt-1"
              placeholder="(e.g. dashicons-admin-site-alt)"
              type="text"
              value={cptConfig.menu_icon}
              onChange={handleChange}
            />

            <small className="mt-1">
              <a
                className="btcd-link"
                target="blank"
                href="https://developer.wordpress.org/resource/dashicons/#admin-site-alt"
              >
                Dashicon class name
              </a>
              {' '}
              to use for icon.
            </small>
          </label>
        </div>

        <div className="d-flx flx-wrp">
          <TableCheckBox
            onChange={handleCheckbox}
            checked={!!cptConfig.public}
            className="wdt-200 mt-4 mr-2"
            name="public"
            title={<b>{__('Public')}</b>}
            subTitle={__('This type should be shown in the admin UI and is publicly queryable')}
          />

          <TableCheckBox
            onChange={handleCheckbox}
            checked={!!cptConfig.public_queryable}
            className="wdt-200 mt-4 mr-2"
            name="public_queryable"
            title={<b>{__('Publicly Queryable')}</b>}
            subTitle={__('Queries can be performed on the front end')}
          />

          <TableCheckBox
            onChange={handleCheckbox}
            checked={!!cptConfig.show_in_rest}
            className="wdt-200 mt-4 mr-2"
            name="show_in_rest"
            title={<b>{__('Show in REST API')}</b>}
            subTitle={__('To show this post type in the WP REST API')}
          />

          <TableCheckBox
            onChange={handleCheckbox}
            checked={!!cptConfig.show_in_menu}
            className="wdt-200 mt-4 mr-2"
            name="show_in_menu"
            title={<b>{__('Show in Menu')}</b>}
            subTitle={__('Show the post type in the admin menu')}
          />

          <TableCheckBox
            onChange={handleCheckbox}
            checked={!!cptConfig.show_ui}
            name="show_ui"
            className="wdt-200 mt-4 mr-2"
            title={<b>{__('Show UI')}</b>}
            subTitle={__('Generate UI for managing this post type')}
          />
        </div>

        <button
          type="button"
          className={`${css(app.btn)} btcd-btn-lg blue flx`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {__('Add Post Type')}
          {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
        </button>
      </div>
    </>
  )
}
