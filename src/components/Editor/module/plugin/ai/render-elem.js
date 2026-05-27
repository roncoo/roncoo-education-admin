import { h } from 'snabbdom'

function renderAi(elem, children, editor) {
  const { value = '' } = elem
  return h(
    'div',
    {
      props: {
        class: 'ai-element',
        contenteditable: true
      }
    },
    [
      h(
        'div',
        {
          props: {
            innerHTML: value
          }
        },
        null
      )
    ]
  )
}

const conf = {
  type: 'ai', // 节点 type ，重要！！！
  renderElem: renderAi
}

export default conf
