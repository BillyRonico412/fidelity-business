import {
	IonButton,
	IonContent,
	IonHeader,
	IonInput,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useSetAtom } from "jotai"
import { tryit } from "radash"
import { useCallback, useEffect, useState } from "react"
import { hiddenTabsAtom, toastAtom } from "../../utils/store"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const setHiddenTabs = useSetAtom(hiddenTabsAtom)
	useEffect(() => {
		setHiddenTabs(true)
	}, [setHiddenTabs])

	const setToast = useSetAtom(toastAtom)
	const onConnect = useCallback(async () => {
		const auth = getAuth()
		const [err] = await tryit(signInWithEmailAndPassword)(auth, email, password)
		if (err) {
			setToast({
				message: err.message,
				color: "danger",
			})
			return
		}
		setToast({
			message: "Vous êtes connecté",
			color: "success",
		})
	}, [email, password, setToast])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Authentification</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen={true}>
				<div className="w-full h-full px-4 py-4 flex flex-col gap-y-8">
					<div className="flex flex-col gap-y-4 mt-auto">
						<IonInput
							type="text"
							label="Adresse email"
							labelPlacement="floating"
							fill="solid"
							onInput={(e) => {
								if (typeof e.currentTarget.value === "string") {
									setEmail(e.currentTarget.value)
								}
							}}
							value={email}
						/>
						<IonInput
							type="password"
							label="Mot de passe"
							labelPlacement="floating"
							fill="solid"
							onInput={(e) => {
								if (typeof e.currentTarget.value === "string") {
									setPassword(e.currentTarget.value)
								}
							}}
							value={password}
						/>
					</div>
					<div className="flex flex-col gap-y-4 mb-auto">
						<IonButton onClick={onConnect}>Se connecter</IonButton>
						<IonButton className="w-full" routerLink="/create-account">
							S'inscrire
						</IonButton>
						<IonButton
							className="w-full"
							routerLink="/forgot-password"
							fill="clear"
						>
							Mot de passe oublié
						</IonButton>
					</div>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default Login
