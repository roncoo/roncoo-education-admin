function parseHtml(elem, children, editor) {
  const value = elem.innerHTML || ''
  return {
    type: 'ai',
    value,
    children: []
  }
}

const parseHtmlConf = {
  selector: 'div[data-w-e-type="ai"]',
  parseElemHtml: parseHtml
}

export default parseHtmlConf
