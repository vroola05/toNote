const users = [{
    name: 'users',
    populateStore : (store: any) => {
        store.users.insertOne(
            {'name': 'Martin'}
        )
     }
}]

export default users;