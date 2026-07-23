/* eslint-disable camelcase */
import noStyleTheme from './0_noStyle'
import bitformLegacyTheme from './1_bitformLegacy'
import atlassianThemeConfig from './2_atlassian/atlassianThemeConfig'
import bitformDefaultConfig from './3_bitformDefault/bitformDefaultConfig'

// Registry of all base themes (themes with full field implementations)
const baseThemes = {
  noStyle: noStyleTheme,
  bitformLegacy: bitformLegacyTheme,
}

// Registry of derived themes (config-based)
// These themes inherit from base themes and only override specific properties
const derivedThemes = {
  bitformDefault: bitformDefaultConfig,
  atlassian: atlassianThemeConfig,
}

export { baseThemes, derivedThemes }
