# How to get started.
```
	npm i 
	npm start
```
# API Documentation
## 1. Send email

	Trigger an email to users in the group specified by group_key.
	In the email is a unique URL to that ImageSet.

* **End Point**

	`/send_email`
	
* **Method:**

	`POST`
	
*  **URL Params (Required)**
	
	`group_key`=[string]

	`image_set_key`=[string]

* **Success Response:**

	**Code:** `200 (OK)`

	**Content:** `success`

* **Example Request and Response**

	`POST : http://ec2-34-251-223-6.eu-west-1.compute.amazonaws.com:3000/send_email`

		{
			"group_key": "123456",
			"image_set_key": "somekey"
		}

	`Response : "success"`

