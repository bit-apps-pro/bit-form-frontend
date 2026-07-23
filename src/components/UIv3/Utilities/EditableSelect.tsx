import { useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import ChevronDownIcn from '../../../Icons/ChevronDownIcn'
import SearchIcn from '../../../Icons/SearchIcn'
import { __ } from '../../../Utils/i18nwrap'

interface SelectOption {
  label: string
  value: string
}

interface EditableSelectProps {
  value: string
  onChange: (value: string) => void
  onSelect: (formId: string) => void
  optionList: SelectOption[]
  currentSelectedValue?: string
  mainPlaceherText?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  noSearchResultsText?: string
  classNames?: string
}

export default function EditableSelect({
  value,
  onChange,
  onSelect,
  optionList,
  currentSelectedValue,
  mainPlaceherText = __('Please write form name'),
  searchPlaceholder = __('Search forms here...'),
  onSearch,
  noSearchResultsText = __('No forms found'),
  classNames = '',
}: EditableSelectProps) {
  const { css } = useFela()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Filter options based on search query
  const filteredOptions = optionList.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Debounced search handler
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (onSearch && searchQuery) {
      debounceTimerRef.current = setTimeout(() => {
        onSearch(searchQuery)
      }, 300)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery, onSearch])

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    setHighlightedIndex(-1)
  }

  // Handle option selection
  const handleOptionSelect = (option: SelectOption) => {
    onSelect(option.value)
    setIsOpen(false)
    setSearchQuery('')
    setHighlightedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchQuery('')
        setHighlightedIndex(-1)
        break
      default:
        break
    }
  }

  // Handle search input key down
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Tab':
        if (filteredOptions.length > 0) {
          e.preventDefault()
          if (e.shiftKey) {
            setHighlightedIndex(prev =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            )
          } else {
            setHighlightedIndex(prev =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            )
          }
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchQuery('')
        setHighlightedIndex(-1)
        break
      default:
        break
    }
  }

  return (
    <div className={`${css(styles.container)} ${classNames} editable-select-container`} ref={dropdownRef}>
      <div className={`${css(styles.inputWrapper)} input-wrapper`}>
        <input
          type="text"
          value={value}
          title={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${css(styles.mainInput)} main-input`}
          aria-label="Form name"
          placeholder={mainPlaceherText}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="form-switcher-listbox"
        />
        <div className={`${css(styles.toggleButtonWrapper)} toggle-button-wrapper`}>
          <button
            type="button"
            onClick={toggleDropdown}
            className={`${css(styles.toggleButton)} toggle-button`}
            aria-label={isOpen ? 'Close form list' : 'Open form list'}
            aria-expanded={isOpen}
          >
            <ChevronDownIcn
              size={16}
              className={css(styles.chevronIcon, ...(isOpen ? [styles.chevronIconOpen] : []))}
            />
          </button>
        </div>
      </div>

      {
        isOpen && (
          <div className={`${css(styles.dropdown)} dropdown`} id="form-switcher-listbox" role="listbox">
            <div className={`${css(styles.searchWrapper)} search-wrapper`}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholder}
                className={`${css(styles.searchInput)} search-input`}
                aria-label="Search forms"
              />
              <SearchIcn size={16} className={css(styles.searchIcon)} />
            </div>
            <div className={`${css(styles.optionsList)} options-list`}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isCurrentOption = option.value === currentSelectedValue
                  const isHighlighted = highlightedIndex === index
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isHighlighted || isCurrentOption}
                      className={`${css(
                        styles.option,
                        ...(isHighlighted ? [styles.optionHighlighted] : []),
                        ...(isCurrentOption ? [styles.optionSelected] : [])
                      )} option`}
                      onClick={() => handleOptionSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span>{option.label}</span>
                      {isCurrentOption && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={css(styles.checkIcon)}
                        >
                          <path
                            d="M13.3332 4L5.99984 11.3333L2.6665 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className={css(styles.noResults)}> {noSearchResultsText}</div>
              )}
            </div>
          </div>
        )
      }
    </div >
  )
}

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    border: '1px solid var(--bf-stroke-clr) !important',
    brs: 'var(--bf-bdr-radius-sm) !important',

    // set border color on focus of input inside
    ':focus-within': {
      bcr: 'var(--bf-tertiary) !important',
    },
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  mainInput: {
    width: 'calc(100% - 32px)',
    padding: '5px 10px !important',
    fontSize: '16px',
    fontWeight: '400',
    color: 'var(--bf-text-clr-dark) !important',
    backgroundColor: 'transparent',
    b: 'none !important',
    outline: 'none',
    brs: 'var(--bf-bdr-radius-sm) !important',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--bf-bg-hover, rgba(0, 0, 0, 0.02))',
    },
    ':focus': {
      bcr: 'var(--bf-tertiary) !important',
    },
    '::placeholder': {
      color: 'var(--bf-text-clr-secondary) !important',
      opacity: '.7',
    },
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  toggleButtonWrapper: {
    // position: 'absolute',
    // right: '0',
    // top: '0',
    // bottom: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingRight: '4px',
    w: '32px',
    bl: '1px solid var(--bf-stroke-clr)',
  },
  toggleButton: {
    // position: 'absolute',
    // right: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    p: '0',
    backgroundColor: 'transparent',
    b: 'none',
    brs: 'var(--bf-bdr-radius-sm) !important',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--bf-bg-hover, rgba(0, 0, 0, 0.1))',
    },
    ':focus': {
      outline: '2px solid var(--bf-tertiary, #0066ff)',
      outlineOffset: '2px',
    },
  },
  chevronIcon: {
    transition: 'transform 0.2s ease',
    color: 'var(--bf-font-secondary, #6b7280)',
  },
  chevronIconOpen: {
    transform: 'rotate(180deg) !important',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: '0',
    zIndex: '1000',
    width: '100%',
    minWidth: '250px',
    maxWidth: '400px',
    backgroundColor: '#fff',
    border: '1px solid var(--bf-border, #e5e7eb)',
    borderRadius: 'var(--bf-bdr-radius-md)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  searchWrapper: {
    position: 'relative',
    padding: '8px',
    borderBottom: '1px solid var(--bf-stroke-clr, #e5e7eb)',
  },
  searchInput: {
    width: '100%',
    padding: '8px 22px 8px 10px !important',
    fontSize: '14px',
    color: 'var(--bf-font-primary)',
    backgroundColor: 'var(--bf-bg-offwhite, #f9fafb)',
    border: '1px solid var(--bf-stroke-clr, #e5e7eb) !important',
    borderRadius: '6px',
    outline: 'none',
    lineHeight: '1 !important',
    transition: 'border-color 0.2s ease',
    ':focus': {
      borderColor: 'var(--bf-tertiary, #0066ff) !important',
    },
  },
  searchIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--bf-font-secondary, #6b7280)',
  },
  optionsList: {
    maxHeight: '300px',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '4px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    fontSize: '14px',
    color: 'var(--bf-font-primary)',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background-color 0.15s ease',
    ':hover': {
      backgroundColor: 'var(--bf-bg-hover, #f3f4f6)',
    },
  },
  optionHighlighted: {
    backgroundColor: 'var(--bf-bg-hover, #f3f4f6)',
  },
  optionSelected: {
    backgroundColor: 'var(--bf-bg-selected, #e0f2fe)',
    fontWeight: '500',
    ':hover': {
      backgroundColor: 'var(--bf-bg-selected-hover, #bae6fd)',
    },
  },
  checkIcon: {
    color: 'var(--bf-primary, #0066ff)',
    flexShrink: '0',
  },
  noResults: {
    padding: '12px',
    fontSize: '14px',
    color: 'var(--bf-font-secondary, #6b7280)',
    textAlign: 'center',
  },
}

