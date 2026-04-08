/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import { create } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useAsyncDebounce } from 'react-table'
import { useAtom } from 'jotai'
import { $fields } from '../../GlobalStates/GlobalStates'
import { $allStyles } from '../../GlobalStates/StylesState'
import CloseIcn from '../../Icons/CloseIcn'
import CPTIcn from '../../Icons/CPTIcn'
import DownloadIcon from '../../Icons/DownloadIcon'
import FileUploadIcn from '../../Icons/FileUploadIcn'
import SearchIcon from '../../Icons/SearchIcon'
import ut from '../../styles/2.utilities'
import app from '../../styles/app.style'
import bitsFetch from '../../Utils/bitsFetch'
import { deepCopy } from '../../Utils/Helpers'
import LoaderSm from '../Loaders/LoaderSm'
import ConfirmModal from '../Utilities/ConfirmModal'
import StyleSegmentControl from '../Utilities/StyleSegmentControl'
import Grow from './StyleCustomize/ChildComp/Grow'

function IconsModal({
  iconType, setModal, optIndx, setOption, option, selected = '', uploadLbl = '', unsplash = false,
}) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const [controller, setController] = useState({ parent: selected || 'Icons' })
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [dnLoading, setDnLoading] = useState(false)
  const [prefix, setPrefix] = useState({})
  const [icons, setIcons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [scrollLoading, setScrollLoading] = useState(false)
  const uploadLabel = uploadLbl || 'Upload Icon'
  const [total, setTotal] = useState(10001)
  const [showWarning, setShowWarning] = useState(false)
  const [selectIcon, setSelectIcon] = useState()
  const { css } = useFela()
  const url = 'https://raw.githack.com'
  const ref = useRef()
  const [allStyles, setAllStyles] = useAtom($allStyles)
  const clientId = 'n3pcVfA-CTg4OlOQsM3m6lEWLISyoSbtDqP2CfoukyU'
  const [pageNo, setPageNo] = useState(1)
  const [images, setImages] = useState([])
  const [selectUrl, setSelectUrl] = useState('')
  const [collectionPageNo, setCollectionPageNo] = useState(1)

  const segmentOptions = [
    { label: 'Icons', show: ['label'] },
    { label: uploadLabel },
    { label: 'Downloaded Icons' },
  ]

  if (unsplash) {
    segmentOptions.push({ label: 'Unsplash' })
  }

  const iconPacks = [
    { label: 'Font Awesome', value: 't=2_id_fontawesome', id: 'font-awesome', status: false },
    { label: 'Bootstrap', value: 't=2_id_bootstrapicons', id: 'bootstrap-icons', status: false },
    { label: 'Material Design', value: 't=2_id_materialdesign-icons', id: 'material-design-icons', status: false },
    { label: 'Ion', value: 't=2_id_ionicons', id: 'ionicons', status: false },
    { label: 'Octicons', value: 't=2_id_octicons', id: 'octicons', status: false },
    { label: 'CSS.GG', value: 't=2_id_css.gg', id: 'css.gg', status: false },
    { label: 'Feather', value: 't=2_id_feather', id: 'feather', status: false },
    { label: 'Carbon', value: 't=2_id_carbonicons', id: 'carbon-icons', status: false },
    { label: 'Typicons', value: 't=2_id_typicons', id: 'typicons', status: false },
    { label: 'Vscode', value: 't=2_id_vscodecodicons', id: 'vscode-codicons', status: false },
    { label: 'Simple', value: 't=2_id_simpleicons', id: 'simple-icons', status: false },
  ]
  const [filter, setFilter] = useState(iconPacks || [])

  const [collections, setCollections] = useState([])

  const existFilter = () => {
    if (searchTerm) return 'nofilter=true'
    const exit = filter.find(item => item.status === true)
    let filterByIconPack = ''
    if (exit) {
      filterByIconPack = filter.map((elem) => elem.value).join('&')
    }
    return filterByIconPack
  }

  const onFetchData = (val) => {
    setSearchLoading(true)
    const searchValue = searchTerm !== '' ? `&t=1_tag_${val}` : ''
    fetch(`https://icons.bitapps.pro/search?c=0&${existFilter()}${searchValue}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          let icns = data.results
          if (filter.find(term => term.status)) {
            icns = icns?.filter(icn => filter.find(f => f.id === icn.id)?.status)
          }
          setIcons(icns)
          setTotal(data.total)
        }
        ref?.current?.scrollToTop(0)
        setSearchLoading(false)
      })
  }
  const debouncedSearchTerm = useAsyncDebounce(onFetchData, 500)

  const onSearchChange = ({ target: { value } }) => {
    setSearchTerm(value)
    debouncedSearchTerm(value)
  }

  const onTabChangeHandler = (lbl, type) => {
    if (type === 'parent') setController({ parent: lbl })
    else if (type === 'child') setController(old => ({ ...old, child: lbl }))
  }

  const setWpMedia = () => {
    if (typeof wp !== 'undefined' && wp.media) {
      const wpMediaMdl = wp.media({
        title: 'Media',
        button: { text: 'Select picture' },
        library: { type: 'image' },
        multiple: false,
      })

      wpMediaMdl.on('select', () => {
        const attachment = wpMediaMdl.state().get('selection').first().toJSON()
        // fieldData[iconType] = attachment.url
        // setFields(allFields => create(allFields, draft => {
        //   draft[fldKey] = fieldData
        // }))
        const newOption = create(option, draft => {
          draft[optIndx].img = attachment.url
        })

        setOption(newOption)
        // reCalculateFldHeights(fldKey)
        setModal(false)
      })

      wpMediaMdl.open()
    }
  }

  useEffect(() => {
    setPrefix({})
    setFiles([])
    setIcons([])
    if (controller.parent === 'Icons') {
      setLoading(true)
      fetch('https://icons.bitapps.pro/search?c=0&')
        .then(response => response.json())
        .then(data => {
          if (data) {
            setTotal(data.total)
            setIcons(data.results)
          }
          setLoading(false)
        })
    }
    if (controller.parent === 'Downloaded Icons') {
      setLoading(true)
      bitsFetch({}, 'bitforms_get_download_icn').then((res) => {
        if (res !== undefined && res.success) {
          setFiles(res?.data)
        }
        setLoading(false)
      })
    }
  }, [controller])

  const saveIcn = () => {
    setDnLoading(true)
    bitsFetch({ id: prefix.id, src: prefix.url }, 'bitforms_icn_save_setting')
      .then(res => {
        if (res !== undefined && res.success) {
          fieldData[iconType] = res.data
          // let newFields = fields
          // setFields(allFields => {
          //   newFields = create(allFields, draft => { draft[fldKey] = fieldData })
          //   return newFields
          // })
          // reCalculateFldHeights(fldKey)
          // addToBuilderHistory({
          //   event: `${iconElementLabel[iconType]} Icon Added`,
          //   type: `add_${iconType}`,
          //   state: { fldKey, fields: newFields },
          // })
          const newOption = create(option, draft => {
            draft[optIndx].img = res.data
          })

          setOption(newOption)

          setModal(false)
        }
        setDnLoading(false)
        setModal(false)
      })
  }

  const delIcon = file => {
    setFiles(prv => prv.filter(fil => fil !== file))
    const fileNameRegex = new RegExp(file, 'gi')
    if (fieldData[iconType]?.match(fileNameRegex)) {
      delete fieldData[iconType]
      setFields(allFields => create(allFields, draft => { draft[fldKey] = fieldData }))
    }

    bitsFetch({ file }, 'bitforms_icon_remove')
      .then(res => {
        if (res !== undefined && res.success) {
          setFiles(res.data)
        }
      })
    toast.success('Icon Removed Successfully')
    setShowWarning(false)
  }

  const errHandle = (e) => {
    e.target.parentNode.style.display = 'none'
  }

  const onScrollFetch = (e) => {
    const bottom = (e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight - 100
    const searchValue = searchTerm !== '' ? `&t=1_tag_${searchTerm}` : ''
    if (bottom <= 0 && icons.length < total) {
      setScrollLoading(true)
      fetch(`https://icons.bitapps.pro/search?c=${icons.length}&${existFilter()}${searchValue}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setIcons(icons.concat(data.results))
          }
          setScrollLoading(false)
        })
    }
  }

  const searchByIconPack = (index, value, status) => {
    const tmp = [...filter]
    if (status === false) {
      tmp[index].value = `t=1_id_${value.replace('t=2_id_', '')}`
      tmp[index].status = true
    } else {
      tmp[index].value = `t=2_id_${value.replace('t=1_id_', '')}`
      tmp[index].status = false
    }
    setFilter(tmp)
    const searchValue = searchTerm !== '' ? `&t=1_tag_${searchTerm}` : ''
    if (filter.length) {
      fetch(`https://icons.bitapps.pro/search?c=0&${existFilter()}${searchValue}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            let icns = data.results
            if (filter.find(term => term.status)) {
              icns = icns?.filter(icn => filter.find(f => f.id === icn.id)?.status)
            }
            setIcons(icns)
            setTotal(data.total)
          }
        })
    }
  }

  const selectedSaveIcon = () => {
    // fieldData[iconType] = prefix
    // const newFields = create(fields, draft => { draft[fldKey] = fieldData })
    // setFields(newFields)
    const newOption = create(option, draft => {
      draft[optIndx].img = prefix.url
    })

    setOption(newOption)

    setModal(false)
    // addToBuilderHistory({
    //   event: `${iconElementLabel[iconType]} Icon Added`,
    //   type: `add_${iconType}`,
    //   state: { fldKey, fields: newOption },
    // })
    // reCalculateFldHeights(fldKey)
  }

  const handlePrefixIcon = (id, iconUrl) => {
    setPrefix({ id, url: iconUrl })
  }
  // for unsplash image
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

  // image search
  // const onFetchImageData = (val) => {
  //   setSearchLoading(true)
  //   // const searchValue = searchTerm !== '' ? `&t=1_tag_${val}` : ''
  //   if (val) {
  //     fetch(`https://api.unsplash.com/search/photos/?query=${val}&client_id=${clientId}`)
  //       .then(response => response.json())
  //       .then(data => {
  //         if (data) {
  //           setImages(data.results)
  //           setTotal(data.results.length)
  //           setPageNo(1)
  //         }
  //         ref?.current?.scrollToTop(0)
  //         setSearchLoading(false)
  //       })
  //   } else {
  //     fetch(`https://api.unsplash.com/photos/?client_id=${clientId}&per_page=30&page=1`)
  //       .then(response => response.json())
  //       .then(data => {
  //         if (data) {
  //           setTotal(data.length)
  //           setImages(data)
  //         }
  //         setSearchLoading(false)
  //       })
  //   }
  // }

  // const debouncedSearchImageTerm = useAsyncDebounce(onFetchImageData, 500)
  // const onImageSearchChange = ({ target: { value } }) => {
  //   setSearchImageTerm(value)
  //   debouncedSearchImageTerm(value)
  // }

  const handleImage = (image) => {
    setPrefix({ id: image.id, url: image.urls.regular })
  }

  return (
    <div>
      <StyleSegmentControl
        options={segmentOptions}
        onChange={lbl => onTabChangeHandler(lbl, 'parent')}
        defaultActive={controller.parent}
        defaultItmWidth={220}
        wideTab
        className={css(ut.mt1)}
      />
      <Grow open={controller.parent === 'Icons'}>
        <div className={css(ut.mt2, ut.flxc, { flxp: 1, jc: 'center' })}>
          {filter.map((iconPack, i) => (
            <button
              data-testid="icn-pck-btn"
              key={iconPack.label}
              title={iconPack.label}
              onClick={() => searchByIconPack(i, iconPack.value, iconPack.status)}
              type="button"
              className={`${css(s.chip, ut.mr2)} ${iconPack.status && css(s.active)}`}
            >
              {iconPack.label}
            </button>
          ))}
        </div>
        <div className={css(ut.flxc, s.searchBar, ut.mt2, ut.mb2)}>
          <div className={css(s.fields_search)}>
            <input
              data-testid="icns-mdl-srch-inp"
              title="Search Icons"
              aria-label="Search Icons"
              placeholder="Search in 10,000+ icons by keywords one at a time. e.g., user or login or etc..."
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
                <div
                  key={`loading-${i * 2}`}
                  title="Loading..."
                  className={`${css(s.loadingPlaceholder)} loader`}
                />
              ))}
            </div>
          )}
          <div className={css(ut.flxc, ut.mt2, s.icon)}>
            {icons.map((item) => (
              <button
                data-testid={`inc-prv-btn-${item.name}`}
                type="button"
                key={`${item.name} (${item.id})`}
                title={`${item.name} (${item.id})`}
                className={`${css(s.icnBtn)} ${url + item.url === prefix.url && css(s.active, s.activeIcn)}`}
                onClick={() => handlePrefixIcon(item.id, url + item.url)}
              >
                <img
                  src={`${url}${item.url}`}
                  onError={errHandle}
                  alt={item.name}
                  className={css(s.img)}
                />
              </button>
            ))}
          </div>
          {scrollLoading && (
            <div title="Loading...">
              <div className={css(ut.mt2)} />
              {Array(26).fill(1).map((itm, i) => (
                <div
                  key={`loading-2--${i * 2}`}
                  title="Loading..."
                  className={`${css(s.loadingPlaceholder)} loader`}
                />
              ))}
            </div>
          )}
        </Scrollbars>
        <button
          data-testid="icn-dwnld-n-sav"
          type="button"
          disabled={!prefix.url}
          className={css(s.saveBtn, s.btnPosition)}
          onClick={saveIcn}
        >
          <span className={css(ut.mr1)}><DownloadIcon size="19" /></span>
          Download & save
          {dnLoading && <LoaderSm size={20} clr="#fff" className={ut.ml2} />}
        </button>

      </Grow>
      <Grow open={controller.parent === 'Unsplash'}>
        <div>
          <div className={css(ut.mt2, ut.flxc, { flxp: 1, jc: 'center' })}>
            {collections.map((collection, i) => (
              <button
                data-testid="icn-pck-btn"
                key={collection.title}
                title={collection.title}
                onClick={() => searchByCollections(i, collection.id, collection.status)}
                type="button"
                className={`${css(s.chip, ut.mr2)} ${collection.status && css(s.active)}`}
              >
                {collection.title}
              </button>
            ))}
          </div>
          {/* <div className={css(ut.flxc, s.searchBar, ut.mt2, ut.mb2)}>

            <div className={css(s.fields_search)}>
              <input
                data-testid="icns-mdl-srch-inp"
                title="Search Images"
                aria-label="Search Images"
                placeholder="e.g. Abstract, Nature, People, etc."
                id="search-icon"
                type="search"
                name="searchIcn"
                value={searchImageTerm}
                onChange={onImageSearchChange}
                className={css(s.search_field)}
              />
              <span title="search" className={css(s.search_icn)}>
                <SearchIcon size="20" />
              </span>
            </div>

            <div>
              {searchLoading && <LoaderSm size={20} clr="#13132b" />}
            </div>

          </div> */}

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
                  className={`${css(s.imageBtn)} ${item.urls.regular === prefix.url && css(s.activeImg)}`}
                  onClick={() => handleImage(item)}
                >
                  <img
                    src={item.urls.thumb}
                    onError={errHandle}
                    alt={item.id}
                    className={css(s.imgH)}
                  />
                </button>
              ))}
            </div>
            {scrollLoading && (
              <div title="Loading...">
                <div className={css(ut.mt2)} />
                {Array(26).fill(1).map((itm, i) => (
                  <div
                    key={`loderfnt--${i * 2}`}
                    title="Loading..."
                    className={`${css(s.loadingPlaceholder)} loader`}
                  />
                ))}
              </div>
            )}
          </Scrollbars>

          <button
            data-testid="icn-dwnld-n-sav"
            type="button"
            disabled={!prefix.url}
            className={css(s.saveBtn, s.btnPosition)}
            onClick={selectedSaveIcon}
          >
            <span className={css(ut.mr1, { dy: 'flex' })}><CPTIcn size="20" /></span>
            Save
            {dnLoading && <LoaderSm size={20} clr="#fff" className={ut.ml2} />}
          </button>
        </div>

      </Grow>

      <Grow open={controller.parent === uploadLabel}>
        <button type="button" className={css(s.upBtn)} onClick={setWpMedia}>
          <FileUploadIcn w="35" />
          {' '}
          Browse
        </button>
      </Grow>

      <Grow open={controller.parent === 'Downloaded Icons'}>
        {loading && (
          <div className={css({ h: 300 })}>
            <div title="Loading..." className={css({ flxp: 'wrap', jc: 'center', flx: 1 })}>
              {Array(22).fill(1).map((itm, i) => (
                <div key={`loading-3-${i * 2}`} title="Loading..." className={`${css(s.loadingPlaceholder)} loader`} />
              ))}
            </div>
          </div>
        )}
        {!loading && (
          <Scrollbars ref={ref} style={{ minHeight: '300px' }}>
            <div className={css(ut.flxc, ut.mt4, s.icon)}>
              {!!files.length && files.map((file, index) => (
                <div
                  key={`download-icn-${index * 2}`}
                  className={css(ut.flxc, ut.mt2, s.downloadedBtnWrapper)}
                  data-file={file}
                  style={{ display: 'inline-block' }}
                >
                  <button
                    data-testid={`dwnlodd-inc-del-btn-${index}`}
                    type="button"
                    className={`${css(s.delBtn)} trash`}
                    title="Delete"
                    onClick={() => {
                      setShowWarning(true)
                      setSelectIcon(file)
                    }}
                  >
                    <CloseIcn size={10} />
                  </button>
                  <button
                    data-testid={`dwnlodd-inc-prv-btn-${index}`}
                    onClick={() => handlePrefixIcon(file.id, `${bits.iconURL}/${file}`)}
                    type="button"
                    key={`download-icn-${index + (Math.random() * 5)}`}
                    title={file.name}
                    className={`${css(s.icnBtn)} ${`${bits.iconURL}/${file}` === prefix.url && css(s.active)}`}
                  >
                    <img src={`${bits.iconURL}/${file}`} alt={`icon-${file}`} width="40" height="30" />
                  </button>
                </div>
              ))}
            </div>
          </Scrollbars>
        )}
        <button
          data-testid="icn-sav-btn"
          type="button"
          disabled={!prefix.url}
          className={css(app.btn, s.saveBtn)}
          onClick={selectedSaveIcon}
        >
          Save
        </button>
      </Grow>

      <ConfirmModal
        title="Warning"
        action={() => delIcon(selectIcon)}
        show={showWarning}
        body="Are you sure you want to delete this icon? This icon will not be available in the forms where it has been used."
        btnTxt="Okay"
        close={() => setShowWarning(false)}
      />
    </div>
  )
}

