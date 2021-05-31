declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}
declare module 'mapbox-gl';
declare module '@mapbox/mapbox-gl-geocoder';
declare module 'ngeohash';
declare module 'unirest';