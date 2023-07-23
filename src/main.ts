import './styles/app.scss'
//@ts-ignore
import App from './App.svelte'

//@ts-ignore
const app = new App({
    target: document.querySelector('div'),
})


export default app
