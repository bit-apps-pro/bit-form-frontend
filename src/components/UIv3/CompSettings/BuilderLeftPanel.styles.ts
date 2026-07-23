
const builderLeftPanelStyles: Record<string, any> = {
  elmSettings: {
    bd: 'var(--white-100)',
    h: '100%',
    w: 'var(--bf-left-panel-width, 450px)',
    mnw: 'var(--bf-left-panel-width, 450px)',
    fs: 18,
    br: '1px solid var(--bf-stroke-clr)',
    pn: 'relative',
    tn: 'width 0.3s ease, min-width 0.3s ease',
    '&.style-mode': {
      w: 'var(--bf-style-mode-left-panel-width, 450px)',
      mnw: 'var(--bf-style-mode-left-panel-width, 450px)',
    },
  },
  elmSettingsCollapsed: {
    w: 0,
    mnw: 0,
    '&.style-mode': {
      w: 0,
      mnw: 0,
    },
  },
  toggleButton: {
    pn: 'absolute',
    rt: '-20px', // Position on the right edge
    tp: '50%',
    tm: 'translateY(-50%)',
    zx: 100,
    w: 20,
    h: 45,
    p: 2,
    bd: 'var(--white-100)',
    b: '1px solid var(--bf-stroke-clr)',
    bl: 'none',
    brs: '0 30px 30px 0',
    cr: 'var(--bf-text-clr-gray)',
    dy: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    cur: 'pointer',
    tn: 'all 0.2s ease',
    ':hover': {
      cr: 'var(--bf-text-clr-dark)',
      bd: 'var(--bf-bg-hover)',
      bs: '2px 0 6px rgba(0, 0, 0, 0.15)',
      '& svg': {
        ml: -10,
      }
    },
    ':active': {
      tm: 'translateY(-50%) scale(0.95)',
    },
  },
  toggleIcon: {
    tn: 'transform 0.3s ease',
    tm: 'rotate(90deg) !important',
    ml: -6,
  },
  toggleIconRotated: {
    tm: 'rotate(270deg) !important',
  },
  segmentMenuWrapper: {
    h: 'var(--bf-option-toolbar-height)',
    brs: 0,
    bb: '1px solid var(--bf-stroke-clr)',
    br: '1px solid var(--bf-stroke-clr)',
    '& .tabs': {
      b: 'none',
      h: '100%',
    },
    '& .selector': {
      h: '100%',
    },
    '& .segment-tip': {
      h: '100%',
    },
    '& button': {
      h: '100%',

    }

  }
}

export default builderLeftPanelStyles
