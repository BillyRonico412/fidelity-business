import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonInput,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { useSetAtom } from "jotai"
import { tryit } from "radash"
import { useCallback, useEffect, useState } from "react"
import { hiddenTabsAtom, toastAtom } from "../../utils/store"

const ForgotPassword = () => {
	const [email, setEmail] = useState("")
	const setHiddenTabs = useSetAtom(hiddenTabsAtom)
	useEffect(() => {
		setHiddenTabs(true)
	}, [setHiddenTabs])
	const setToast = useSetAtom(toastAtom)

	const onClick = useCallback(async () => {
		const auth = getAuth()
		auth.languageCode = "fr"
		const [err] = await tryit(sendPasswordResetEmail)(auth, email)
		if (err) {
			setToast({
				message: err.message,
				color: "danger",
			})
			return
		}
		setToast({
			message: "Un email a été envoyé",
			color: "success",
		})
	}, [email, setToast])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton />
					</IonButtons>
					<IonTitle>Mot de passe oublié</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen={true}>
				<div className="w-full h-full px-4 py-4 flex flex-col gap-y-8">
					<div className="flex flex-col gap-y-4 my-auto">
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
						<IonButton onClick={onClick}>Envoyer</IonButton>
					</div>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default ForgotPassword
