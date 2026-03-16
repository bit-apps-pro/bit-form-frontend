/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { useAsyncDebounce } from 'react-table'
import { $unsplashImgUrl } from '../../../GlobalStates/GlobalStates'
import CPTIcn from '../../../Icons/CPTIcn'
import SearchIcon from '../../../Icons/SearchIcon'
import ut from '../../../styles/2.utilities'
import LoaderSm from '../../Loaders/LoaderSm'

function UnsplashImageViewer({ setModal, selected = '', uploadLbl = '' }) {
  const { fieldKey: fldKey } = useParams()
  const setUnsplashImgUrl = useSetAtom($unsplashImgUrl)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [dnLoading, setDnLoading] = useState(false)
  const [selectUrl, setSelectUrl] = useState('')
  const [images, setImages] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [scrollLoading, setScrollLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [collectionPageNo, setCollectionPageNo] = useState(1)
  const [total, setTotal] = useState(10001)
  const { css } = useFela()
  const clientId = ''
  const ref = useRef()

  const [collections, setCollections] = useState([])

  const onFetchData = (val) => {
    setSearchLoading(true)
    // const searchValue = searchTerm !== '' ? `&t=1_tag_${val}` : ''
    if (val) {
      fetch(`https://api.unsplash.com/search/photos/?query=${val}&client_id=${clientId}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setImages(data.results)
            setTotal(data.results.length)
            setPageNo(1)
          }
          ref?.current?.scrollToTop(0)
          setSearchLoading(false)
        })
    } else {
      fetch(`https://api.unsplash.com/photos/?client_id=${clientId}&per_page=30&page=1`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setTotal(data.length)
            setImages(data)
          }
          setSearchLoading(false)
        })
    }
  }
  const debouncedSearchTerm = useAsyncDebounce(onFetchData, 500)

  const onSearchChange = ({ target: { value } }) => {
    setSearchTerm(value)
    debouncedSearchTerm(value)
  }

  useEffect(() => {
    setSelectUrl('')
    setFiles([])
    setImages([])
    setLoading(true)
    fetch(`https://api.unsplash.com/photos/?client_id=${clientId}&per_page=30&page=${pageNo}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setTotal(data.length)
          setImages(data)
        }
        setLoading(false)
      })

    fetch(`https://api.unsplash.com/collections/?client_id=${clientId}&page=${collectionPageNo}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setCollections(data)
        }
        setLoading(false)
      })
  }, [])

  const saveImage = () => {
    // setDnLoading(true)
    setUnsplashImgUrl(selectUrl)
    setModal(false)
  }

  const errHandle = (e) => {
    e.target.parentNode.style.display = 'none'
  }

  const onScrollFetch = (e) => {
    const bottom = (e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight - 100
    if (bottom <= 0 && images.length <= total) {
      setScrollLoading(true)
      fetch(`https://api.unsplash.com/photos/?client_id=${clientId}&per_page=30&page=${pageNo + 1}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setImages(images.concat(data))
            setPageNo(prev => prev + 1)
            setTotal(total + data.length)
          }
          setScrollLoading(false)
        })
    }
  }

  const searchByCollections = (index, id, status) => {
    const tmp = [...collections]
    tmp.map(item => {
      item.status = false
    })
    if (!status) {
      tmp[index].status = true
    } else {
      tmp[index].status = false
    }
    setCollections(tmp)

    if (collections.length && !status) {
      fetch(`https://api.unsplash.com/collections/${id}/photos?client_id=${clientId}&per_page=30`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setImages(data)
            setTotal(data.length)
          }
        })
    } else {
      fetch(`https://api.unsplash.com/photos/?client_id=${clientId}&per_page=30&page=${pageNo}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setImages(data)
            setTotal(data.length)
          }
        })
    }
  }

  const handlePrefixIcon = (imgUrl) => {
    setSelectUrl(imgUrl)
  }

  return (
    <div>
      <div className={css(ut.mt2, ut.flxc, { flxp: 1, jc: 'center' })}>
        {collections.map((collection, i) => (
          <button
            data-testid="icn-pck-btn"
            key={collection.title}
            title={collection.title}
            onClick={() => searchByCollections(i, collection.id, collection.status)}
            type="button"
            className={`${css(s.chip, ut.mr2)} ${collection.status && css(s.collectionActive)}`}
          >
            {collection.title}
          </button>
        ))}
      </div>
      <div className={css(ut.flxc, s.searchBar, ut.mt2, ut.mb2)}>

        <div className={css(s.fields_search)}>
          <input
            data-testid="icns-mdl-srch-inp"
            title="Search Images"
            aria-label="Search Images"
            placeholder="e.g. Abstract, Nature, People, etc."
            id="search-icon"
            type="search"
            name="searchIcn"
            value={searchTerm}
            onChange={onSearchChange}
            className={css(s.search_field)}

          />
          <span title="search" className={css(s.search_icn)}>
            <SearchIcon size="20" />
          </span>
        </div>

        <div>
          {searchLoading && <LoaderSm size={20} clr="#13132b" />}
        </div>

      </div>
      <Scrollbars ref={ref} style={{ minHeight: 350 }} onScroll={onScrollFetch}>
        {loading && (
          <div title="Loading...">
            <div className={css(ut.mt2)} />
            {Array(26).fill(1).map((itm, i) => (
              <div key={`loderfnt-${i * 2}`} title="Loading..." className={`${css(s.loadingPlaceholder)} loader`} />
            ))}
          </div>
        )}
        <div className={css(ut.mt2, s.imgWrp)}>
          {images.map((item) => (
            <button
              type="button"
              key={`(${item.id})`}
              title={`(${item.description})`}
              className={`${css(s.imageBtn)} ${item.urls.regular === selectUrl && css(s.active)}`}
              onClick={() => handlePrefixIcon(item.urls.regular)}
            >
              <img
                src={`${item.urls.thumb}`}
                onError={errHandle}
                alt={item.id}
                className={css(s.img)}
              />
            </button>
          ))}
        </div>
        {scrollLoading && (
          <div title="Loading...">
            <div className={css(ut.mt2)} />
            {Array(26).fill(1).map((itm, i) => (
              <div key={`loderfnt--${i * 2}`} title="Loading..." className={`${css(s.loadingPlaceholder)} loader`} />
            ))}
          </div>
        )}
      </Scrollbars>
      <button
        data-testid="icn-dwnld-n-sav"
        type="button"
        disabled={!selectUrl}
        className={css(s.saveBtn, s.btnPosition)}
        onClick={saveImage}
      >
        <span className={css(ut.mr1, { dy: 'flex' })}><CPTIcn size="20" /></span>
        Save
        {dnLoading && <LoaderSm size={20} clr="#fff" className={ut.ml2} />}
      </button>
    </div>
  )
}

const s = {
  // scrollBar: { scrollBehavior: 'auto !important', '& *': { scrollBehavior: 'auto !important' } },
  loadingPlaceholder: {
    w: 150,
    h: 100,
    brs: 8,
    lh: 2,
    my: 3,
    mx: 5,
    dy: 'inline-block',
  },
  chip: {
    bd: 'var(--b-100-48-1)',
    b: 'none',
    brs: 50,
    p: '6px 16px',
    cr: 'var(--b-37-18)',
    m: '0px 7px 6px 0px',
    curp: 1,
    tn: 'background .3s',
    ':hover': { bd: 'var(--b-90)' },
  },
  active: { oe: '4px solid var(--blue)' },
  collectionActive: {
    bd: 'var(--b-50) !important',
    cr: 'var(--white-100) !important',
  },
  imgWrp: {
    dy: 'flex',
    flxp: 'wrap',
    jc: 'center',
    w: '100%',
  },
  imageBtn: {
    p: 0,
    mxh: 200,
    dy: 'block',
    bd: 'none',
    b: 'none',
    m: 5,
    brs: 8,
    curp: 1,
    ':hover': { oe: '4px solid var(--blue)' },
  },
  img: {
    brs: 8,
    h: 200,
  },
  searchBar: {
    pn: 'relative',
    zx: 99,
  },
  btnColor: { cr: 'var(--b-50)' },
  fields_search: {
    pn: 'relative',
    ml: 7,
    mr: 5,
    tn: 'width .2s',
    w: '100%',
  },
  search_icn: {
    pn: 'absolute',
    tp: '50%',
    mx: 9,
    lt: 0,
    tm: 'translateY(-50%)',
    cr: 'var(--white-0-75)',
    curp: 1,
    '& svg': { dy: 'block' },
  },
  search_field: {
    w: '100%',
    fw: 500,
    fs: '14px !important',
    oe: 'none',
    b: '1px solid var(--white-0-75) !important',
    brs: '20px !important',
    pl: '35px !important',
    pr: '5px !important',
    pb: '5px !important',
    pt: '5px !important',
    ':focus': {
      bs: '0px 0px 0px 1.5px var(--b-50) !important',
      bcr: 'var(--b-92-62) !important',
      pr: '0px !important',
      '& ~ .shortcut': { dy: 'none' },
      '& ~ span svg': { cr: 'var(--b-50)' },
    },
    '::placeholder': { fs: 12 },
    '::-webkit-search-cancel-button': {
      appearance: 'none',
      w: 14,
      h: 14,
      mr: 10,
      bd: 'var(--white-0-83)',
      curp: 1,
      backgroundPosition: '54% 50% !important',
      // eslint-disable-next-line quotes
      bi: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='Black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E")`,
      brs: 20,
    },
  },
  saveBtn: {
    b: 'none',
    bd: 'var(--b-50)',
    brs: 8,
    fw: 500,
    p: '5px 10px',
    cr: 'var(--white-100)',
    flxc: 1,
    flx: 'center',
    mt: 5,
    ml: 'auto',
    mr: 5,
    curp: 1,
    tn: 'background .3s',
    ':hover:not(:disabled)': { bd: 'var(--b-36)' },
    ':disabled': { bd: 'var(--b-13-88)', cr: 'var(--b-16-35)', cur: 'not-allowed' },
  },
}
export default UnsplashImageViewer
