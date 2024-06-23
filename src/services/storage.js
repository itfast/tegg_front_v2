const storageConfig = {
  auth: {
    token: 'auth.token',
  },
}

const local = 'Session Storage:'

function strgload(path) {
  try {
    return JSON.parse(sessionStorage.getItem(path) || '')
  } catch (err) {
    console.debug(local, err)
    return null
  }
}

function strgstore(path, value) {
  try {
    sessionStorage.setItem(path, JSON.stringify(value))
  } catch (err) {
    console.debug(local, err)
  }
}

function strgdelete(path) {
  try {
    sessionStorage.removeItem(path)
  } catch (err) {
    console.debug(local, err)
  }
}

function strgstoreordelete(path, value) {
  // eslint-disable-next-line no-unused-expressions
  value ? strgstore(path, value) : strgdelete(path)
}

export default {
  acl: {
    /**
     * @returns {Object.<number, number>}
     */
    // get condominium_roles() {
    //   return strgload(storageConfig?.acl.condominium_roles) || {}
    // },
    // set condominium_roles(value) {
    //   strgstoreordelete(storageConfig.acl.condominium_roles, value)
    // },
    /**
     * @returns {number}
     */
    // get system_role() {
    //   const role = strgload(storageConfig.acl.system_role)
    //   return role ? Number(role) : null
    // },
    // set system_role(value) {
    //   strgstoreordelete(storageConfig.acl.system_role, value)
    // },
  },
  auth: {
    /**
     * @returns {boolean}
     */
    get language() {
      return strgload(storageConfig.auth.language)
    },
    set language(value) {
      strgstore(storageConfig.auth.language, value)
    },

    /**
     * @returns {string}
     */
    get token() {
      return strgload(storageConfig.auth.token)
    },
    set token(value) {
      strgstoreordelete(storageConfig.auth.token, value)
    },

    /**
     * @returns {string}
     */
    get projectDetails() {
      return strgload(storageConfig.auth.projectDetails)
    },
    set projectDetails(value) {
      strgstoreordelete(storageConfig.auth.projectDetails, value)
    },

    /**
     * @returns {string}
     */
    // get allDetails() {
    //   return strgload(storageConfig.auth.allDetails)
    // },
    // set allDetails(value) {
    //   strgstoreordelete(storageConfig.auth.allDetails, value)
    // },

    /**
     * @returns {string}
     */
    // get detailsCondo() {
    //   return strgload(storageConfig.auth.detailsCondo)
    // },
    // set detailsCondo(value) {
    //   strgstoreordelete(storageConfig.auth.detailsCondo, value)
    // },
  },
}
