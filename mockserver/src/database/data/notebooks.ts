const users = [{
    name: 'notebooks',
    populateStore : (store: any) => {
        store.users.insertOne(
            {
                'id': 1, 
                'userId': 0, 
                'name': 'Martin',
                'creationDate': Date.now(),
                'modifyDate': Date.now()
            }
        )
     }
}]

export default users;