const BuilderRightPanelStyles = {
  elmSettings: {
    bd: 'var(--white-100)',
    h: '100%',
    // w: 307,
    // mnw: 270,
    w: 'var(--bf-right-panel-width, 400px)',
    mnw: 'var(--bf-right-panel-width, 400px)',
    //
    mr: 0,
    // ml: 'auto',
    fs: 18,
    bl: '1px solid var(--bf-stroke-clr)',
    pn: 'relative',
    tn: 'width 0.3s ease, min-width 0.3s ease',
    // ow: 'hidden',
  },
  elmSettingsCollapsed: {
    w: 0,
    mnw: 0,
  },
  toggleButton: {
    pn: 'absolute',
    lt: '-20px', // Position on the left edge
    tp: '50%',
    tm: 'translateY(-50%)',
    zx: 100,
    w: 20,
    h: 45,
    p: 2,
    bd: 'var(--white-100)',
    b: '1px solid var(--bf-stroke-clr)',
    br: 'none',
    brs: '30px 0 0 30px',
    cr: 'var(--bf-text-clr-gray)',
    dy: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    cur: 'pointer',
    // oe: 'none',
    tn: 'all 0.2s ease',
    // bs: '-2px 0 4px rgba(0, 0, 0, 0.1)',
    ':hover': {
      cr: 'var(--bf-text-clr-dark)',
      bd: 'var(--bf-bg-hover)',
      bs: '-2px 0 6px rgba(0, 0, 0, 0.15)',
      '& svg': {
        mr: -10,
      },
    },
    ':active': {
      tm: 'translateY(-50%) scale(0.95)',
    },
  },
  toggleIcon: {
    tn: 'transform 0.3s ease',
    tm: 'rotate(270deg) !important',
    mr: -6,
  },
  toggleIconRotated: {
    tm: 'rotate(90deg) !important',
  },
}
export default BuilderRightPanelStyles
