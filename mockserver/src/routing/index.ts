

export const applyRoutes = (app: any, routeTable: any[]) => {
    
    if (routeTable && routeTable.length) {
        routeTable.forEach(route => {			
            const { path, methods = {} } = route;
    
            Object.keys(methods).forEach(method =>{

                const handler = methods[method]					

                if (typeof handler === 'function') {
                    const store = app.get('store')
                    let routeHandler = handler(store)
                    
                    if(routeHandler){
                        
                        app[method.toLowerCase()](path, routeHandler)		
                    }
                }
            });
        });
    }
}