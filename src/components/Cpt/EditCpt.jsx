/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react'
import { useFela } from 'react-fela'
import app from '../../styles/app.style'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import SnackMsg from '../Utilities/SnackMsg'
import TableCheckBox from '../Utilities/TableCheckBox'
import DeleteCpt from './DeleteCpt'

export default function AllCpt({ posts, types }) {
  const [chekcType, setchekcType] = useState(false)
  const [slugName, setSlugName] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [editPost, setEditPost] = useState({})
  const [snack, setsnack] = useState({ show: false })
  const { css } = useFela()

  const searchPostHandle = (slug) => {
    setSlugName(slug)
    const result = posts?.find(post => post.name === slug)
    setchekcType(true)
    setEditPost(result)
  }

  const handleUpdate = () => {
    setLoading(true)

    bitsFetch(editPost, 'bitforms_update_post_type')
      .then((res) => {
        if (res && res.success) {
          setsnack({ show: true, msg: __('cpt type update successfully, refresh your window') })
        }
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleInput = (e, typ) => {
    const tmpData = { ...editPost }

    if (typ === 'check') {
      tmpData[e.target.name] = e.target.checked ? 1 : 0
    } else if (typ === 'text') {
      tmpData[e.target.name] = e.target.value
    }

    setEditPost(tmpData)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setsnack} />

      <div className="mt-2"><b>{__('Post Type')}</b></div>

      <select
        name="post_type"
        className="btcd-paper-inp mt-1"
        onChange={e => searchPostHandle(e.target.value)}
        value={slugName}
      >
        <option disabled value="">{__('Select Type *')}</option>
        {Object.values(types).map((type, key) => (
          <option key={`k${key * 43}`} value={type}>{type}</option>
        ))}
      </select>

      {chekcType && (
        <div>
          <div className="mt-2">
            <label>
              {__('Post Type Slug *')}
              <input
                name="name"
                className="btcd-paper-inp mt-1"
                value={editPost?.name}
                type="text"
                readOnly
              />
            </label>
          </div>

          <div className="mt-2">
            <label>
              {__('Singular Label *')}
              <input
                name="singular_label"
                className="btcd-paper-inp mt-1"
                onChange={(e) => handleInput(e, 'text')}
                value={editPost?.singular_label}
                type="text"
              />
            </label>
          </div>

          <div className="mt-2">
            <label>
              {__('Menu Name *')}
              <input
                name="menu_name"
                className="btcd-paper-inp mt-1"
                onChange={(e) => handleInput(e, 'text')}
                value={editPost?.menu_name}
                type="text"
              />
            </label>
          </div>

          <div className="mt-2">
            <label>
              {__('Menu Icon *')}
              <input
                name="menu_icon"
                className="btcd-paper-inp mt-1"
                onChange={(e) => handleInput(e, 'text')}
                value={editPost?.menu_icon}
                type="text"
              />
              <span className="mt-1">
                <a target="blank" href="https://developer.wordpress.org/resource/dashicons/#admin-site-alt">
                  Dashicon class name
                </a>
                {' '}
                to use for icon.
              </span>
            </label>
          </div>

          <div className="d-flx flx-wrp">
            <TableCheckBox
              onChange={(e) => handleInput(e, 'check')}
              checked={editPost?.public === 1}
              className="wdt-200 mt-4 mr-2"
              name="public"
              title={__('public')}
              subTitle={__('Posts of this type should be shown in the admin UI and is publicly queryable')}
            />

            <TableCheckBox
              onChange={(e) => handleInput(e, 'check')}
              checked={editPost?.public_queryable === 1}
              className="wdt-200 mt-4 mr-2"
              name="public_queryable"
              style={{ marginLeft: 60 }}
              title={__('Publicly Queryable')}
              subTitle={__('Queries can be performed on the front end as part of parse_request()')}
            />
          </div>

          <div className="d-flx flx-wrp">
            <TableCheckBox
              onChange={(e) => handleInput(e, 'check')}
              checked={editPost?.show_in_rest === 1}
              className="wdt-200 mt-4 mr-2"
              name="show_in_rest"
              title={__('Show in REST API')}
              subTitle={__('To show this post type data in the WP REST API')}
            />

            <TableCheckBox
              onChange={(e) => handleInput(e, 'check')}
              checked={editPost?.show_in_menu === 1}
              className="wdt-200 mt-4 mr-2"
              name="show_in_menu"
              style={{ marginLeft: 60 }}
              title={__('Show in Menu')}
              subTitle={__('This show the post type in the admin menu and where to show that menu')}
            />
          </div>

          <div className="d-flx flx-wrp">
            <TableCheckBox
              onChange={(e) => handleInput(e, 'check')}
              checked={editPost?.show_ui === 1}
              className="wdt-200 mt-4 mr-2"
              name="show_ui"
              title={__('Show UI')}
              subTitle={__('Generate a default UI for managing this post type')}
            />
          </div>

          <div className="d-flx flx-wrp mt-4">
            <button
              type="button"
              className={`${css(app.btn)} f-left btcd-btn-lg blue sh-sm flx`}
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {__('Update Post Type')}
              {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
            </button>

            <DeleteCpt
              slug={slugName}
              stack={snack}
              setsnack={setsnack}
              posts={posts}
            />
          </div>

        </div>
      )}
    </div>
  )
}
