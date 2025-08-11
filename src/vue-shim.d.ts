declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Additional type declarations for assets if needed
declare module '*.svg'
declare module '*.png' 
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.webp'