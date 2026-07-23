// Variant styles for Accordion component
const accordionVariantStyles: Record<string, any> = {
  // Default variant - existing subtle style
  default: {
    main: {
      brs: 'unset',
      '&:hover': {
        bd: 'rgb(245, 250, 255)',
      },
    },
    header: {
      p: '10px 0',
    },
    title: {
      fs: 12,
      fw: 600,
      ls: '0.5px',
      tt: 'uppercase',
      cr: 'var(--bf-text-clr-secondary, #64748b)',
    },
    content: {
      py: 10,
    },
  },

  // Boxed variant - card-like panel with header background
  boxed: {
    main: {
      brs: 'var(--bf-bdr-radius-md, 8px)',
      b: '1px solid var(--bf-stroke-clr, #e5e7eb)',
      bd: 'var(--bf-bg-white, #ffffff)',
      ov: 'hidden',
      '&:hover': {
        bd: 'var(--bf-bg-white, #ffffff)',
      },
    },
    header: {
      p: '12px 16px',
      bd: 'var(--bf-bg-offwhite, #f8fafc)',
      flx: 'center-between',
      '&.active': {
        bb: '1px solid var(--bf-stroke-clr, #e5e7eb)',
      }
    },
    title: {
      fs: 11,
      fw: 600,
      ls: '0.6px',
      tt: 'uppercase',
      cr: 'var(--bf-text-clr-secondary, #6b7280)',
    },
    content: {
      p: '16px',
    },
  },
}

export default accordionVariantStyles
