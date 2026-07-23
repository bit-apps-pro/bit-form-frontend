import { useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import { Link, useParams } from 'react-router-dom'
import CheckMarkIcn from '../../../Icons/CheckMarkIcn'
import CopyIcn from '../../../Icons/CopyIcn'
import DownloadIcon from '../../../Icons/DownloadIcon'
import EditIcn from '../../../Icons/EditIcn'
import EyeIcon from '../../../Icons/EyeIcon'
import MoreVerticalIcn from '../../../Icons/MoreVerticalIcn'
import RefreshIcn from '../../../Icons/RefreshIcn'
import TrashIcn from '../../../Icons/TrashIcn'
import { IS_PRO } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import ProBadge from '../../Utilities/ProBadge'
import Tip from '../../Utilities/Tip'
import { Theme } from '../Types/ThemeGallery.types'
import themeCardStyles from './ThemeCard.styles'

interface ThemeCardProps {
  theme: Theme
  isActive: boolean
  isApplied: boolean
  isPreview?: boolean
  isAppliedStylesCard?: boolean
  isCustomTheme?: boolean
  onApply: () => void
  onPreview: () => void
  onDuplicate: () => void
  onDelete?: () => void
  onExport?: () => void
  onSetDefault?: () => void
  onRename?: () => void
  onResetTheme?: () => void
  onUpdateTheme?: () => void
  onSaveAsNew?: () => void
}

export default function ThemeCard({
  theme,
  isActive,
  isApplied,
  isPreview = false,
  isAppliedStylesCard = false,
  isCustomTheme = false,
  onApply,
  onPreview,
  onDuplicate,
  onDelete,
  onExport,
  onSetDefault,
  onRename,
  onResetTheme,
  onUpdateTheme,
  onSaveAsNew,
}: ThemeCardProps) {
  const { css } = useFela()
  const { formType, formID } = useParams<{ formType: string; formID: string }>()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])
  // Extract color palette from theme
  const getColorPalette = (): string[] => {
    const colors: string[] = []

    if (theme.themeColors?.lightThemeColors) {
      const themeColorVars = theme.themeColors.lightThemeColors

      // Extract main colors
      if (themeColorVars['--global-bg-color'] !== undefined) colors.push(themeColorVars['--global-bg-color'])
      if (themeColorVars['--global-fld-bg-color'] !== undefined) colors.push(themeColorVars['--global-fld-bg-color'])
      if (themeColorVars['--global-fld-bdr-clr'] !== undefined) colors.push(themeColorVars['--global-border-color'])
      if (themeColorVars['--global-font-color'] !== undefined) colors.push(themeColorVars['--global-font-color'])
      if (themeColorVars['--global-accent-color'] !== undefined) colors.push(themeColorVars['--global-accent-color'])
    }

    // Fallback colors if none found
    if (colors.length === 0) {
      colors.push('#E8E8E8', '#C0C0C0', '#404040', '#eb252fff', '#3B82F6')
    }

    return colors.slice(0, 5) // Only show 5 colors as per the design
  }

  const colorPalette = getColorPalette()
  const fontFamily = theme?.styles?.lgLightStyles?.font?.fontFamily || 'Inherit'

  return (
    <div className={`${css(themeCardStyles.card)} ${isApplied ? 'applied' : ''} ${isActive ? 'active' : ''} ${isAppliedStylesCard ? 'appliedStylesCard' : ''}`}>
      <div className={css(themeCardStyles.cardHeader)}>
        <h4 className={css(themeCardStyles.themeName)}>{theme.name}</h4>

        <div className={css(themeCardStyles.actions)}>
          {/* For Applied Styles Card: Always show Edit button, no Apply button */}
          {isAppliedStylesCard && (
            <Tip className="" msg="Edit Form Styles">
              <Link
                to={`/form/builder/${formType}/${formID}/theme-customize/quick-tweaks`}
                className={css([themeCardStyles.applyBtn, { flx: 'center', gp: 5 }])}
                aria-label="Edit Form Styles"
              >
                <EditIcn size={14} stroke={2} />
                {__('Customize')}
              </Link>
            </Tip>
          )}
          <>
            {/* For regular theme cards: Show Apply/Applied badge */}
            {isApplied && !isAppliedStylesCard && (
              <span className={css(themeCardStyles.appliedBadge)}>
                <CheckMarkIcn size={18} />
                {/* Applied */}
              </span>
            )}

            {!isAppliedStylesCard && (
              <button
                onClick={onApply}
                className={css(themeCardStyles.applyBtn)}
                aria-label="Apply theme"
              >
                Apply
              </button>
            )}


            {/* Show Edit button only when applied */}
            {/* {isApplied && (
              <Tip className="" msg="Edit theme">
                <Link
                  to={`/form/builder/${formType}/${formID}/theme-customize/quick-tweaks`}
                  className={css(themeCardStyles.iconBtn)}
                  aria-label="Edit theme"
                >
                  <EditIcn size={18} stroke={2} />
                </Link>
              </Tip>
            )} */}

            {/* Show Preview button only when NOT applied */}
            {isPreview && (
              <Tip className="" msg="Preview theme">
                <button
                  onClick={onPreview}
                  className={css(themeCardStyles.iconBtn)}
                  aria-label="Preview theme"
                >
                  <EyeIcon size="18" />
                </button>
              </Tip>
            )}
          </>


          {/* More options menu */}
          <div className={css(themeCardStyles.menuWrapper)} ref={menuRef}>
            <Tip className="" msg="More options">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={css(themeCardStyles.iconBtn)}
                aria-label="More options"
              >
                <MoreVerticalIcn size="18" />
              </button>
            </Tip>

            {showMenu && (
              <div className={css(themeCardStyles.dropdownMenu)}>
                {/* Applied Styles Card Menu */}
                {isAppliedStylesCard ? (
                  <>
                    {onResetTheme && (
                      <button onClick={() => { onResetTheme(); setShowMenu(false) }}>
                        <RefreshIcn size={14} />
                        <span>{__('Reset Theme Style')}</span>
                      </button>
                    )}

                    {isCustomTheme && onUpdateTheme && (
                      <button onClick={() => { onUpdateTheme(); setShowMenu(false) }}>
                        <EditIcn size={14} stroke={2} />
                        <span>{__('Update Theme Style')}</span>
                      </button>
                    )}

                    {/* {onSetDefault && !isActive && (
                      <button onClick={() => { onSetDefault(); setShowMenu(false) }}>
                        <CheckMarkIcn size={14} />
                        <span>Set as Default</span>
                      </button>
                    )} */}

                    {onSaveAsNew && (
                      <>
                        <div className={css(themeCardStyles.menuDivider)} />
                        <button onClick={() => { onSaveAsNew(); setShowMenu(false) }}>
                          <CopyIcn size={14} />
                          <span>{__('Save as New Theme')}</span>
                          {!IS_PRO && <ProBadge proProperty='customTheme' />}
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Regular Theme Card Menu */}
                    <button onClick={() => { onDuplicate(); setShowMenu(false) }}>
                      <CopyIcn size={14} />
                      <span>Duplicate</span>
                      {!IS_PRO && <ProBadge proProperty='customTheme' />}
                    </button>

                    {theme.type === 'custom' && (
                      <>
                        {onRename && (
                          <button onClick={() => { onRename(); setShowMenu(false) }}>
                            <EditIcn size={14} stroke={2} />
                            <span>Rename</span>
                            {!IS_PRO && <ProBadge proProperty='customTheme' />}
                          </button>
                        )}

                        {onExport && (
                          <button onClick={() => { onExport(); setShowMenu(false) }}>
                            <DownloadIcon size="14" />
                            <span>Export</span>
                            {!IS_PRO && <ProBadge proProperty='customTheme' />}
                          </button>
                        )}

                        {onDelete && !isApplied && (
                          <>
                            <div className={css(themeCardStyles.menuDivider)} />
                            <button
                              onClick={() => { onDelete(); setShowMenu(false) }}
                              className={css(themeCardStyles.deleteBtn)}
                            >
                              <TrashIcn size={14} />
                              <span>Delete</span>
                              {!IS_PRO && <ProBadge proProperty='customTheme' />}
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={css(themeCardStyles.content)}>
        <div className={css(themeCardStyles.colorPalette)}>
          {colorPalette.map((color, index) => (
            <div
              key={index}
              className={css(themeCardStyles.colorCircle)}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className={css(themeCardStyles.fontInfo)}>
          <span className={css(themeCardStyles.fontLabel)}>Font Family:</span>
          <span className={css(themeCardStyles.fontName)}>{fontFamily}</span>
        </div>
      </div>
    </div >
  )
}