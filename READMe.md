steps to run NodeJs File Management project backend 

1) In the terminal install node_modules by using "npm i"
2) Create .env file and create mongoDb string or copy paste below credentials
   /**
   
   MONGO_URI="mongodb+srv://desaikalpesh2003:Rf4C7Q4AFK8GiqWX@cluster0.uzz1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   JWT_SECRET="AfhadfadskAHJDE"

    */
3) In the Third step run the server using command
   - "nodemon index.js" OR
   - "node index.js"

4) Start hitting Url using postman
   Authentication-:
   Register
   i) http://localhost:3000/api/auth/register
      Method type POST
      inside body send json as -:
      {
        "username": "testuser",
        "password": "securepassword"
      }
    
    ii) http://localhost:3000/api/auth/login
        Method Type: POST
        body -: 
        {
            "username": "testuser",
            "password": "securepassword"
        }

        copy the token that you received after login

    iii) http://localhost:3000/api/files/upload
        Method: POST
        In headers put Authorization -: Bearer paste your token here
        Click on send the file will get uploaded 

    iv) http://localhost:3000/api/files/download/:fileId
        Method: POST
        {
            "code": "1234" // here put the file code you recived while uploading
        }
        keep headers step as it is
        In postman select body -> form-data- enter key as file and selct file from dropdown then 
        selct the file you want to upload and click on arrow button beside "send" button
        and then click on "send and download"

        if code is correct it will get download

    v) http://localhost:3000/api/files/delete/:fileId
        Method: DELETE
        keep headers step as it is
        In url indead keeping :fileId put there the objectID from the database
        File will get deleted if you are the user who creted that file

    vi) http://localhost:3000/api/files/
        Method: GET
        hit this endpoint and you will get the files which you have created
