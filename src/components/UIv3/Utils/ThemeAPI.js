/**
 * API functions for theme management
 */

import bitsFetch from '../../../Utils/bitsFetch'

/**
 * Make request using bitsFetch
 * @param {string} action - WordPress AJAX action
 * @param {Object} data - Data to send
 * @param {Object} queryParam - Optional query parameters
 * @returns {Promise}
 */
const makeRequest = async (action, data = {}, queryParam = null) => {
  try {
    const result = await bitsFetch(data, action, null, queryParam)

    if (!result.success) {
      throw new Error(result.data || 'Request failed')
    }

    return result.data
  } catch (error) {
    console.error(`Error in ${action}:`, error)
    throw error
  }
}

const ThemeAPI = {
  /**
   * Get all custom themes
   */
  async getCustomThemes() {
    return makeRequest('bitform_get_custom_themes')
  },

  /**
   * Save or update a custom theme
   * @param {Object} themeData - Complete theme data
   */
  async saveTheme(themeData) {
    return makeRequest('bitform_save_custom_theme', themeData)
  },

  /**
   * Delete a custom theme
   * @param {string} themeSlug
   */
  async deleteTheme(themeSlug) {
    return makeRequest('bitform_delete_custom_theme', { theme_slug: themeSlug })
  },

  /**
   * Duplicate a theme
   * @param {string} sourceSlug
   * @param {string} newName
   */
  async duplicateTheme(sourceSlug, newName) {
    return makeRequest('bitform_duplicate_theme', {
      source_slug: sourceSlug,
      new_name: newName,
    })
  },

  /**
   * Set default theme
   * @param {string} themeSlug
   */
  async setDefaultTheme(themeSlug) {
    return makeRequest('bitform_set_default_theme', { theme_slug: themeSlug })
  },

  /**
   * Rename a custom theme
   * @param {string} themeSlug
   * @param {string} newName
   */
  async renameTheme(themeSlug, newName) {
    return makeRequest('bitform_rename_theme', {
      theme_slug: themeSlug,
      new_name: newName,
    })
  },

  /**
   * Export theme as JSON
   * @param {string} themeSlug
   */
  async exportTheme(themeSlug) {
    const result = await makeRequest('bitform_export_theme', { theme_slug: themeSlug })

    // Download JSON file
    const blob = new Blob([result.json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${themeSlug}-theme.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return result
  },

  /**
   * Import theme from JSON
   * @param {string} jsonData
   * @param {string} newName (optional)
   */
  async importTheme(jsonData, newName = null) {
    return makeRequest('bitform_import_theme', {
      json_data: jsonData,
      new_name: newName,
    })
  },
}

export default ThemeAPI
