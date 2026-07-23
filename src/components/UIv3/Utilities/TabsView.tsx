import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import ChevronDoubleIcn from '../../../Icons/ChevronDoubleIcn'
import { TabsViewProps } from '../Types/TabsView.types'
import tabsVariantStyles from './TabsView.styles'



const TabsView = ({
  tabs,
  defaultTab,
  variant = 'default',
  onChange,
  classNames = '',
  fixedHeader = false,
  fixedHeaderTop = 0,
  showHeaderShadow = false,
}: TabsViewProps) => {
  const { css } = useFela()
  const visibleTabs = tabs.filter(tab => tab.visible !== false)
  const [activeTab, setActiveTab] = useState(defaultTab || visibleTabs[0]?.id || 'basic')
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showPrevButton, setShowPrevButton] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  const tabHeaderRef = useRef<HTMLDivElement>(null)
  const tabsScrollRef = useRef<HTMLDivElement>(null)
  const selectorRef = useRef<HTMLDivElement>(null)

  const currentVariant = tabsVariantStyles[variant] || tabsVariantStyles.default


  // Add this function inside your component
  const getMaskImage = () => {
    if (!hasOverflow) return {}

    if (showPrevButton && showNextButton) {
      // Both sides fade
      return {
        maskImage: 'linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)',
      }
    }

    if (showPrevButton && !showNextButton) {
      // Left fade only
      return {
        maskImage: 'linear-gradient(to right, transparent 0px, black 40px, black 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 40px, black 100%)',
      }
    }

    if (!showPrevButton && showNextButton) {
      // Right fade only
      return {
        maskImage: 'linear-gradient(to right, black 0%, black calc(100% - 40px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, black 0%, black calc(100% - 40px), transparent 100%)',
      }
    }

    return {}
  }

  const styles = {
    container: {
      dy: 'flex',
      fd: 'column' as const,
      h: '100%',
      ...(fixedHeader && { pn: 'relative' as const }),
    },
    headerWrapper: {
      pn: fixedHeader ? 'sticky' as const : 'relative' as const,
      tp: fixedHeader ? fixedHeaderTop : undefined,
      zx: fixedHeader ? 10 : undefined,
      dy: 'flex',
      ai: 'center',
      bc: fixedHeader ? 'var(--white-100)' : undefined,
      bs: fixedHeader && showHeaderShadow ? 'rgb(123 123 123) 0px 7px 7px -9px' : undefined,
      tn: 'box-shadow 0.2s ease',
      ...currentVariant.headerWrapper
    },
    navButton: {
      p: 0,
      pn: 'absolute' as const,
      tp: '50%',
      tm: 'translateY(-50%)',
      zx: 2,
      flx: 'center',
      w: 25,
      h: 25,
      b: 'none',
      curp: 1,
      tn: 'all 0.2s ease',
      oe: 'none',
      ...currentVariant.navButton,
      ':hover': {
        ...currentVariant.navButtonHover,
      },
      ':focus-visible': {
        oe: '2px solid var(--b-50)',
        oot: '2px',
      },
      ':disabled': {
        oy: 0,
        pe: 'none' as const,
        vy: 'hidden' as const,
      },
    },
    prevButton: {
      lt: '4px',
      ...currentVariant.prevButton,
    },
    nextButton: {
      rt: '4px',
      ...currentVariant.nextButton,
    },
    tabHeaderContainer: {
      flex: 1,
      pn: 'relative' as const,
      ow: 'hidden',
      ...getMaskImage(), // ✅ Clean and readable
    },
    tabHeader: {
      dy: 'flex',
      gp: '0',
      pn: 'relative' as const,
      owx: 'auto' as const,
      owy: 'hidden' as const,
      scrollBehavior: 'smooth' as const,
      scrollbarWidth: 'none' as const, // Firefox
      msOverflowStyle: 'none' as const, // IE/Edge
      '&::-webkit-scrollbar': {
        dy: 'none', // Chrome/Safari
      },
      ...currentVariant.tabHeader,
    },
    tabButton: {
      p: '12px 24px',
      b: 'none',
      bc: 'transparent',
      curp: 1,
      pn: 'relative' as const,
      tn: 'all 0.2s ease',
      zx: 1,
      oe: 'none',
      ws: 'nowrap' as const,
      ...currentVariant.tabButton,
      ':hover': {
        ...currentVariant.tabButtonHover,
      },
      ':focus-visible': {
        oe: '2px solid var(--b-50)',
        oot: '-2px',
      },
    },
    tabButtonActive: {
      ...currentVariant.tabButtonActive,
    },
    selector: {
      pn: 'absolute' as const,
      bm: 0,
      lt: 0,
      h: currentVariant.selectorHeight || '2px',
      tn: 'all 0.3s cubic-bezier(0.42, 0.44, 0.57, 1.35)',
      willChange: 'transform, width',
      zx: 2,
      ...currentVariant.selector,
    },
    tabContent: {
      flx: 1,
      owy: 'auto' as const,
      owx: 'hidden' as const,
      p: '0',
      pn: 'relative' as const,
    },
    contentWrapper: {
      pn: 'relative' as const,
      w: '100%',
      an: isAnimating ? (slideDirection === 'right' ? 'slideInFromRight 0.3s ease-out' : 'slideInFromLeft 0.3s ease-out') : 'none',
    },
  }

  // Check for overflow and update navigation button visibility
  const checkOverflow = () => {
    if (!tabsScrollRef.current) return

    const { scrollWidth, clientWidth, scrollLeft } = tabsScrollRef.current
    const isOverflowing = scrollWidth > clientWidth

    setHasOverflow(isOverflowing)

    if (isOverflowing) {
      // Show prev button if not at start
      setShowPrevButton(scrollLeft > 30)
      // Show next button if not at end
      setShowNextButton(scrollLeft < scrollWidth - clientWidth - 30)
    } else {
      setShowPrevButton(false)
      setShowNextButton(false)
    }
  }

  // Handle scroll events
  useEffect(() => {
    const scrollContainer = tabsScrollRef.current
    if (!scrollContainer) return

    checkOverflow()

    // Check overflow on scroll
    scrollContainer.addEventListener('scroll', checkOverflow)

    // Check overflow on window resize
    const resizeObserver = new ResizeObserver(checkOverflow)
    resizeObserver.observe(scrollContainer)

    return () => {
      scrollContainer.removeEventListener('scroll', checkOverflow)
      resizeObserver.disconnect()
    }
  }, [visibleTabs])

  // Scroll to active tab when it changes
  useEffect(() => {

    if (!tabsScrollRef.current) return
    const activeElement = tabsScrollRef.current.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement

    if (activeElement) {
      const scrollContainer = tabsScrollRef.current
      const { left: containerLeft, width: containerWidth } = scrollContainer.getBoundingClientRect()
      const { left: elementLeft, width: elementWidth } = activeElement.getBoundingClientRect()

      const relativeLeft = elementLeft - containerLeft + scrollContainer.scrollLeft
      const center = relativeLeft - (containerWidth / 2) + (elementWidth / 2)

      scrollContainer.scrollTo({
        left: center,
        behavior: 'smooth',
      })
    }
  }, [activeTab])

  // Navigate to previous tabs
  const handlePrevious = () => {
    if (!tabsScrollRef.current) return

    const scrollAmount = 200
    tabsScrollRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    })
  }

  // Navigate to next tabs
  const handleNext = () => {
    if (!tabsScrollRef.current) return
    const scrollAmount = 200
    tabsScrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    })
  }

  // Update selector position when active tab changes
  useLayoutEffect(() => {
    const activeElement = tabsScrollRef.current?.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement

    if (activeElement && selectorRef.current && tabsScrollRef.current) {
      const { width, left: elementLeft } = activeElement.getBoundingClientRect()
      const { left: containerLeft } = tabsScrollRef.current.getBoundingClientRect()
      const scrollLeft = tabsScrollRef.current.scrollLeft
      const offsetLeft = elementLeft - containerLeft + scrollLeft

      // Disable transition on first render
      if (selectorRef.current.style.width === '') {
        selectorRef.current.style.transition = 'none'
        setTimeout(() => {
          if (selectorRef.current) {
            selectorRef.current.style.transition = ''
          }
        }, 0)
      }
      selectorRef.current.style.width = `${width}px`
      selectorRef.current.style.transform = `translateX(${offsetLeft}px)`
    }
  }, [activeTab, tabs])

  const handleTabChange = (tabId: string, index: number) => {
    if (tabId === activeTab) return

    // Determine slide direction based on tab index
    const currentIndex = visibleTabs.findIndex(tab => tab.id === activeTab)
    const newDirection = index > currentIndex ? 'right' : 'left'

    setSlideDirection(newDirection)
    setIsAnimating(true)
    setActiveTab(tabId)

    if (onChange) {
      onChange(tabId)
    }

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const activeTabContent = visibleTabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className={`${css(styles.container)} ${classNames} tabs-container`}>
      {/* Header with Navigation Buttons */}
      <div className={`${css(styles.headerWrapper)} tabs-header-wrapper`}>
        {/* Previous Button */}
        <button
          type="button"
          className={`${css(styles.navButton, styles.prevButton)} tabs-nav-button tabs-prev-button`}
          onClick={handlePrevious}
          disabled={!showPrevButton}
          aria-label="Scroll to previous tabs"
          title="Previous"
        >
          <ChevronDoubleIcn size={16} />
        </button>

        {/* Tabs Container */}
        <div className={`${css(styles.tabHeaderContainer)} tabs-header-container`}>
          <div
            ref={tabsScrollRef}
            className={`${css(styles.tabHeader)} tabs-header`}
          >
            {visibleTabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                data-tab-id={tab.id}
                className={`${css(
                  styles.tabButton,
                  activeTab === tab.id && styles.tabButtonActive
                )} tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id, index)}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}

            {/* Animated selector */}
            <div
              ref={selectorRef}
              className={`${css(styles.selector)} tab-selector`}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          type="button"
          className={`${css(styles.navButton, styles.nextButton)} tabs-nav-button tabs-next-button`}
          onClick={handleNext}
          disabled={!showNextButton}
          aria-label="Scroll to next tabs"
          title="Next"
        >
          <ChevronDoubleIcn size={16} rotateDeg={180} />
        </button>
      </div>

      {/* Tab Content with Animation */}
      <div className={`${css(styles.tabContent)} tab-content`} role="tabpanel">
        <div className={`${css(styles.contentWrapper)} tab-content-wrapper ${isAnimating ? (slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left') : ''}`}>
          {activeTabContent}
        </div>
      </div>
    </div>
  )
}

export default TabsView