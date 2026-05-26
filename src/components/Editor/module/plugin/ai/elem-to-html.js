const elemToHtml = (elem) => {
  const { value = '' } = elem
  return `<div data-w-e-type="ai">${value}</div>`
}

export default {
  type: 'ai',
  elemToHtml
}
