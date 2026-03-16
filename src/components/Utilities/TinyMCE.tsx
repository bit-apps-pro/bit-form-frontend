/* eslint-disable object-shorthand */

/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import { SmartTagField } from '../../Utils/StaticData/SmartTagField'
import { filterFieldTypesForTinyMce } from '../../Utils/StaticData/allStaticArrays'
import { loadScript } from '../../Utils/globalHelpers'
import '../../resource/css/tinymce.css'

export default function TinyMCE({
  id,
  value,
  formFields,
  smartTags = true,
  onChangeHandler,
  toolbarMnu,
  menubar,
  height,
  width,
  disabled,
  plugins,
  mapAllFieldWithTable,
  mapAllField,
  shortCodeList,
}: TinyMCEProps) {
  const editorId = `${id}-settings`
  const CDN_SOURCE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.11'
  const [isLoaded, setIsLoaded] = useState(
    typeof window.tinymce !== 'undefined',
  )
  const editorLoadedFromCDN = isLoaded && window.tinymce.baseURI.source === CDN_SOURCE_URL
  const loadTinyMceScript = async () => {
    const res = await loadScript({
      src: `${CDN_SOURCE_URL}/tinymce.min.js`,
      integrity: 'sha256-SnRzknLClR3GaNw9oN4offMGFiPbXQTP7q0yFLPPwgY=',
      id: 'tinymceCDN',
    })
    if (!res) {
      console.warn('Is your internet working properly to load script?')
    }
    const tinyIntervalId = setInterval(() => {
      if (typeof window.tinymce !== 'undefined') {
        clearInterval(tinyIntervalId)
        setIsLoaded(true)
      }
    }, 100)
  }

  useEffect(() => {
    if (!isLoaded) loadTinyMceScript()
    timyMceInit()
    return () => {
      const activeEditor = window.tinymce?.get(editorId) || null
      if (activeEditor) activeEditor.remove()
    }
  }, [isLoaded])

  const insertFieldKey = (fld: FieldType) => {
    if (fld.type === 'signature') {
      return `<img width="250" src="\${${fld.key}}" alt="${fld.key}" />`
    }
    return `\${${fld.key}}`
  }

  // create table with all fields
  const createTableWithAllFields = () => {
    let table = '<table border="1" style="border-collapse: collapse; width: 100%;">'
    formFields?.map((item) => {
      !filterFieldTypesForTinyMce.includes(item.type)
        && (table
          += '<tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">'
          + `<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.name}</td>`
          + `<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${insertFieldKey(
            item,
          )}</td>`
          + '</tr>')
    })
    table += '</table>'
    return table
  }

  // map all fields with HTML
  const mapAllFieldsWithHTML = () => {
    let html = ''
    formFields?.map((item) => {
      !filterFieldTypesForTinyMce.includes(item.type)
        && (html += `<p>${item.name}: ${insertFieldKey(item)}</p>`)
    })
    console.log(html)
    return html
  }

  const timyMceInit = () => {
    if (window && window.tinymce) {
      window.tinymce.init({
        selector: `textarea#${editorId}`,
        menubar,
        height: height || 150,
        width: width || '100%',
        branding: false,
        resize: 'verticle',
        convert_urls: false,
        theme: 'modern',
        plugins:
          plugins
          || `directionality fullscreen image link media charmap hr lists textcolor colorpicker ${!editorLoadedFromCDN ? 'wordpress' : ''
          }`,
        toolbar:
          toolbarMnu
          || 'formatselect | fontsizeselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat toogleCode wp_code | addFormField | addSmartField | mapAllFieldWithTable | mapAllField | addShortCode',
        image_advtab: true,
        default_link_target: '_blank',
        setup(editor: any) {
          editor.on('Paste Change input Undo Redo', () => {
            onChangeHandler(editor.getContent())
          })
          formFields
            && editor.addButton('addFormField', {
              text: 'Form Fields ',
              tooltip: 'Add Form Field Value in Message',
              type: 'menubutton',
              icon: false,
              menu: formFields?.map(
                (i) => !filterFieldTypesForTinyMce.includes(i.type) && {
                  text: i.name,
                  onClick() {
                    editor.insertContent(insertFieldKey(i))
                  },
                },
              ),
            })
          smartTags
            && editor.addButton('addSmartField', {
              text: 'Smart Tag Fields',
              tooltip: 'Add Smart Tag Field Value in Message',
              type: 'menubutton',
              icon: false,
              menu: SmartTagField?.map((i) => ({
                text: i.label,
                onClick() {
                  editor.insertContent(`\${${i.name}}`)
                },
              })),
            })
          shortCodeList
            && editor.addButton('addShortCode', {
              text: 'Shortcodes',
              tooltip: 'Add Short Code',
              type: 'menubutton',
              icon: false,
              menu:
                shortCodeList?.map((i) => ({
                  text: i.label,
                  onClick() {
                    editor.insertContent(i.format)
                  },
                })) || [],
            })
          mapAllFieldWithTable
            && editor.addButton('mapAllFieldWithTable', {
              text: 'Map All Field With Table',
              tooltip: 'Map All Field With Table',
              icon: false,
              onclick() {
                editor.insertContent(createTableWithAllFields())
              },
            })
          mapAllField
            && editor.addButton('mapAllField', {
              text: 'Map All Field',
              tooltip: 'Map All Field',
              icon: false,
              onclick() {
                editor.insertContent(mapAllFieldsWithHTML())
              },
            })
          editor.addButton('toogleCode', {
            text: '</>',
            tooltip: 'Toggle preview',
            icon: false,
            onclick(e: any) {
              const { $ } = e.control
              const myTextarea = $(`#${editorId}`)
              const myIframe = $(editor.iframeElement)
              myTextarea.value = editor.getContent({ source_view: true })
              myIframe.toggleClass('btcd-mce-tinymce-hidden')
              myTextarea.toggleClass('btcd-mce-tinymce-visible')
              if ($('iframe.btcd-mce-tinymce-hidden').length > 0) {
                const editorContainer = editor.getContainer()
                const editArea = editorContainer.querySelector('.mce-edit-area')
                if (editArea) {
                  editArea.prepend(myTextarea[0]) // since you're using jQuery object
                }
              } else {
                const el = document.getElementById(editorId)
                if (el instanceof HTMLTextAreaElement) {
                  editor.setContent(el.value)
                }
              }
            },
          })
        },
      })
    }
  }

  return (
    <textarea
      id={editorId}
      className="btcd-paper-inp mt-1 w-10"
      rows={5}
      value={value}
      onChange={(ev) => onChangeHandler(ev.target.value)}
      style={{ width: '95.5%', height: 'auto' }}
      disabled={disabled}
    />
  )
}

type FieldType = { key: string; type: string; name: string };
type SmartTagType = { label: string; name: string };
type ShortCodeType = { label: string; format: string };

type TinyMCEProps = {
  id: string;
  value: string;
  formFields?: FieldType[];
  smartTags?: boolean;
  onChangeHandler: (e: any) => void;
  toolbarMnu?: string;
  menubar?: string;
  height?: string | number;
  width?: string | number;
  disabled?: boolean;
  plugins?: string;
  init?: any;
  get?: any;
  remove?: any;
  mapAllFieldWithTable?: boolean;
  mapAllField?: boolean;
  shortCodeList?: ShortCodeType[];
};

declare global {
  interface Window {
    tinymce: {
      init: ({ }) => void;
      baseURI: {
        source: string;
      };
      get: (id: string) => {
        remove: () => void;
      };
    };
  }
}
