var DataConnector = function DataService(db:Collection<any>) {
	
	const findOne = (filter = {}) => {
		return db.findOne(filter)
	}

	const find = (filter = {}) => {
		return db.find(filter)
	}

	const where = (handler: (a: any, b: any) => boolean) => {
		//return db.where(handler)
	}

	const removeOne = function(filter = {}) {
		const item = db.findOne(filter)
		if (item) {
			db.remove(item)		
			return true
		}	
		return false
	}

	const remove = function(filter = {}) {
		const itemsToRemove = db.find(filter)

		if (itemsToRemove && itemsToRemove.length) {			
			db.remove(itemsToRemove)		
			return true
		}	

		return false
	}

	const insertOne = function(data: any) {
		
		let inserted
		
		inserted = db.insert(data)

		return inserted
	}

	const insert = function(data: any) {		
		
		let inserted
		if (Array.isArray(data)) {
			inserted = data.map(insertOne)	
		}
		else {
			inserted = insertOne(data)
		}		

		return inserted
	}

	const updateOne = function(data: any) {

		let updated
		if (data) {
			db.update(data)									
			updated = data
		}		
		
		return updated
	}

	const update = function(data: any) {		
		
		let updated
		if (Array.isArray(data)) {
			updated = data.map(updateOne)	
		}
		else {
			updated = updateOne(data)
		}		
		
		return updated
	}
	return {
		find,
		findOne,
		where,
		removeOne,
		remove,
		insert,
		insertOne,
		update,
		updateOne
	}
}
module.exports = DataConnector;