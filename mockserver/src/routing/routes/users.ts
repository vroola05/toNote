const RouteTable = [
    {
		path: '/users', 
		methods: {
			'GET' : (store: any) => (req: any, res: any, next: any) => {
				console.log(store.users)
				const users = store.users.find({})	
                
                res.send(users);
			}
		}		
	}
]

export default RouteTable