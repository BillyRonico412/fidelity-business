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
import Push from "./pages/Push"
import Pull from "./pages/Pull"
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
				return <Redirect to="/home" />
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
						<Route exact={true} path="/login">
							{getComponentByAuthenticatedStatus(<Login />, false)}
							<Login />
						</Route>
						<Route exact={true} path="/create-account">
							{getComponentByAuthenticatedStatus(<CreateAccount />, false)}
						</Route>
						<Route exact={true} path="/forgot-password">
							{getComponentByAuthenticatedStatus(<ForgotPassword />, false)}
						</Route>
						<Route exact={true} path="/push">
							{getComponentByAuthenticatedStatus(<Push />, true)}
						</Route>
						<Route exact={true} path="/pull">
							{getComponentByAuthenticatedStatus(<Pull />, true)}
						</Route>
						<Route exact={true} path="/setting">
							{getComponentByAuthenticatedStatus(<Setting />, true)}
						</Route>
						<Route exact={true} path="/">
							{user === undefined && <Fragment />}
							{user === null && <Redirect to="/login" />}
							{user && <Redirect to="/push" />}
						</Route>
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
