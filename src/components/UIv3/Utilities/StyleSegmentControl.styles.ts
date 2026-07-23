// Variant styles - moved outside component for better performance
const segmentVariantStyles: Record<string, any> = {
  default: {
    tabs: {
      bd: '#ffffff',
      b: '1px solid #e1e5e9',
    },
    selector: {
      bd: '#f8f9fa',
      bs: '0 1px 3px rgba(0, 0, 0, 0.1)',
      b: '1px solid #dee2e6',
    },
    tabLink: {
      cr: '#6c757d',
      ':hover:not(.active)': {
        cr: '#495057',
        bd: '#f8f9fa',
      },
    },
    active: {
      cr: '#495057 !important',
      bd: '#ffffff !important',
    },
  },
  primary: {
    tabs: {
      bd: 'var(--bf-primary)',
    },
    selector: {
      bd: 'var(--bf-primary)',
      bs: '0 2px 3px -1px rgba(var(--bf-primary-rgb), 0.3)',
    },
    tabLink: {
      cr: 'hsl(0, 0%, 70%)',
      ':hover:not(.active)': {
        cr: 'hsl(0, 0%, 90%)',
      },
    },
    active: {
      cr: 'hsl(0, 0%, 100%) !important',
    },
  },
  warning: {
    tabs: {
      bd: 'hsl(42, 100%, 50%)',
    },
    selector: {
      bd: 'hsl(42, 100%, 60%)',
      bs: '0 2px 3px -1px hsla(42, 100%, 50%, 0.3)',
    },
    tabLink: {
      cr: 'hsl(42, 100%, 30%)',
      ':hover:not(.active)': {
        cr: 'hsl(42, 100%, 20%)',
      },
    },
    active: {
      cr: 'hsl(0, 0%, 100%) !important',
    },
  },
  secondary: {
    tabs: {
      bd: 'hsl(208, 7%, 46%)',
    },
    selector: {
      bd: 'hsl(208, 7%, 56%)',
      bs: '0 2px 3px -1px hsla(208, 7%, 46%, 0.3)',
    },
    tabLink: {
      cr: 'hsl(208, 7%, 30%)',
      ':hover:not(.active)': {
        cr: 'hsl(208, 7%, 20%)',
      },
    },
    active: {
      cr: 'hsl(0, 0%, 100%) !important',
    },
  },
  tertiary: {
    tabs: {
      bd: 'var(--bf-bg-tertiary)',
    },
    selector: {
      bd: 'var(--bf-bg-tertiary-hover)',
      bs: '0 2px 3px -1px rgba(0, 0, 0, 0.1)',
    },
    tabLink: {
      cr: 'var(--bf-text-clr-gray)',
      ':hover:not(.active)': {
        cr: 'var(--bf-text-clr-offwhite)',
      },
    },
    active: {
      cr: 'var(--bf-text-clr-offwhite) !important',
    },
  },
  clean: {
    tabs: {
      bd: '#ffffff',
      b: '1px solid #e1e5e9',
      py: 0,
      px: 0,
    },
    selector: {
      bd: '#f8f9fa',
      bs: '0 1px 3px rgba(0, 0, 0, 0.1)',
      b: '1px solid #dee2e6',
    },
    tabLink: {
      cr: '#6c757d',
      ':hover:not(.active)': {
        cr: '#495057',
        bd: '#f8f9fa',
      },
    },
    active: {
      cr: '#495057 !important',
      bd: '#ffffff !important',
    },
  },
  'clean-tertiary': {
    tabs: {
      bd: '#ffffff',
      b: '1px solid #e1e5e9',
      py: 2,
      px: 2,
    },
    selector: {
      bd: '#f8f9fa',
      bs: '0 1px 3px rgba(0, 0, 0, 0.1)',
      b: '1px solid #dee2e6',
    },
    tabLink: {
      tdy: '0s',
      cr: '#6c757d',
      ':hover:not(.active)': {
        cr: '#495057',
        bd: '#f8f9fa',
      },
    },
    active: {
      cr: 'var(--bf-text-clr-white) !important',
      bd: 'var(--bf-bg-tertiary) !important',
    },
  },
  'clean-tertiary-bottom-outline': {
    tabs: {
      bd: 'var(--bf-bg-offwhite)',
      b: '1px solid #e1e5e9',
      py: 0,
      px: 0,
    },
    selector: {
      bd: 'var(--bf-bg-white)',
      bs: '0 1px 3px rgba(0, 0, 0, 0.1)',
      b: '1px solid #dee2e6',
    },
    tabLink: {
      cr: '#6c757d',
      b: '1px solid var(--bf-bdr-clr-tertiary)',
      ':hover:not(.active)': {
        cr: '#495057',
        bd: 'var(--bf-bg-lightgray)',
      },
    },
    active: {
      cr: '#495057 !important',
      bd: 'var(--bf-bg-white) !important',
      bb: '2px solid var(--bf-bdr-clr-tertiary) !important',
      brs: '0px !important',
      fw: 'var(--bf-font-bold)',
    },
  },
  success: {
    tabs: {
      bd: 'hsla(160, 100%, 49%, 100%)',
    },
    selector: {
      bd: 'hsla(160, 100%, 59%, 100%)',
      bs: '0 2px 3px -1px hsla(160, 100%, 49%, 0.3)',
    },
    tabLink: {
      cr: 'hsla(160, 100%, 30%, 100%)',
      ':hover:not(.active)': {
        cr: 'hsla(160, 100%, 20%, 100%)',
      },
    },
    active: {
      cr: 'hsla(215, 63%, 18%, 67%) !important',
    },
  },
  danger: {
    tabs: {
      bd: 'hsl(0, 100%, 64%)',
    },
    selector: {
      bd: 'hsl(0, 100%, 74%)',
      bs: '0 2px 3px -1px hsla(0, 100%, 64%, 0.3)',
    },
    tabLink: {
      cr: 'hsl(0, 100%, 40%)',
      ':hover:not(.active)': {
        cr: 'hsl(0, 100%, 30%)',
      },
    },
    active: {
      cr: 'hsl(0, 0%, 100%) !important',
    },
  },
  'primary-outline': {
    tabs: {
      bd: 'transparent',
      b: '1px solid var(--bf-primary)',
    },
    selector: {
      bd: 'var(--bf-primary)',
      bs: '0 2px 3px -1px rgba(var(--bf-primary-rgb), 0.2)',
    },
    tabLink: {
      cr: 'var(--bf-primary)',
      ':hover:not(.active)': {
        cr: 'var(--bf-primary-hover)',
      },
    },
    active: {
      cr: 'hsl(0, 0%, 100%) !important',
    },
  },
  'secondary-outline': {
    tabs: {
      bd: 'transparent',
      b: '1px solid hsl(208, 7%, 46%)',
    },
    selector: {
      bd: 'hsl(208, 7%, 46%)',
      bs: '0 2px 3px -1px hsla(208, 7%, 46%, 0.2)',
    },
    tabLink: {
      cr: 'hsl(208, 7%, 46%)',
      ':hover:not(.active)': {
        cr: 'hsl(208, 7%, 36%)',
      },
    },
    active: {
      cr: 'hsl(0, 0%, 100%) !important',
    },
  },
  'tertiary-outline': {
    tabs: {
      bd: 'transparent',
      b: '1px solid var(--bf-bdr-clr-tertiary)',
    },
    selector: {
      bd: 'var(--bf-bg-tertiary)',
      bs: '0 2px 3px -1px rgba(0, 0, 0, 0.1)',
    },
    tabLink: {
      cr: 'var(--bf-text-clr-gray)',
      ':hover:not(.active)': {
        cr: 'var(--bf-text-clr-offwhite)',
      },
    },
    active: {
      cr: 'hsl(0, 0%, 100%) !important',
    },
  },
  'success-outline': {
    tabs: {
      bd: 'transparent',
      b: '1px solid hsla(160, 100%, 49%, 100%)',
    },
    selector: {
      bd: 'hsla(160, 100%, 49%, 100%)',
      bs: '0 2px 3px -1px hsla(160, 100%, 49%, 0.2)',
    },
    tabLink: {
      cr: 'hsla(160, 100%, 49%, 100%)',
      ':hover:not(.active)': {
        cr: 'hsla(160, 100%, 39%, 100%)',
      },
    },
    active: {
      cr: 'hsla(215, 63%, 18%, 67%) !important',
    },
  },
  'danger-outline': {
    tabs: {
      bd: 'transparent',
      b: '1px solid hsl(0, 100%, 50%)',
    },
    selector: {
      bd: 'hsl(0, 100%, 50%)',
      bs: '0 2px 3px -1px hsla(0, 100%, 50%, 0.2)',
    },
    tabLink: {
      cr: 'hsl(0, 100%, 50%)',
      ':hover:not(.active)': {
        cr: 'hsl(0, 100%, 40%)',
      },
    },
    active: {
      cr: 'hsl(0, 0%, 100%) !important',
    },
  },
}

export default segmentVariantStyles