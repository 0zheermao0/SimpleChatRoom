import { createStore } from 'vuex'

export default createStore({
    state: {
        user:'',
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            const maxAgeTime = new Date().getTime() + 1000 * 3600 // 当前时间的+1小时->过期时间
            try {
                let data = { user, maxAge: maxAgeTime }
                window.localStorage.setItem('user', JSON.stringify(data))
            } catch (err) {
                console.log(err)
            }
        },
        removeUser () {
            window.localStorage.removeItem('user')
        },
    },
    getters: {
        getUser: state => {
            return state.user
        }
    }
})
