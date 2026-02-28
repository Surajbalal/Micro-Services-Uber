# Backend API Documentation

## Endpoint: `/users/register`

### Description
This endpoint is used to register a new user in the system. It validates the input data, hashes the password, and stores the user information in the database. Upon successful registration, it returns a JWT token and the user details.

### HTTP Method
**POST**

### Request Body
The endpoint expects the following JSON payload:

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Validation Rules
- `fullName.firstName`: Must be at least 4 characters long.
- `fullName.lastName`: Optional, but if provided, must be at least 4 characters long.
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

### Response

#### Success Response
**Status Code:** `201 Created`

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a7b2c3d4e5f6g7h8i9j0k1",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### Error Responses

1. **Validation Errors**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "First name should be at least 4 characters long",
         "param": "fullName.firstName",
         "location": "body"
       },
       {
         "msg": "Invalid Email",
         "param": "email",
         "location": "body"
       }
     ]
   }
   ```

2. **Missing Fields**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "All fields are required",
         "param": "general",
         "location": "body"
       }
     ]
   }
   ```

### Notes
- The `password` field is hashed before being stored in the database.
- The `token` is generated using the user's unique ID and a secret key defined in the environment variable `JWT_SECRET`.
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.

### Example cURL Request
```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

## Endpoint: `/users/login`

### Description
This endpoint is used to authenticate a user. It validates the input data, checks the email and password against the database, and returns a JWT token upon successful authentication.

### HTTP Method
**POST**

### Request Body
The endpoint expects the following JSON payload:

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Validation Rules
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

### Response

#### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a7b2c3d4e5f6g7h8i9j0k1",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### Error Responses

1. **Validation Errors**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "Invalid Email",
         "param": "email",
         "location": "body"
       },
       {
         "msg": "Password should be at least 6 characters long",
         "param": "password",
         "location": "body"
       }
     ]
   }
   ```

2. **Invalid Credentials**
   **Status Code:** `401 Unauthorized`

   **Response Body:**
   ```json
   {
     "message": "Invalid email or password"
   }
   ```

### Notes
- The `password` is compared using bcrypt to ensure security.
- The `token` is generated using the user's unique ID and a secret key defined in the environment variable `JWT_SECRET`.
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.

### Example cURL Request
```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

## Endpoint: `/users/profile`

### Description
This endpoint is used to retrieve the profile of the currently authenticated user. It requires the user to be authenticated by providing a valid JWT token.

### HTTP Method
**GET**

### Headers
- `Authorization`: Bearer token (JWT)

### Response

#### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
{
  "_id": "64a7b2c3d4e5f6g7h8i9j0k1",
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com"
}
```

#### Error Responses

1. **Unauthorized Access**
   **Status Code:** `401 Unauthorized`

   **Response Body:**
   ```json
   {
     "message": "Unauthorized access"
   }
   ```

### Notes
- The endpoint uses the `authUser` middleware to verify the user's authentication status.
- Ensure the `Authorization` header is set with a valid JWT token.

---

## Endpoint: `/users/logOut`

### Description
This endpoint is used to log out the currently authenticated user. It invalidates the user's JWT token by adding it to a blacklist.

### HTTP Method
**GET**

### Headers
- `Authorization`: Bearer token (JWT)

### Response

#### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses

1. **Unauthorized Access**
   **Status Code:** `401 Unauthorized`

   **Response Body:**
   ```json
   {
     "message": "Unauthorized access"
   }
   ```

### Notes
- The endpoint uses the `authUser` middleware to verify the user's authentication status.
- The token is added to the blacklist to prevent further use.

## Endpoint: `/captain/register`

### Description
This endpoint is used to register a new captain. It validates the input data, hashes the password, and stores the captain information in the database. Upon successful registration, it returns a JWT token and the captain details.

### HTTP Method
**POST**

### Request Body
The endpoint expects the following JSON payload:

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": "4",
    "vehicleType": "car"
  }
}
```

### Validation Rules
- `fullName.firstName`: Must be at least 4 characters long.
- `fullName.lastName`: Optional, but if provided, must be at least 4 characters long.
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.
- `vehicle.color`: Must be at least 3 characters long.
- `vehicle.plate`: Must be at least 3 characters long.
- `vehicle.capacity`: Must be at least 1.
- `vehicle.vehicleType`: Must be one of `car`, `motorcycle`, or `auto`.

### Response

#### Success Response
**Status Code:** `201 Created`

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "61a7f6e8e8e8e8e8e8e8e8e8",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": "4",
      "vehicleType": "car"
    }
  }
}
```

