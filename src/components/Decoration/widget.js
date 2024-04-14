const widgets = {}
const modules = import.meta.glob('./PC/*View.vue', { eager: true })
for (let each in modules) {
  const name = modules[each].default.__name
  widgets[name] = modules[each].default
}
export default widgets
