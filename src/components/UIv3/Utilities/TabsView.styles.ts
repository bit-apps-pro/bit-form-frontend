// Variant styles for TabsView component
const tabsVariantStyles: Record<string, any> = {
  // Default variant - subtle gray theme
  default: {
    tabHeader: {
      bb: '1px solid var(--b-79-94)',
      bc: 'var(--white-0-95)',
    },
    tabButton: {
      cr: 'var(--black-0-83)',
      fs: '14px',
      fw: '500',
    },
    tabButtonHover: {
      cr: 'var(--black-0)',
      bc: 'var(--b-79-97)',
    },
    tabButtonActive: {
      cr: 'var(--b-50)',
      fw: '600',
    },
    selector: {
      bc: 'var(--b-50)',
      bs: '0 2px 4px rgba(var(--bf-primary-rgb), 0.3)',
    },
    selectorHeight: '2px',
    navButton: {
      bc: 'var(--white-100)',
      cr: 'var(--black-0-60)',
      brs: '6px',
      b: '1px solid var(--b-79-94)',
      bs: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    navButtonHover: {
      bc: 'var(--b-79-97)',
      cr: 'var(--b-50)',
      bcr: 'var(--b-50)',
    },
  },

  // Primary variant - brand color theme
  primary: {
    tabHeader: {
      bb: '1px solid rgba(var(--bf-primary-rgb), 0.2)',
      bc: 'var(--bf-primary)',
    },
    tabButton: {
      cr: 'rgba(255, 255, 255, 0.7)',
      fs: '14px',
      fw: '500',
    },
    tabButtonHover: {
      cr: 'rgba(255, 255, 255, 0.9)',
      bc: 'rgba(255, 255, 255, 0.1)',
    },
    tabButtonActive: {
      cr: '#ffffff',
      fw: '600',
      bc: 'rgba(255, 255, 255, 0.15)',
    },
    selector: {
      bc: '#ffffff',
      bs: '0 2px 6px rgba(255, 255, 255, 0.4)',
    },
    selectorHeight: '3px',
    navButton: {
      bc: 'rgba(255, 255, 255, 0.2)',
      cr: '#ffffff',
      brs: '6px',
      b: '1px solid rgba(255, 255, 255, 0.3)',
      bs: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    navButtonHover: {
      bc: 'rgba(255, 255, 255, 0.3)',
      cr: '#ffffff',
      bcr: 'rgba(255, 255, 255, 0.5)',
    },
  },

  // Tertiary variant - dark theme
  tertiary: {
    tabHeader: {
      bb: '1px solid var(--bf-bdr-clr-tertiary)',
      bc: 'var(--bf-bg-tertiary)',
    },
    tabButton: {
      cr: 'var(--bf-text-clr-gray)',
      fs: '14px',
      fw: '500',
    },
    tabButtonHover: {
      cr: 'var(--bf-text-clr-offwhite)',
      bc: 'var(--bf-bg-tertiary-hover)',
    },
    tabButtonActive: {
      cr: 'var(--bf-text-clr-white)',
      fw: '600',
      bc: 'rgba(255, 255, 255, 0.05)',
    },
    selector: {
      bc: 'var(--bf-text-clr-white)',
      bs: '0 2px 4px rgba(255, 255, 255, 0.2)',
    },
    selectorHeight: '2px',
    navButton: {
      bc: 'rgba(255, 255, 255, 0.08)',
      cr: 'var(--bf-text-clr-offwhite)',
      brs: '6px',
      b: '1px solid rgba(255, 255, 255, 0.15)',
      bs: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    navButtonHover: {
      bc: 'rgba(255, 255, 255, 0.15)',
      cr: 'var(--bf-text-clr-white)',
      bcr: 'rgba(255, 255, 255, 0.3)',
    },
  },

  // TODO: Do not remove this style object. Design of primary-outline variant is temporarily commented out, uncomment this when use this variant.
  // Primary Outline variant - transparent with primary accents
  // 'primary-outline': {
  //   tabHeader: {
  //     bb: '1px solid var(--b-79-94)',
  //     bc: 'transparent',
  //   },
  //   tabButton: {
  //     cr: 'var(--black-0-60)',
  //     fs: '14px',
  //     fw: '500',
  //     b: '1px solid transparent',
  //     brs: '6px 6px 0 0',
  //     margin: '0 2px',
  //   },
  //   tabButtonHover: {
  //     cr: 'var(--b-50)',
  //     bc: 'rgba(var(--bf-primary-rgb), 0.05)',
  //     bcr: 'transparent',
  //   },
  //   tabButtonActive: {
  //     cr: 'var(--b-50)',
  //     fw: '600',
  //     bc: 'rgba(var(--bf-primary-rgb), 0.08)',
  //     bcr: 'var(--b-79-94)',
  //     bb: '1px solid transparent',
  //   },
  //   selector: {
  //     bc: 'var(--b-50)',
  //     bs: '0 2px 6px rgba(var(--bf-primary-rgb), 0.4)',
  //   },
  //   selectorHeight: '3px',
  //   navButton: {
  //     bc: 'var(--white-100)',
  //     cr: 'var(--b-50)',
  //     brs: '6px',
  //     b: '1px solid var(--b-79-94)',
  //     bs: '0 2px 4px rgba(var(--bf-primary-rgb), 0.15)',
  //   },
  //   navButtonHover: {
  //     bc: 'rgba(var(--bf-primary-rgb), 0.08)',
  //     cr: 'var(--b-50)',
  //     bcr: 'var(--b-50)',
  //   },
  // },
  // TODO: Do not remove this style object. Design of primary-fullwidth variant is temporarily commented out, uncomment this when use this variant.
  // 'primary-fullwidth': {
  //   tabHeader: {
  //     bb: '1px solid rgba(var(--bf-primary-rgb), 0.2)',
  //     bc: 'var(--bf-primary)',
  //     p: 0,
  //   },
  //   tabButton: {
  //     cr: 'rgba(255, 255, 255, 0.7)',
  //     fs: '14px',
  //     fw: '500',
  //     flex: 1,
  //     brs: '0',
  //   },
  //   tabButtonHover: {
  //     cr: 'rgba(255, 255, 255, 0.9)',
  //     bc: 'rgba(255, 255, 255, 0.1)',
  //   },
  //   tabButtonActive: {
  //     cr: '#ffffff',
  //     fw: '600',
  //     bc: 'rgba(255, 255, 255, 0.15)',
  //   },
  //   selector: {
  //     bc: '#ffffff',
  //     bs: '0 2px 6px rgba(255, 255, 255, 0.4)',
  //   },
  //   selectorHeight: '3px',
  //   navButton: {
  //     bc: 'rgba(255, 255, 255, 0.2)',
  //     cr: '#ffffff',
  //     brs: '6px',
  //     b: '1px solid rgba(255, 255, 255, 0.3)',
  //     bs: '0 2px 4px rgba(0, 0, 0, 0.2)',
  //   },
  //   navButtonHover: {
  //     bc: 'rgba(255, 255, 255, 0.3)',
  //     cr: '#ffffff',
  //     bcr: 'rgba(255, 255, 255, 0.5)',
  //   },
  // },
  // TODO: Do not remove this style object. Design of rounded-bottom-tertiary variant is temporarily commented out, uncomment this when use this variant.
  // design this variant with no background and full width nav buttons and active color primary with underline selector
  // 'primary-clean-fullwidth': {
  //   tabHeader: {
  //     bb: '1px solid rgba(var(--bf-primary-rgb), 0.2)',
  //     bc: 'transparent',
  //     p: 0,
  //   },
  //   tabButton: {
  //     cr: 'var(--bf-text-clr-darkgray)',
  //     fs: '14px',
  //     fw: '500',
  //     flex: 1,
  //     brs: '0',
  //   },
  //   tabButtonHover: {
  //     cr: 'var(--bf-text-clr-black)',
  //     bc: 'rgba(var(--bf-primary-rgb), 0.05)',
  //   },
  //   tabButtonActive: {
  //     cr: 'var(--bf-primary)',
  //     fw: '600',
  //     bc: 'transparent',
  //   },
  //   selector: {
  //     bc: 'var(--bf-primary)',
  //     bs: '0 2px 6px rgba(var(--bf-primary-rgb), 0.4)',
  //   },
  //   selectorHeight: '3px',
  //   navButton: {
  //     bc: 'transparent',
  //     cr: 'var(--bf-text-clr-darkgray)',
  //     brs: '6px',
  //     b: '1px solid transparent',
  //     bs: '0 2px 4px rgba(0, 0, 0, 0.1)',
  //   },
  //   navButtonHover: {
  //     bc: 'rgba(var(--bf-primary-rgb), 0.05)',
  //     cr: 'var(--bf-text-clr-black)',
  //     bcr: 'var(--bf-primary)',
  //   },
  // },
  // tertiary clean fullwidth variant with no background and full width nav buttons and active color white with underline selector
  'tertiary-clean-fullwidth': {
    tabHeader: {
      bb: '1px solid var(--bf-bdr-clr-tertiary)',
      bc: 'transparent',
      p: 0,
    },
    tabButton: {
      cr: 'var(--bf-text-clr-secondary)',
      fs: '14px',
      fw: '500',
      flex: 1,
      brs: 'var(--bf-bdr-radius-sm) var(--bf-bdr-radius-sm) 0px 0px',

    },
    tabButtonHover: {
      cr: 'var(--bf-text-clr-darkgray)',
      // bc: 'var(--bf-bg-tertiary-hover)',
      bc: 'var(--bf-bg-offwhite)',
    },
    tabButtonActive: {
      cr: 'var(--bf-text-clr-tertiary)',
      fw: '600',
      bc: 'transparent',
    },
    selector: {
      bc: 'var(--bf-text-clr-tertiary)',
      bs: '0 2px 4px rgba(255, 255, 255, 0.2)',
    },
    selectorHeight: '2px',
    navButton: {
      bc: 'transparent',
      cr: 'var(--bf-text-clr-gray)',
      brs: '6px',
      b: '1px solid transparent',
      bs: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    navButtonHover: {
      bc: 'var(--bf-bg-tertiary-hover)',
      cr: 'var(--bf-text-clr-white)',
      bcr: 'var(--bf-text-clr-white)',
    },
  },

  // Clean Bottom Line variant - minimal with animated underline
  'clean-bottom-line': {
    tabHeader: {
      bb: '1px solid #e1e5e9',
      bc: 'transparent',
      p: '0',
      gp: 4
    },
    tabButton: {
      flex: 1,
      cr: '#6c757d',
      fs: '14px',
      fw: '500',
      p: '12px 20px',
      brs: 'var(--bf-bdr-radius-sm) var(--bf-bdr-radius-sm) 0 0',
      pn: 'relative' as const,
    },
    tabButtonHover: {
      cr: '#495057',
      bc: 'var(--bf-bg-lightgray)',
    },
    tabButtonActive: {
      bc: 'var(--bf-bg-ghostwhite)',
      cr: 'var(--bf-text-clr-darkgray)',
      fw: '600',
    },
    selector: {
      bc: 'var(--bf-tertiary)',
      bs: 'none',
      h: '2px',
    },
    selectorHeight: '2px',
    navButton: {
      bc: '#ffffff',
      cr: 'var(--bf-text-clr-gray)',
      brs: 'var(--bf-bdr-radius-sm)',
      b: '1px solid #e1e5e9',
      bs: '0 2px 4px rgba(0, 0, 0, 0.08)',
    },
    navButtonHover: {
      bc: 'var(--bf-bg-lightgray) !important',
      cr: 'var(--bf-bg-darkgray) !important',
      bcr: 'var(--bf-bdr-clr-light)',
    },
  },

  // TODO: Do not remvoe this style object. Design of rounded-bottom-tertiary variant is temporarily commented out, uncomment this when use this variant.
  // 'rounded-bottom-tertiary': {
  //   headerWrapper: {
  //     bb: '1px solid var(--bf-stroke-clr)',    // Bottom border only
  //   },
  //   tabHeader: {
  //     px: 10,
  //     // bc: '#f9fafb',               // Light background
  //     gp: '4px',                  // Space between tabs
  //   },
  //   tabButton: {
  //     cr: 'var(--bf-text-clr-gray)', // Gray text
  //     // pn: 'relative',
  //     brs: 'var(--bf-bdr-radius-sm) var(--bf-bdr-radius-sm) 0 0',  // Top rounded
  //     bc: 'transparent',
  //     zx: 2,
  //     flex: 1,
  //   },
  //   tabButtonHover: {
  //     bc: 'var(--bf-bg-lightgray)',               // gray on hover
  //     cr: 'var(--bf-text-clr-dark)', // Darker text
  //     '&.active': {
  //       bc: 'var(--bf-tertiary-hover)', // Keep active bg on hover
  //       cr: 'var(--bf-text-clr-white)', // Keep active text on hover
  //     }
  //   },
  //   // Active state shows curves
  //   tabButtonActive: {
  //     // '&::before': { oy: 1 },
  //     // '&::after': { oy: 1 },
  //     cr: 'var(--bf-text-clr-white)', // Dark text
  //     fw: 'var(--bf-font-semibold)',
  //   },
  //   navButton: {
  //     bc: '#ffffff',
  //     cr: 'var(--bf-text-clr-gray)',
  //     brs: 'var(--bf-bdr-radius-sm)',
  //     b: '1px solid #e1e5e9',
  //     bs: '0 2px 4px rgba(0, 0, 0, 0.08)',
  //   },
  //   navButtonHover: {
  //     bc: 'var(--bf-bg-lightgray) !important',
  //     cr: 'var(--bf-bg-darkgray) !important',
  //     bcr: 'var(--bf-bdr-clr-light)',
  //   },

  //   // Selector provides background
  //   selector: {
  //     pn: 'absolute',
  //     h: '100%',
  //     bc: 'var(--bf-bg-tertiary)', // Match panel bg
  //     brs: '4px 4px 0 0',
  //     zx: 1,  // Behind button
  //     // Left curve
  //     '&::before': {
  //       ct: '""',
  //       pn: 'absolute',
  //       bm: 0,
  //       lt: -10,
  //       w: 10,
  //       h: 10,
  //       brs: '0 0 4px 0',
  //       bs: '4px 2px 0 0 var(--bf-tertiary)',
  //       oy: 1,  // Hidden
  //     },

  //     // Right curve
  //     '&::after': {
  //       ct: '""',
  //       pn: 'absolute',
  //       bm: 0,
  //       rt: -9,
  //       w: 10,
  //       h: 10,
  //       brs: '0 0 0 6px',
  //       bs: '0px 4px 0 0 var(--bf-tertiary)',
  //       oy: 1,  // Hidden
  //     },
  //   }
  // },

  // Light Segment variant - white/light segmented control style
  // 'light-segment': {
  //   headerWrapper: {
  //     p: '4px',
  //     brs: 'var(--bf-bdr-radius-md)',
  //     b: '1px solid var(--bf-stroke-clr)',
  //     bc: 'var(--bf-secondary-100)',
  //   },
  //   tabHeader: {
  //     gp: '4px',
  //     bc: 'transparent',
  //     bb: 'none',
  //   },
  //   tabButton: {
  //     cr: 'var(--bf-text-clr-gray)',
  //     fs: '13px',
  //     fw: '500',
  //     p: '6px 14px',
  //     brs: 'var(--bf-bdr-radius-sm)',
  //     bc: 'transparent',
  //     flex: 1,
  //     dy: 'flex',
  //     ai: 'center',
  //     jc: 'center',
  //     gp: '6px',
  //     tn: 'color 0.2s ease, background-color 0.2s ease',
  //     zx: 2,
  //   },
  //   tabButtonHover: {
  //     cr: 'var(--bf-text-clr-darkgray)',
  //     bc: 'rgba(255,255,255,0.6)',
  //   },
  //   tabButtonActive: {
  //     cr: 'var(--bf-text-clr-dark)',
  //     fw: '600',
  //     bc: 'transparent',
  //   },
  //   selector: {
  //     pn: 'absolute',
  //     h: '100%',
  //     tp: '0px',
  //     bc: 'var(--bf-bg-white)',
  //     brs: 'var(--bf-bdr-radius-sm)',
  //     bs: '0 1px 3px rgba(0,0,0,0.12)',
  //     zx: 1,
  //     tn: 'all 0.3s cubic-bezier(0.42, 0.44, 0.57, 1.35)',
  //   },
  //   selectorHeight: 'calc(100% - 8px)',
  //   navButton: {
  //     bc: 'var(--bf-bg-white)',
  //     cr: 'var(--bf-text-clr-gray)',
  //     brs: 'var(--bf-bdr-radius-sm)',
  //     b: '1px solid var(--bf-stroke-clr)',
  //     bs: '0 2px 4px rgba(0,0,0,0.06)',
  //   },
  //   navButtonHover: {
  //     bc: 'var(--bf-secondary-100)',
  //     cr: 'var(--bf-text-clr-dark)',
  //     bcr: 'var(--bf-bdr-clr-light)',
  //   },
  // },

  // Tertiary Segment variant - segmented control style with pill background
  'tertiary-segment': {
    headerWrapper: {
      // bc: 'var(--bf-bg-offwhite)',      // Light container background
      p: '4px',                          // Padding around tabs
      brs: 'var(--bf-bdr-radius-md)',   // Rounded container
      b: '1px solid var(--bf-stroke-clr)', // Border for container
    },
    tabHeader: {
      gp: '4px',                         // Gap between tabs
      bc: 'transparent',
      bb: 'none',
    },
    tabButton: {
      cr: 'var(--bf-text-clr-secondary)', // Gray text for inactive
      fs: '14px',
      fw: '500',
      p: '7px 20px',
      brs: 'var(--bf-bdr-radius-sm)',    // Rounded tabs
      bc: 'transparent',
      flex: 1,                            // Equal width tabs
      tn: 'color 0.2s ease, background-color 0.2s ease',
      zx: 2,                              // Above selector
      flx: 'center',
    },
    tabButtonHover: {
      cr: 'var(--bf-text-clr-dark)',     // Darker text on hover
      bc: 'var(--bf-bg-white-hover)',    // Subtle hover background
    },
    tabButtonActive: {
      cr: 'var(--bf-text-clr-white)',    // White text for active
      fw: '600',                          // Bolder font
      bc: 'transparent',                  // No background - selector provides it
      '&:hover': {
        cr: 'var(--bf-text-clr-offwhite)',  // Keep white text on hover
      },
    },
    selector: {
      pn: 'absolute',
      h: '100%',             // Full height minus container padding
      tp: '0px',                          // Match container padding
      bc: 'var(--bf-tertiary)',          // Tertiary background color
      brs: 'var(--bf-bdr-radius-sm)',    // Rounded pill shape
      bs: '0 1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow
      zx: 1,                              // Behind button text
      tn: 'all 0.3s cubic-bezier(0.42, 0.44, 0.57, 1.35)',
    },
    selectorHeight: 'calc(100% - 8px)',  // Not used for this variant but kept for consistency
    navButton: {
      bc: '#ffffff',
      cr: 'var(--bf-text-clr-gray)',
      brs: 'var(--bf-bdr-radius-sm)',
      b: '1px solid var(--bf-stroke-clr)',
      bs: '0 2px 4px rgba(0, 0, 0, 0.08)',
    },
    navButtonHover: {
      bc: 'var(--bf-bg-lightgray)',
      cr: 'var(--bf-text-clr-dark)',
      bcr: 'var(--bf-bdr-clr-light)',
    },
  }
}

export default tabsVariantStyles
