# DEV TINDER 

- 1. Created a Vite + React application and start it.
- 2. Remove unnecessary code and create a Hello app.
- 3. Install Tailwind CSS.
- 4. Install Daisy UI and navbar component to your App.jsx
- 5. Install React Router Dom.
- 6. Create BrowserRoute > Routes > Route=/ Body > RouteChildren.
- 7. Create an Outlet in Body.jsx Component (to render children components).
- 8. Create a Footer.
- 9. Start making Login Page.


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
