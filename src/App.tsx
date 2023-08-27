import {
	IonApp,
	IonIcon,
	IonLabel,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonToast,
	setupIonicReact,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { Redirect, Route } from "react-router-dom"
import Login from "./pages/login/Login"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/padding.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"

/* Tailwind css */
import "./tailwind.css"

/* Theme variables */
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { cogSharp, download, push } from "ionicons/icons"
import { useAtom, useAtomValue } from "jotai"
import { Fragment, useCallback, useEffect } from "react"
import Pull from "./pages/Pull"
import Push from "./pages/Push"
import Setting from "./pages/Setting"
import CreateAccount from "./pages/login/CreateAccount"
import ForgotPassword from "./pages/login/ForgotPassword"
import "./theme/variables.css"
import { hiddenTabsAtom, toastAtom, userAtom } from "./utils/store"
setupIonicReact()

const App = () => {
	const [user, setUser] = useAtom(userAtom)
	const [toast, setToast] = useAtom(toastAtom)
	const auth = getAuth()
	const hiddenTabs = useAtomValue(hiddenTabsAtom)
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setUser(user)
		})
	}, [setUser, auth])

	const getComponentByAuthenticatedStatus = useCallback(
		(component: JSX.Element, showComponentWhenAuthenticated: boolean) => {
			if (user === undefined) {
				return <></>
			}
			if (user === null && showComponentWhenAuthenticated) {
				return <Redirect to="/login" />
			}
			if (user && !showComponentWhenAuthenticated) {
				return <Redirect to="/push" />
			}
			return component
		},
		[user],
	)

	return (
		<IonApp>
			<IonReactRouter>
				<IonTabs>
					<IonRouterOutlet>
						<Route
							exact={true}
							path="/login"
							render={() => getComponentByAuthenticatedStatus(<Login />, false)}
						/>
						<Route
							exact={true}
							path="/create-account"
							render={() =>
								getComponentByAuthenticatedStatus(<CreateAccount />, false)
							}
						/>
						<Route
							exact={true}
							path="/forgot-password"
							render={() =>
								getComponentByAuthenticatedStatus(<ForgotPassword />, false)
							}
						/>
						<Route
							exact={true}
							path="/push"
							render={() => getComponentByAuthenticatedStatus(<Push />, true)}
						/>
						<Route
							exact={true}
							path="/pull"
							render={() => getComponentByAuthenticatedStatus(<Pull />, true)}
						/>
						<Route
							exact={true}
							path="/setting"
							render={() =>
								getComponentByAuthenticatedStatus(<Setting />, true)
							}
						/>
						<Route
							exact={true}
							path="/"
							render={() => {
								if (user === undefined) {
									return <Fragment />
								}
								if (user === null) {
									return <Redirect to="/login" />
								}
								return <Redirect to="/push" />
							}}
						/>
					</IonRouterOutlet>
					<IonTabBar slot="bottom" hidden={hiddenTabs}>
						<IonTabButton tab="scan" href="/push">
							<IonIcon icon={push} />
							<IonLabel class="font-semibold">Donner</IonLabel>
						</IonTabButton>
						<IonTabButton tab="pull" href="/pull">
							<IonIcon icon={download} />
							<IonLabel class="font-semibold">Consommer</IonLabel>
						</IonTabButton>
						<IonTabButton tab="paramètre" href="/setting">
							<IonIcon icon={cogSharp} />
							<IonLabel class="font-semibold">Paramètre</IonLabel>
						</IonTabButton>
					</IonTabBar>
				</IonTabs>
			</IonReactRouter>
			<IonToast
				isOpen={toast !== undefined}
				message={toast?.message}
				onDidDismiss={() => {
					setToast(undefined)
				}}
				color={toast?.color}
				duration={3000}
			/>
		</IonApp>
	)
}

export default App
