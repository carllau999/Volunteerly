import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./_helpers";

import { Main } from "./Main";


render(
<Provider store={store}>
		<Main />

		</Provider>, document.getElementById('root')
);
 