#### Error Responses

1. **Validation Errors**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "First name should be at least 4 characters long",
         "param": "fullName.firstName",
         "location": "body"
       },
       {
         "msg": "Invalid Email",
         "param": "email",
         "location": "body"
       }
     ]
   }
   ```

2. **Missing Fields**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "All fields are required",
         "param": "general",
         "location": "body"
       }
     ]
   }
   ```

3. **Captain Already Exists**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "message": "Captain already exists"
   }
   ```

### Notes
- The `password` field is hashed before being stored in the database.
- The `token` is generated using the captain's unique ID and a secret key defined in the environment variable `JWT_SECRET`.
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.

### Example cURL Request
```bash
curl -X POST http://localhost:4000/captain/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": "4",
      "vehicleType": "car"
    }
  }'
```

### GET /captain/profile

This endpoint retrieves the profile of the authenticated captain.

#### Headers
- `Authorization` (string, required): The Bearer token for authentication.

#### Responses
- `200 OK`: Returns a JSON object containing the captain's profile details.
- `401 Unauthorized`: If the token is invalid, expired, or missing.

#### Example Response
- Success:
```json
{
  "_id": "61a7f6e8e8e8e8e8e8e8e8e8",
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": "4",
    "vehicleType": "car"
  }
}
```

### POST /captain/login

This endpoint is used to log in a captain.

#### Request Body
The request body should be a JSON object with the following fields:
- `email` (string, required): The email address of the captain.
- `password` (string, required): The password for the captain's account.

#### Responses
- `200 OK`: Returns a JSON object containing the authentication token and captain details.
- `400 Bad Request`: If validation fails.
- `401 Unauthorized`: If the email or password is incorrect.

#### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

#### Example Response
- Success:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "61a7f6e8e8e8e8e8e8e8e8e8",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": "4",
      "vehicleType": "car"
    }
  }
}
```
- Error:
```json
{
  "message": "Invalid email or password"
}
```

### POST /captain/logout

This endpoint is used to log out a captain.

#### Headers
- `Authorization` (string, required): The Bearer token for authentication.

#### Responses
- `200 OK`: Returns a success message indicating the captain has been logged out.
- `401 Unauthorized`: If the token is invalid, expired, or missing.

#### Example Response
- Success:
```json
{
  "message": "logout successfully"
}
```

## Endpoint: `/maps/get-coordinates`

### Description
This endpoint retrieves the geographical coordinates (latitude and longitude) for a given address.

### HTTP Method
**GET**

### Query Parameters
- `address` (string, required): The address to retrieve coordinates for. Must be at least 3 characters long.

**Where to send:** Include the `address` parameter in the query string of the URL.

Example:
```
/maps/get-coordinates?address=1600+Amphitheatre+Parkway
```

### Response

#### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
{
  "lat": 37.7749,
  "lng": -122.4194
}
```

#### Error Responses
1. **Validation Errors**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "Address must be at least 3 characters long",
         "param": "address",
         "location": "query"
       }
     ]
   }
   ```

2. **Coordinates Not Found**
   **Status Code:** `404 Not Found`

   **Response Body:**
   ```json
   {
     "message": "Coordinates not found"
   }
   ```

---

## Endpoint: `/maps/get-distance-time`

### Description
This endpoint calculates the distance and estimated travel time between two locations.

### HTTP Method
**GET**

### Query Parameters
- `origin` (string, required): The starting location. Must be at least 3 characters long.
- `destination` (string, required): The destination location. Must be at least 3 characters long.

**Where to send:** Include the `origin` and `destination` parameters in the query string of the URL.

Example:
```
/maps/get-distance-time?origin=San+Francisco&destination=Los+Angeles
```

### Response

#### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
{
  "distance": "10 km",
  "duration": "15 mins"
}
```

#### Error Responses
1. **Validation Errors**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "Origin must be at least 3 characters long",
         "param": "origin",
         "location": "query"
       },
       {
         "msg": "Destination must be at least 3 characters long",
         "param": "destination",
         "location": "query"
       }
     ]
   }
   ```