const s = {
  scrollBar: { scrollBehavior: 'auto !important', '& *': { scrollBehavior: 'auto !important' } },
  loadingPlaceholder: {
    w: 40, h: 40, brs: 8, lh: 2, my: 3, mx: 5, dy: 'inline-block',
  },
  downloadedBtnWrapper: {
    pn: 'relative',
    dy: 'inline-block',
    '&:hover > .trash':
      { flx: 'align-center' },
  },
  delBtn: {
    pn: 'absolute',
    bd: '#ffa1a1',
    b: 'none',
    brs: 20,
    h: 20,
    dy: 'none',
    w: 20,
    curp: 1,
    rt: -3,
    tp: -3,
    ':hover': { bd: '#ff7d7d' },
  },
  icon: { dy: 'inline-block' },
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
  active: {
    bd: 'var(--b-50) !important',
    cr: 'var(--white-100) !important',
  },
  activeIcn: { fr: 'invert(100%) sepia(0%) saturate(6403%) hue-rotate(223deg) brightness(126%) contrast(109%)' },
  icnBtn: {
    p: '4px',
    mnw: 45,
    h: 45,
    dy: 'inline-grid',
    placeContent: 'center',
    bd: 'transparent',
    b: 'none',
    brs: 8,
    curp: 1,
    ':hover': { bd: 'var(--white-0-95)' },
  },
  img: { h: 25 },
  imgH: {
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
  upBtn: {
    b: '1px solid var(--b-38-89)',
    w: '80%',
    bd: 'var(--b-36-96)',
    fs: 20,
    mx: 'auto',
    h: 100,
    flx: 'center',
    fd: 'column',
    brs: 20,
    mt: 10,
    cr: 'var(--b-54-31)',
    curp: 1,
    ':hover': { bd: 'var(--b-50-95)' },
    ':focus-visible': { focusShadow: 1 },
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
  imgWrp: {
    dy: 'flex',
    flxp: 'wrap',
    jc: 'center',
    w: '100%',
  },
  activeImg: { oe: '4px solid var(--blue)' },
}
export default IconsModal
