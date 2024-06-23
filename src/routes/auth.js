import storage from '../services/storage'

const isAuthenticated = () => {
  const logged = storage.auth.token

  let status = false
  if (logged) {
    status = true
  } else {
    status = false
  }
  return status
}

export default isAuthenticated
