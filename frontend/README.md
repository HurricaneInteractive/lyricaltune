- cd into `frontend` and run `yarn` or `npm i` to install all required packages.
- Run `yarn start` or `npm start` to start up a development server.
- To start electron run `electron .` from within the `frontend` folder.

### Project Structure
**Primary Files**
- App.scss: Main CSS file. Only `@import` stylesheets here. Do **NOT** write CSS in this file
- App.js: Main js file. Write the Router configuration and initial app fetch requests.

**Component Separation**
Components are separated into two main folders, *Components* and *Pages*.
- **Components**
  - Write all reusable components in this folder. 
  - If a component is global (e.g Header) it can stay in the first level of the folder: `components > Header.js`
  - If a component used repeatedly, group similar components into a folder. `components > Form > Input.js`.
  - If a component is unique to a page append "Page" to the folder name: `components > ProfilePage > FollowerCount.js`
- **Page**
  - Write the Page component; e.g Profile. These should be built out of the components in the *Components* folder.
  - Functionality which this component should be limited to passing down props or fetching data.