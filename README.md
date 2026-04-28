# DEV TINDER 

# start the frontend using 

- cd devtinder-web
- npm run dev


- 1. Created a Vite + React application and start it.
- 2. Remove unnecessary code and create a Hello app.
- 3. Install Tailwind CSS.
- 4. Install Daisy UI and navbar component to your App.jsx
- 5. Install React Router Dom.
- 6. Create BrowserRoute > Routes > Route=/ Body > RouteChildren.
- 7. Create an Outlet in Body.jsx Component (to render children components).
- 8. Create a Footer.
- 9. Start making Login Page.
- 10. Install Axios.
- 11. For CORS error - install cors in backend => add middlware with configurations : origin, credentials: true
- 12. Whenever you're making API call so pass axios => {withCredentials: true} in frontend by using this you will be able to see token back in application.
- 13. Install react-redux + @reduxjs/toolkit -> https://redux-toolkit.js.org/tutorials/quick-start
- 14. configureStore => Provider => createSlice => add resucer to the store.
- 15. Add redux devtools in your browser.
- 16. Login and see if your data is coming properly in the redux store.
- 17. Navbar should update as soon as user logs. 
- 18. Refactor our code to add constants file + create a components folder.
- 19. 




-> download ES7+ React/Redux Snippets extension. 
# Navbar creation 
- Make and Open Navbar.jsx and write racfce command.
# RAFCE ->  React Arrow Function Component with an Export statement 
- just type it and a function is made automatically.



# Structure 
Body 
    Navbar 
        Route=/            => Feed Api
        Route=/login       => Login Api
        Route=/connections => Connections Api
        Route=/profile     => Profile Api



# Outlet 
-> We create children routes like that 
<Route path="/" element={<Body />} >
    <Route path="/login" element={<Login />} />
</Route>
-> to render any childer routes in Body.jsx we have to import Outlet.




# FOR CHAT

- change the css for the Chat.jsx and then in the App.js link it using the "/chat/:targetUserId"

# in backend
- install socket.io



# Deployment
- Signup on AWS
- Launch instance
- chmod 400 <secret>.pem
- ssh -i "devTinder-secret.pem" ubuntu@ec2-43-204-96-49.ap-south-1.compute.amazonaws.com
- Install Node version 16.17.0
- Git clone

# Frontend
- npm install > dependencies install
- npm run build
- sudo apt update
- sudo apt install nginx
- sudo systemctl start nginx
- sudo systemctl enable nginx
- Copy code from dist(build files) to /var/www/html/
- sudo scp -r dist/* /var/www/html/
- Enable port :80 of your instance


# Backend
- updated DB password
- allowed ec2 instance public IP on mongodb server
- npm intsall pm2 -g
- pm2 start npm -- name "devTinder-backend" -- start
- pm2 logs
- pm2 list, pm2 flush <name> , pm2 stop <name>, pm2 delete <name>
- config nginx - /etc/nginx/sites-available/default
- restart nginx - sudo systemctl restart nginx
- Modify the BASEURL in frontend project to "/api"
- updated BASE_URL