2. **Calculation Failure**
   **Status Code:** `500 Internal Server Error`

   **Response Body:**
   ```json
   {
     "message": "Failed to calculate distance and time"
   }
   ```

---

## Endpoint: `/maps/get-suggestions`

### Description
This endpoint provides autocomplete suggestions for a given input string.

### HTTP Method
**GET**

### Query Parameters
- `input` (string, required): The input string to retrieve suggestions for. Must be at least 3 characters long.

**Where to send:** Include the `input` parameter in the query string of the URL.

Example:
```
/maps/get-suggestions?input=San
```

### Response

#### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
[
  {
    "description": "San Francisco, CA, USA",
    "place_id": "ChIJIQBpAG2ahYAR_6128GcTUEo"
  },
  {
    "description": "San Jose, CA, USA",
    "place_id": "ChIJ9T_5iuTKj4AR1p1nTSaRtuQ"
  }
]
```

#### Error Responses
1. **Validation Errors**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "Input must be at least 3 characters long",
         "param": "input",
         "location": "query"
       }
     ]
   }
   ```

2. **Internal Server Error**
   **Status Code:** `500 Internal Server Error`

   **Response Body:**
   ```json
   {
     "message": "Internal server error"
   }
   ```

## Endpoint: `/rides/create`
### Description
This endpoint is used to create a new ride. It calculates the fare based on the pickup and destination locations and the selected vehicle type.

### HTTP Method
**POST**

### Headers
- `Authorization`: Bearer token (JWT) (required)

### Request Body
The endpoint expects the following JSON payload:

```json
{
  "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "vehicleType": "car"
}
```

### Validation Rules
- `pickup` (string, required): Must be at least 3 characters long.
- `destination` (string, required): Must be at least 3 characters long.
- `vehicleType` (string, required): Must be one of `car`, `motorcycle`, or `auto`.

### Response

#### Success Response
**Status Code:** `201 Created`

**Response Body:**
```json
{
  "_id": "64a7b2c3d4e5f6g7h8i9j0k1",
  "user": "64a7b2c3d4e5f6g7h8i9j0k2",
  "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "fare": 120,
  "status": "pending",
  "otp": "123456"
}
```

#### Error Responses

1. **Validation Errors**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "Invalid pickup address",
         "param": "pickup",
         "location": "body"
       },
       {
         "msg": "Invalid destination address",
         "param": "destination",
         "location": "body"
       },
       {
         "msg": "Invalid vehicleType",
         "param": "vehicleType",
         "location": "body"
       }
     ]
   }
   ```

2. **Internal Server Error**
   **Status Code:** `500 Internal Server Error`

   **Response Body:**
   ```json
   {
     "message": "Internal server error"
   }
   ```

### Notes
- The `authUser` middleware is used to verify the user's authentication status.
- The fare is calculated dynamically based on the distance and duration between the pickup and destination locations, as well as the selected vehicle type.
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.








## Endpoint: `/rides/get-fare`

### Description
This endpoint calculates the estimated fare for a ride based on the pickup and destination locations.

### HTTP Method
**GET**

### Query Parameters
- `pickup` (string, required): The starting location. Must be at least 3 characters long.
- `destination` (string, required): The destination location. Must be at least 3 characters long.

### Headers
- `Authorization` (string, required): The Bearer token for authentication.

### Response

#### Success Response
**Status Code:** `200 OK`

**Response Body:**
```json
{
  "fare": 120,
  "distance": "10 km",
  "duration": "15 mins"
}
```

#### Error Responses

1. **Validation Errors**
   **Status Code:** `400 Bad Request`

   **Response Body:**
   ```json
   {
     "errors": [
       {
         "msg": "Invalid pickup address",
         "param": "pickup",
         "location": "query"
       },
       {
         "msg": "Invalid destination address",
         "param": "destination",
         "location": "query"
       }
     ]
   }
   ```

2. **Unauthorized Access**
   **Status Code:** `401 Unauthorized`

   **Response Body:**
   ```json
   {
     "message": "Unauthorized access"
   }
   ```

3. **Internal Server Error**
   **Status Code:** `500 Internal Server Error`

   **Response Body:**
   ```json
   {
     "message": "Internal server error"
   }
   ```

### Notes
- The `authUser` middleware is used to verify the user's authentication status.
- Ensure that the `Authorization` header is set with a valid JWT token.