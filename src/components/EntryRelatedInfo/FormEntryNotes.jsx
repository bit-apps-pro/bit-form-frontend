import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { $bits } from '../../GlobalStates/GlobalStates'
import DocIcn from '../../Icons/DocIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { dateTimeFormatter } from '../../Utils/Helpers'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import noData from '../../resource/img/nodata.svg'
import app from '../../styles/app.style'
import Loader from '../Loaders/Loader'
import LoaderSm from '../Loaders/LoaderSm'
import ConfirmModal from '../Utilities/ConfirmModal'
import RenderHtml from '../Utilities/RenderHtml'
import NoteForm from './NoteForm'

export default function FormEntryNotes({ formID, entryID, allLabels, rowDtl }) {
  const bits = useAtomValue($bits)
  const { isPro } = bits
  const { css } = useFela()
  const dateTimeFormat = `${bits.dateFormat} ${bits.timeFormat}`
  const [isLoading, setIsLoading] = useState(false)
  const [confMdl, setConfMdl] = useState({ show: false })
  const [showForm, setShowForm] = useState(false)
  const [allNotes, setAllNotes] = useState([])
  const [firstLoad, setFirstLoad] = useState(false)
  const [fetchData, setFetchData] = useState(false)
  const [data, setData] = useState({
    title: '',
    content: '',
  })

  useEffect(() => {
    isPro && setIsLoading('allNotes')
    setFirstLoad(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    isPro && setIsLoading('allNotes')
    if (fetchData) {
      setFetchData(false)
      return
    }
    // eslint-disable-next-line no-undef
    isPro && bitsFetch({ formID, entryID }, 'bitforms_form_entry_get_notes').then((res) => {
      if (res !== undefined && res.success) {
        setAllNotes(res.data)
      }
      setIsLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, entryID])

  useEffect(() => {
    if (data.content) setShowForm(true)
  }, [data])

  const setEditMode = noteID => {
    setShowForm(false)
    const noteDetails = allNotes.find(note => note.id === noteID)
    const { title, content } = JSON.parse(noteDetails.info_details)
    setData({ noteID, title, content })
    setShowForm(true)
  }

  const confDeleteNote = noteID => {
    confMdl.noteID = noteID
    confMdl.show = true
    setConfMdl({ ...confMdl })
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setConfMdl({ ...confMdl })
  }

  const deleteNote = () => {
    setIsLoading('delete')
    closeConfMdl()
    bitsFetch({ noteID: confMdl.noteID, formID, entryID }, 'bitforms_form_entry_delete_note').then((res) => {
      if (res !== undefined && res.success) {
        toast.success(__('Note Deleted Successfully'))
        setFetchData(true)
      }
      setIsLoading(false)
    })
  }

  const replaceFieldWithValue = str => {
    const pattern = /\${\w[^ ${}]*}/g
    const keys = str?.match?.(pattern) || ''
    const uniqueKeys = keys?.filter?.((key, index) => keys.indexOf(key) === index) || []
    let replacedStr = str
    for (let i = 0; i < uniqueKeys.length; i += 1) {
      const uniqueKey = uniqueKeys[i].slice(2, -1)
      replacedStr = replacedStr.replace(new RegExp(`\\${uniqueKeys[i]}`, 'gi'), uniqueKey in rowDtl ? rowDtl[uniqueKey] : '[Field Deleted]')
    }
    return replacedStr
  }

  const renderNote = note => {
    const noteDetails = JSON.parse(note.info_details)
    const isDeleting = (isLoading === 'delete' && confMdl.noteID === note.id)

    return (
      <div key={note.id}>
        <div>
          {note.updated_at
            ? (
              <small>
                {__('updated on:')}
                {` ${dateTimeFormatter(note.updated_at, dateTimeFormat)}`}
              </small>
            )
            : (
              <small>
                {__('created at:')}
                {` ${dateTimeFormatter(note.created_at, dateTimeFormat)}`}
              </small>
            )}
          <button type="button" className="icn-btn ml-1 tooltip pos-rel" style={{ '--tooltip-txt': `'${__('Edit')}'`, fontSize: 16 }} onClick={() => setEditMode(note.id)}>
            <DocIcn size="15" />
          </button>
          <button type="button" onClick={() => confDeleteNote(note.id)} className={`${isDeleting ? css(app.btn) : 'icn-btn'} ml-1 tooltip pos-rel`} style={{ '--tooltip-txt': `'${__('Delete')}'`, fontSize: 16 }} disabled={isDeleting}>
            <TrashIcn size="15" />
            {isDeleting && <LoaderSm size={20} clr="#000" className="ml-2" />}
          </button>
        </div>
        <div>
          {noteDetails.title && <h3>{noteDetails.title}</h3>}
          <div><RenderHtml html={replaceFieldWithValue(noteDetails.content)} /></div>
        </div>
        <hr className="btcd-hr" />
      </div>
    )
  }

  const renderAllNotes = () => (allNotes.length ? allNotes.map(note => renderNote(note)) : firstLoad && <img src={noData} alt="no data found" style={{ height: 150, width: '100%' }} />)

  return (
    <>
      <div className="pos-rel">
        {!isPro && (
          <div className="pro-blur mt-4 flx">
            <div className="pro">
              {__('Available On')}
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  {' '}
                  {__('Premium')}
                </span>
              </a>
            </div>
          </div>
        )}
        {showForm
          ? (
            <NoteForm
              {...{
                formID, entryID, allLabels, showForm, setShowForm, setFetchData, data, setData,
              }}
            />
          )
          : <button type="button" className={css(app.btn)} onClick={() => setShowForm(true)}>{__('create new note')}</button>}
        {isLoading === 'allNotes'
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 70,
              transform: 'scale(0.7)',
            }}
            />
          )
          : renderAllNotes()}
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="red"
        btnTxt="Ok"
        show={confMdl.show}
        close={closeConfMdl}
        action={deleteNote}
        title={__('Confirmation')}
      >
        <div className="txt-center mt-5 mb-4">
          {__('Are you sure to delete this note')}
        </div>
        {isLoading && (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )}
      </ConfirmModal>
    </>
  )
}
