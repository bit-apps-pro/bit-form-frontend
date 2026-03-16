/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAtomValue } from 'jotai'
import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { $newFormId } from '../../GlobalStates/GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import FormImporter from '../FormImporter'
import Btn from '../Utilities/Btn'
import Modal from '../Utilities/Modal'
import ProModal from '../Utilities/ProModal'
import FormTemplateCard from './FormTemplateCard'
import { getTemplateByCategory, searchTemplateItem, templateMenuList, ucFirst } from './templateHelpers'
import templateList from './templateList'

export default function FormTemplates({ setTempModal, setSnackbar }) {
  const { css } = useFela()
  const scrollRaf = useRef(null)
  const navRaf = useRef(null)
  // const containerRef = useRef(null)
  const [modal, setModal] = useState(false)
  const newFormId = useAtomValue($newFormId)

  const [searchTemplate, setSearchTemplate] = useState({ isSearch: false, list: [] })

  const handleMenuItemClick = (id) => {
    setSearchTemplate({
      isSearch: false,
      list: [],
    })
    const section = scrollRaf.current.children[id]
    section.scrollIntoView({ behavior: 'smooth' })
    const children = navRaf.current.querySelectorAll('li')

    children.forEach(item => {
      if (item.id === id) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }

  let debounceTimeout

  const handleSearch = (events) => {
    const searchKey = events.target.value
    const key = searchKey.toLowerCase().trim()

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    debounceTimeout = setTimeout(() => {
      if (key) {
        const list = searchTemplateItem(key) || []
        setSearchTemplate({
          isSearch: true,
          list,
        })
      } else {
        setSearchTemplate({
          isSearch: false,
          list: [],
        })
      }
    }, 300)
  }

  const categoryTemplateList = getTemplateByCategory()

  // const handleScroll = () => {
  //   const scroll = scrollRaf.current
  //   const selectChild = scroll.querySelectorAll('div>div')
  //   selectChild.forEach((child, index) => {
  //     const childRect = child.getBoundingClientRect()
  //     const scrollRect = scroll.getBoundingClientRect()
  //     const nav = navRaf.current

  //     console.log('childRect= ', childRect)
  //     // console.log('scrollRect= ', scrollRect)

  //     // if (childRect.top <= scrollRect.top && childRect.bottom > scrollRect.bottom) {
  //     //   nav[index].classList.add('active')
  //     // } else {
  //     //   nav[index].classList.remove('active')
  //     // }
  //   })
  // }

  // useEffect(() => {
  //   scrollRaf.current.addEventListener('scroll', handleScroll)

  //   return () => {
  //     scrollRaf.current.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])

  return (
    <>
      <div className={css(formTemplateStyles.main)}>
        <aside className={css(formTemplateStyles.aside)}>
          <h2 className={css(formTemplateStyles.heading)}>
            {__('Form Templates')}
            <span className={css(formTemplateStyles.tempCount)}>{templateList.length}</span>
          </h2>
          <hr />
          <div className={css(formTemplateStyles.category)}>
            <ul ref={navRaf} className={css({ m: 0 })}>
              {templateMenuList().map((item) => (
                <li
                  key={item.category}
                  role="button"
                  className={`${css(formTemplateStyles.nav)} ${item.category === 'basic' ? 'active' : ''}`}
                  onClick={() => handleMenuItemClick(item.category)}
                  id={item.category}
                >
                  <div className={css(formTemplateStyles.navItem)}>
                    <span className={css(formTemplateStyles.title)}>
                      {__(item.name)}
                      {item?.isNew && (
                        <span className={css(formTemplateStyles.navNewTip)}>
                          New (
                          {item.newCount}
                          )
                        </span>
                      )}
                    </span>
                    <span className={css(formTemplateStyles.tempCount)}>
                      {item.count}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className={css(formTemplateStyles.tem)}>
          <div className={css(formTemplateStyles.searchWrp)}>
            <input
              aria-label="Search Template"
              type="search"
              className={`btcd-paper-inp mt-1 ${css(formTemplateStyles.search)}`}
              onChange={e => handleSearch(e)}
              placeholder="Search Template"
            />
            <Btn onClick={() => setModal(true)}>
              {__('Import Form')}
            </Btn>
          </div>
          <div ref={scrollRaf} className={css(formTemplateStyles.cateWrap)}>
            {!searchTemplate.isSearch && Object.keys(categoryTemplateList).toSorted().map((item) => (
              <div
                key={`item-${item}`}
                className={css({ mt: 15 })}
                id={item.toLowerCase()}
              // ref={()}
              >
                <h3 className={css(formTemplateStyles.wrapHead)}>{__(ucFirst(item))}</h3>
                <hr />
                <div className={`${css(formTemplateStyles.template_gallery)} bf-template-gallery`}>
                  {categoryTemplateList[item].map((itm, index) => (
                    <FormTemplateCard key={`${itm.title}-${index + 2}`} item={itm} />
                  ))}
                </div>
              </div>
            ))}

            {searchTemplate.isSearch && searchTemplate.list && (
              <div className="form-template-wrap">
                <h3 className={css(formTemplateStyles.wrapHead)}>{__('Search Result')}</h3>
                <hr />
                <div className={`${css(formTemplateStyles.template_gallery)} bf-template-gallery`}>
                  {searchTemplate.list?.map(item => <FormTemplateCard key={item.title} item={item} />)}
                </div>
                {searchTemplate.list.length === 0 && (
                  <p className={css(formTemplateStyles.wrapHead, { cr: 'red' })}>
                    {__('No Template Found')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        show={modal}
        setModal={setModal}
        title={__('Import Form')}
        subTitle=""
      >
        <FormImporter
          setModal={setModal}
          setTempModal={setTempModal}
          newFormId={newFormId}
          setSnackbar={setSnackbar}
        />
      </Modal>

      <ProModal />
    </>
  )
}

const formTemplateStyles = {
  main: {
    flx: 1,
  },
  aside: {
    d: 'inline-block',
    // p: '20px',
    mnh: '80vh',
    br: '1px solid var(--white-0-90)',
    w: 220,
  },
  heading: {
    fs: 18,
    my: 10,
    cr: 'var(--gray-4)',
    flx: 'center-between',
    mr: 15,
  },
  category: {
    mr: 5,
  },
  tem: {
    w: 'calc(100% - 220px)',
    m: 10,
  },
  searchWrp: {
    flx: 'center-between',
    ml: 10,
    mb: 20,
  },
  search: {
    cr: 'var(--dp-blue-bg)',
    h: 'auto',
    w: '50%',
    ff: 'inherit',
    fs: 16,
    p: 10,
    oe: 'none !important',
    brs: 8,
    // mnh: '15px !important',
    b: '1px solid var(--white-0-89) !important',
    tn: 'box-shadow 0.3s !important',
    // ml: 10,
  },
  cateWrap: {
    h: 'calc(100vh - 200px)',
    ow: 'scroll',
    mt: 10,
    pl: 10,
  },
  wrapHead: {
    fs: 18,
    my: 10,
  },
  template_gallery: {
    dy: 'grid',
    grdTmClm: 'repeat(4, 1fr)',
    gp: 20,
    p: 10,
  },
  nav: {
    dy: 'block',
    cur: 'pointer',
    brs: 8,
    p: 10,
    cr: 'var(--gray-4)',
    ':hover': {
      cr: 'var(--b-50)',
      bc: 'var(--b-79-96)',
    },
    '&.active': {
      cr: 'var(--b-50)',
      bc: 'var(--b-79-96)',
      fw: 600,
    },
  },
  navItem: {
    flx: 'center-between',
  },
  navNewTip: {
    cr: '#fff',
    bc: 'tomato',
    p: '3px 5px',
    brs: 5,
    ml: 5,
    fs: 10,
  },
  tempCount: {
    bc: 'var(--b-79-96)',
    cr: 'var(--b-50)',
    p: '3px 5px',
    brs: 5,
  },
}
