  import React from 'react';
  import "bootstrap/dist/css/bootstrap.min.css";
  import { BrowserRouter as Router, Route } from "react-router-dom";

  import ItemList from "./components/items.component";

  function App() {
      return ( <Router >
                    <div className = "container container-fluid" >
                        <Route path = "/"exact component = { ItemList }/> 
                    </div> 
                </Router>
      );
  }

  export default App;