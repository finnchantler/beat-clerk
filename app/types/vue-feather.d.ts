import VueFeather from 'vue-feather'

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    VueFeather: typeof VueFeather
  }
}
