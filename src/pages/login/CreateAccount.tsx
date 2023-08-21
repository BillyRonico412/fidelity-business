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
import emailRegex from "email-regex"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database"
import { useSetAtom } from "jotai"
import { tryit } from "radash"
import { useCallback, useEffect, useState } from "react"
import { hiddenTabsAtom, toastAtom } from "../../utils/store"
import { passwordSchema } from "../../utils/utils"

const CreateAccount = () => {
	const setHiddenTabs = useSetAtom(hiddenTabsAtom)
	useEffect(() => {
		setHiddenTabs(true)
	}, [setHiddenTabs])

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")
	const [businessName, setBusinessName] = useState("")
	const setToast = useSetAtom(toastAtom)

	const onSubmit = useCallback(async () => {
		const auth = getAuth()
		if (businessName === "") {
			setToast({
				message: "Veuillez entrer le nom de l'entreprise",
				color: "danger",
			})
			return
		}
		if (email === "") {
			setToast({
				message: "Veuillez entrer une adresse email",
				color: "danger",
			})
			return
		}
		if (!emailRegex({ exact: true }).test(email)) {
			setToast({
				message: "Veuillez entrer une adresse email valide",
				color: "danger",
			})
			return
		}
		if (password === "") {
			setToast({
				message: "Veuillez entrer un mot de passe",
				color: "danger",
			})
			return
		}
		if (!passwordSchema.validate(password)) {
			setToast({
				message:
					"Le mot de passe doit contenir au moins 8 caractères, dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
				color: "danger",
			})
			return
		}
		if (passwordConfirmation === "") {
			setToast({
				message: "Veuillez confirmer le mot de passe",
				color: "danger",
			})
			return
		}
		if (password !== passwordConfirmation) {
			setToast({
				message: "Les mots de passe ne correspondent pas",
				color: "danger",
			})
			return
		}
		const [err, userCredential] = await tryit(createUserWithEmailAndPassword)(
			auth,
			email,
			password,
		)
		if (err) {
			setToast({
				message: err.message,
				color: "danger",
			})
			return
		}
		const user = userCredential.user
		const db = getDatabase()
		set(ref(db, `providers/${user.uid}`), {
			businessName,
		})
		setToast({
			message: "Votre compte a bien été créé",
			color: "success",
		})
	}, [businessName, email, password, passwordConfirmation, setToast])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton />
					</IonButtons>
					<IonTitle>Inscription</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen={true}>
				<div className="w-full h-full flex flex-col px-4 py-4 gap-y-8">
					<div className="flex flex-col gap-y-4 mt-auto">
						<IonInput
							type="text"
							label="Nom de l'entreprise"
							labelPlacement="floating"
							fill="solid"
							onInput={(e) => {
								if (typeof e.currentTarget.value === "string") {
									setBusinessName(e.currentTarget.value)
								}
							}}
							value={businessName}
						/>
					</div>
					<div className="flex flex-col gap-y-4">
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
						<IonInput
							type="password"
							label="Confirmation du mot de passe"
							labelPlacement="floating"
							fill="solid"
							onInput={(e) => {
								if (typeof e.currentTarget.value === "string") {
									setPasswordConfirmation(e.currentTarget.value)
								}
							}}
							value={passwordConfirmation}
						/>
					</div>
					<IonButton onClick={onSubmit} className="mb-auto">
						S'inscrire
					</IonButton>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default CreateAccount
