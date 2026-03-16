export default function ratingDefaultStyles(formId) {
  return {
    [`.bc${formId}-inp-fld-wrp`]: {
      // position: 'relative',
      margin: '0px',
      height: '50px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'start',
      gap: '10px',
    },

    [`.bc${formId}-rating-msg`]: {
      // text color
      'font-size': 'var(--fld-fs) !important',
      color: 'var(--global-font-color) !important',
      'font-family': 'inherit',
    },

    [`.bc${formId}-rating-input`]: {
      visibility: 'hidden',
      opacity: 0,
      height: 0,
      width: 0,
      margin: 0,
    },

    [`.bc${formId}-rating-wrp`]: {
      display: 'flex',
      // 'flex-direction': 'row',
      'align-items': 'center',
      'justify-content': 'start',
    },

    [`.bc${formId}-rating-lbl`]: {
      cursor: 'pointer',
    },

    [`.bc${formId}-rating-wrp:focus`]: {
      outline: 'none',
      'box-shadow': 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
      'border-radius': '5px',
    },

    [`.bc${formId}-rating-img`]: {
      width: '30px',
      height: '30px',
      margin: '0px 5px 0px 0px',
      filter: 'invert(95%) sepia(12%) saturate(155%) hue-rotate(6deg) brightness(85%) contrast(84%);',
    },

    [`.bc${formId}-rating-img[class$="-rating-hover"]`]: {
      filter: 'invert(73%) sepia(30%) saturate(3712%) hue-rotate(3deg) brightness(108%) contrast(96%)!important',
    },

    [`.bc${formId}-rating-img[class$="-rating-selected"]`]: {
      filter: 'invert(73%) sepia(30%) saturate(3712%) hue-rotate(3deg) brightness(108%) contrast(96%)',
    },

    [`.bc${formId}-rating-img[class$="-rating-scale"]`]: {
      transform: 'scale(1.2)',
      transition: '0.3s ease-in-out',
    },
  }
}
