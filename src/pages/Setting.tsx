import {
	IonButton,
	IonContent,
	IonHeader,
	IonPage,
	IonText,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { getAuth, signOut } from "firebase/auth"
import { getDatabase, off, onValue, ref } from "firebase/database"
import { useAtomValue, useSetAtom } from "jotai"
import { tryit } from "radash"
import { useCallback, useEffect, useState } from "react"
import { z } from "zod"
import { hiddenTabsAtom, toastAtom, userAtom } from "../utils/store"

const Setting = () => {
	const setHiddenTabs = useSetAtom(hiddenTabsAtom)
	useEffect(() => {
		setHiddenTabs(false)
	}, [setHiddenTabs])

	const setToast = useSetAtom(toastAtom)
	const [businessName, setBusinessName] = useState("")
	const user = useAtomValue(userAtom)

	useEffect(() => {
		if (!user) {
			return
		}
		const db = getDatabase()
		const businessNameRef = ref(db, `providers/${user.uid}`)
		onValue(businessNameRef, (snapshot) => {
			if (!snapshot.exists()) {
				return
			}
			const businessNameParsed = z
				.object({
					businessName: z.string(),
				})
				.parse(snapshot.val())
			setBusinessName(businessNameParsed.businessName)
			return () => {
				off(businessNameRef)
			}
		})
	}, [user])

	const disconnect = useCallback(async () => {
		const auth = getAuth()
		const [err] = await tryit(signOut)(auth)
		if (err) {
			setToast({
				message: err.message,
				color: "danger",
			})
			return
		}
		setToast({
			message: "Déconnexion réussie",
			color: "success",
		})
	}, [setToast])
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Setting</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen={true}>
				<div className="w-full h-full px-4 py-4 flex flex-col gap-y-8">
					<div className="my-auto flex flex-col gap-y-8">
						<IonText className="font-semibold text-center">
							{businessName}
						</IonText>
						<IonButton onClick={disconnect}>Deconnexion</IonButton>
					</div>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default Setting
