
export interface Session {
    id:string
    namespaces: Namespaces | null
}
interface Namespaces {
    account: Account
    authentication: Authentication
    profile: Profile | null
    public: any
    store: Store
}
interface Store {
    admin_cultureInfo: StoreAll
    channel: StoreAll
    countryCode: StoreAll
    cultureInfo: StoreAll
    currencyCode: StoreAll
    currencySymbol: StoreAll
}
interface StoreAll {
    value:string
}
interface Profile {
    email: Email
    firstName: Email | null
    lastName: Email | null
    id: IdProfile
    isAuthenticated: IsAuthenticated
}
interface IsAuthenticated {
    value:string
}
interface IdProfile {
    value:string
}
interface Email {
    value:string
}
interface Authentication {
    storeUserEmail: StoreUserEmail | undefined
    storeUserId: StoreUserId
}
interface StoreUserId {
    value:string
}
interface StoreUserEmail {
    value:string
}
interface Account {
    accountName:AccountName
    id:Id
}
interface AccountName {
    value:string
}
interface Id {
    keepAlive:boolean
    value:string
}