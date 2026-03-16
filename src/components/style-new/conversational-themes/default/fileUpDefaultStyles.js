export default function fileUpDefaultStyles(formId) {
  return {
    [`.bc${formId}-file-upload-container`]: {
      position: 'relative',
      height: '40px',
      width: '100%',
      display: 'inline-block',
    },

    [`.bc${formId}-fld-wrp.readonly .bc${formId}-file-input-wrpr`]: {
      opacity: '.7',
      cursor: 'not-allowed',
      'pointer-events': 'none',
    },

    [`.bc${formId}-fld-wrp.disabled .bc${formId}-file-input-wrpr`]: {
      opacity: '.5',
      cursor: 'not-allowed',
      'pointer-events': 'none',
    },

    [`.bc${formId}-btn-wrpr`]: {
      display: 'flex',
      'align-items': 'center',
      position: 'relative',
      gap: '5px',
      padding: '10px',
      'background-color': `hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 0.1)`,
      border: `1px dashed hsla(var(--bc${formId}-a-h), var(--bc${formId}-a-s), var(--bc${formId}-a-l), 1)`,
      'border-radius': '4px',
    },

    [`.bc${formId}-inp-btn`]: {
      'align-items': 'center',
      background: 'none',
      border: 'none',
      'border-radius': '6px !important',
      'box-shadow': 'none',
      color: `var(--bc${formId}-fld-clr)`,
      cursor: 'pointer',
      display: 'inline-flex',
      padding: '8px 14px !important',
      'font-size': `calc(var(--bc${formId}-fld-fs) - 5px) !important`,
      gap: '5px',
      'line-height': '1',
    },

    [`.bc${formId}-inp-btn:focus-visible`]: {
      outline: `2px solid var(--bc${formId}-a-clr)`,
      'outline-offset': '2px',
      transition: 'outline-offset 0.2s ease',
    },
    [`.bc${formId}-inp-btn:active:focus-visible`]: {
      'outline-offset': '0',
    },
    [`.bc${formId}-pre-i`]: {
      width: '15px',
      height: '15px',
      filter: 'invert(1)',
    },

    [`.bc${formId}-suf-i`]: {
      width: '15px',
      height: '15px',
      'margin-left': '5px',
      filter: 'invert(1)',
    },

    [`.bc${formId}-btn-txt`]: {},

    [`.bc${formId}-file-select-status`]: {
      'font-size': '14px',
      color: `var(--bc${formId}-fld-clr)`,
    },

    [`.bc${formId}-max-size-lbl`]: {
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-h), 0.7)`,
      'font-size': '10px',
    },

    [`.bc${formId}-file-upload-input`]: {
      display: 'block',
      width: '100%',
      height: '100%',
      border: 'none',
      position: 'absolute',
      top: '0',
      left: '0',
      opacity: '0',
      cursor: 'pointer',
    },

    [`.bc${formId}-file-input-wrpr .files-list`]: {},

    [`.bc${formId}-file-input-wrpr .file-wrpr`]: {
      'background-color': 'var(--bg-10)',
      'border-radius': 'var(--g-bdr-rad)',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
      width: '100%',
      height: 'auto',
      'margin-top': '10px',
      padding: '5px',
      outline: '1px solid var(--bg-15)',
    },

    [`.bc${formId}-file-input-wrpr .file-preview`]: {
      'border-radius': 'calc(var(--g-bdr-rad) - 4px)',
      height: '25px',
      width: '25px',
      outline: '1px solid var(--bg-5)',
    },

    [`.bc${formId}-file-input-wrpr .file-details`]: {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
      padding: '0px 10px',
      width: '94%',
    },

    [`.bc${formId}-file-input-wrpr .file-title`]: {
      display: 'inline-block',
      'font-size': '12px',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
      color: `var(--bc${formId}-fld-clr)`,
    },

    [`.bc${formId}-file-input-wrpr .file-size`]: {
      'font-size': '12px',
      'line-height': '1',
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-h), 0.7)`,
    },

    [`.bc${formId}-file-input-wrpr .cross-btn`]: {
      cursor: 'pointer',
      border: 'none',
      'border-radius': '50px',
      'box-shadow': 'none',
      color: `hsla(var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-h), var(--bc${formId}-fld-c-h), 0.8)`,
      'font-size': '20px',
      height: '25px',
      'line-height': '1',
      'min-height': '25px',
      'min-width': '25px',
      padding: '0',
      'text-decoration': 'none',
      width: '25px',
      transition: 'background-color 150ms',
      'background-color': 'var(--bg-15)',
    },
    [`.bc${formId}-file-input-wrpr .cross-btn:hover`]: {
      'background-color': 'var(--bg-20)',
      color: `var(--bc${formId}-fld-clr)`,
    },
    [`.bc${formId}-file-input-wrpr .err-wrp`]: {
      display: 'none',
      opacity: '0',
      transition: 'display 1s, opacity 1s',
      'align-items': 'center',
      'background-color': 'hsla(0, 100%, 97%, 100%)',
      color: 'darkred',
      'border-radius': '10px',
      height: '40px',
      'margin-top': '10px',
      padding: '2px 10px',
      width: '100%',
    },

    [`.bc${formId}-file-input-wrpr .err-wrp.active`]: {
      display: 'flex',
      opacity: '1',
      transition: 'display 1s, opacity 1s',
    },
  }
}
