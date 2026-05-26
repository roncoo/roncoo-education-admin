import { h } from 'snabbdom'

const renderElem = (elem) => {
  const { value = '' } = elem
  return h(
    'div',
    {
      props: { contentEditable: true },
      attrs: { 'data-w-e-type': 'ai' }
    },
    value
  )
}

export default {
  type: 'ai',
  renderElem
}
