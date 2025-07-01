import { useUserStore } from '@/store/user'
import { fetchUser } from '@/api/use'
let preState = false

export default () => {
  // console.warn('get in check prov ajax state === ',preState)
  return new Promise((resolve) => {
    const userStore = useUserStore()
    if (!preState) {
      const token = localStorage.getItem('tokenName') || '';
      fetchUser({ token })
        .then((res) => {
          // console.log('fetch user ', res)
          if (res) {
            preState = true //changeState
            const userData = res;
            userStore.setUser(userData)
            // userStore.setPermissions(res.data.permissions)
            resolve(userData)
          }
        })
        .catch((err) => {
          preState = true //changeState
          resolve(null)
          console.error(err)
        })
    } else {
      resolve(userStore.userName
        ? {
          user_name: userStore.userName
          // permissions: store.getters.getPermissions
        }
        : null)
    }
  })
}

export const setPreIntState = (state: boolean) => (preState = !!state)
