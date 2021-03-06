import S3 from 'aws-s3';
import Cookie from "js-cookie"
const config = {
	bucketName: process.env.REACT_APP_buckt_name,
	region: process.env.REACT_APP_REGION,
	accessKeyId: process.env.REACT_APP_Access_key_ID,
	secretAccessKey: process.env.REACT_APP_Secret_access_key,
}
const S3Client = new S3(config);

const HOST = process.env.NODE_ENV !== 'development' ? process.env.REACT_APP_BACKEND_PROD : process.env.REACT_APP_BACKEND_PORT;
const myHeaders = new Headers({
'Content-Type': 'application/json',
});


const registerUser = async (user_first_name, user_last_name, user_email, user_password, pictures) => {

	// upload photo
	let profile_picture_url = ""
	if(pictures.length > 0){
		let data = await uploadPhoto(pictures, email)
		profile_picture_url = data.location
	}
	// regist user
	const endpoint = `${HOST}/dev/api/volunteers`;
	console.log({endpoint});
	const newUser = {
		first_name: user_first_name,
		last_name: user_last_name,
		email: user_email,
		password: user_password,
		profile_picture_url: profile_picture_url
	}
	const bodyToSend = JSON.stringify(newUser);
	console.log({bodyToSend});

	const options = {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: bodyToSend,
									}

	const response = await fetch(endpoint, options);
	let data;
	try { 
		data = await response.json()
	} catch (err) {
		console.log(`${err}: register user, response: ${data}`);
		
	}
  return { body: data, photo_url: profile_picture_url };

}

const uploadPhoto = async (pictures, email) => {
	try{
		const data = await S3Client.uploadFile(pictures[0], email + "-profile")
		console.log(data)
		return data
	} catch(err){
		console.log(err)
	}

}





const getEvents = (user, preferences) => {
	console.log("getting events UserService");
	return fetch(`${HOST}/dev/api/events`)
	.then(res => res.json())
	.then(res => {
		if(res.error) {
			throw(res.error)
		}
		console.log(JSON.parse(res.body))
		return JSON.parse(res.body)
	})
}


const updatePreferences = (user, preferences) => {
	console.log("updating preferences UserService")
	const token =  Cookie.get("token") ? Cookie.get("token") : null
	console.log({preferences});
	
	return fetch(`${HOST}/dev/api/preferences/` + user,
	{
		headers: {
		  'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,

		},
		method: 'POST',
		body: JSON.stringify(preferences)
	})
	.then(res => res.json())
	.then(res => {
		if(res.error) {
			throw(res.error)
		}
		console.log(JSON.parse(res.body))
		return JSON.parse(res.body)
	})

}

const getPreferences = (userId) => {
	console.log("getting preferences UserService")
	return fetch(`${HOST}/dev/api/preferences/` + userId)
	.then(res => res.json())
	.then(res => {
		if(res.error) {
			throw(res.error)
		}
		console.log("the body is: ", res.body)
		return (res.body)
	})
}

const getEventTypes = () => {
	console.log("get all event types")
	return fetch(`${HOST}/dev/api/event_types`)
	.then(res => res.json())
	.then(res => {
		if(res.error) {
			throw(res.error)
		}
		console.log("the body is: ", res.body)
		return (res.body)
	})
}

const getUserStatistics = (userId) => {
	console.log("fetching user statistics")
	const token =  Cookie.get("token") ? Cookie.get("token") : null
	return fetch(`${HOST}/dev/api/statistics/` + userId, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}})
	.then(res => res.json())
	.then(res => {
		if(res.error) {
			throw(res.error)
		}
		console.log("the body is: ", res.body)
		return (res.body)
	})
}

const getUserAchievements = (userId) => {
	console.log("fetching user achievements")
	const token =  Cookie.get("token") ? Cookie.get("token") : null
	return fetch(`${HOST}/dev/api/achievements/` + userId, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}})
	.then(res => res.json())
	.then(res => {
		if(res.error) {
			throw(res.error)
		}
		console.log("the body is: ", res.body)
		return (res.body)
	})
}

/**
 * Returns the events that a user has enrolled in 
 * @param {integer} userId 
 */
const getEnrolledEvents = (userId) => {
	const token =  Cookie.get("token") ? Cookie.get("token") : null
	return fetch(`${HOST}/dev/api/enrollments/${userId}`, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}})
		.then(res => res.json())
		.then(res => {
			if(res.statusCode !== 200) {
				throw(`Problem getting event for user: ${res.body}`)
			}
			return JSON.parse(res.body)
		})
		.catch(error => {
			console.error(error);
		})
}
/**
 * Returns the events that a user has attended
 * @param {integer} userId 
 */
const getAttendedEvents = (userId) => {
	const token =  Cookie.get("token") ? Cookie.get("token") : null
	return fetch(`${HOST}/dev/api/enrollments/attended/${userId}`, {method: 'GET', headers: {'Authorization': `Bearer ${token}`}})
		.then(res => res.json())
		.then(res => {
			if(res.statusCode !== 200) {
				throw(`Problem getting event for user: ${res.body}`)
			}
			return JSON.parse(res.body)
		})
		.catch(error => {
			console.error(error);
		})
}

const enrollInEvent = (userId, eventId) => {
	console.log(userId, eventId)
	const token =  Cookie.get("token") ? Cookie.get("token") : null
	return fetch(`${HOST}/dev/api/enrollments/add`, {
        method: 'post',
        body:    JSON.stringify({event_id: eventId, user_id: userId, attended: 0}),
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })
	.then(res => res.json())
	.then(res => {
		if(res.error) {
			throw(res.error)
		}
		console.log("result: ", res)
		return res
	})
}



export const userService = {
	getEvents, getEnrolledEvents, getAttendedEvents, enrollInEvent, getUserAchievements,
	updatePreferences, getPreferences, getEventTypes, getUserStatistics,
	registerUser
}