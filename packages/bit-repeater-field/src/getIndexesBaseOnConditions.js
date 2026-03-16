function getIndexsFromLogics(logics, props) {
  if (!Array.isArray(logics)) {
    const repeatFieldKey = checkRepeatedField(logics.field, props)
    if (repeatFieldKey) {
      return getRepeatedIndexes(repeatFieldKey, props)
    }
  }
  if (Array.isArray(logics)) {
    for (let i = 0; i < logics.length; i++) {
      const indexes = getIndexsFromLogics(logics[i], props)
      if (indexes) return indexes
    }
    return false
  }
  return false
}

export default function getIndexesBaseOnConditions(conditions, props) {
  let indexes = false
  conditions.forEach(condition => {
    if (['if', 'else-if'].includes(condition.cond_type)) {
      indexes = getIndexsFromLogics(condition.logics, props)
      if (indexes) return indexes
    }
  })
  return indexes
}
