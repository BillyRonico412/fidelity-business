import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
	IonIcon,
	useIonAlert,
} from "@ionic/react"
import { getDatabase, ref, child, get, set } from "firebase/database"
import { remove, add } from "ionicons/icons"
import { useSetAtom, useAtomValue } from "jotai"
import { tryit } from "radash"
import { useEffect, useState, useCallback } from "react"
import { OnResultFunction, QrReader } from "react-qr-reader"
import { z } from "zod"
import { hiddenTabsAtom, userAtom, toastAtom } from "../utils/store"

interface Props {
	type: "push" | "pull"
}

const PushPull = (props: Props) => {
	const setHiddenTabs = useSetAtom(hiddenTabsAtom)
	useEffect(() => {
		setHiddenTabs(false)
	}, [setHiddenTabs])
	const [isOpenScanner, setIsOpenScanner] = useState(false)
	const [point, setPoint] = useState(
		(() => {
			switch (props.type) {
				case "push":
					return 1
				case "pull":
					return 5
			}
		})(),
	)
	const [present] = useIonAlert()
	const user = useAtomValue(userAtom)
	const setToast = useSetAtom(toastAtom)
	const onScanSuccess: OnResultFunction = useCallback(
		async (result) => {
			if (!result) {
				return
			}
			if (!user) {
				setToast({
					message: "Error: no user",
					color: "danger",
				})
				return
			}
			const userUid = result.getText()
			const db = getDatabase()
			const dbRef = ref(db)
			const [err1, lastPoint] = await tryit(get)(
				child(dbRef, `users/${userUid}/points/${user.uid}`),
			)
			if (err1) {
				setToast({
					message: `Error: ${err1.message}`,
					color: "danger",
				})
				return
			}
			const lastPointParsed = z.number().nullable().parse(lastPoint.val()) ?? 0

			if (props.type === "pull" && lastPointParsed < point) {
				setToast({
					message: `Erreur: Pas assez de points, il reste ${lastPointParsed} point(s)`,
					color: "danger",
				})
				return
			}

			const newPoints = (() => {
				switch (props.type) {
					case "push":
						return lastPointParsed + point
					case "pull":
						return lastPointParsed - point
				}
			})()

			const newPointsRef = ref(db, `users/${userUid}/points/${user.uid}`)
			const [err2] = await tryit(set)(newPointsRef, newPoints)
			if (err2) {
				setToast({
					message: `Error: ${err2.message}`,
					color: "danger",
				})
				return
			}
			const verb = (() => {
				switch (props.type) {
					case "push":
						return "donné(s)"
					case "pull":
						return "consommé(s)"
				}
			})()
			setIsOpenScanner(false)
			present({
				header: `Points ${verb}`,
				message: `${point} point(s) ${verb}, solde: ${newPoints} point(s)`,
			})
		},
		[point, setToast, user, props.type, present],
	)
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>
						{(() => {
							switch (props.type) {
								case "push":
									return "Donner des points"
								case "pull":
									return "Consommer des points"
							}
						})()}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen={true}>
				<div className="w-full h-full px-4 py-8 flex flex-col gap-y-8">
					<div className="flex flex-col gap-y-12 mt-auto">
						{isOpenScanner && (
							<QrReader
								constraints={{ facingMode: "environment" }}
								onResult={onScanSuccess}
							/>
						)}
						<div className="flex justify-center items-center gap-x-4">
							<IonButton
								size="small"
								onClick={() => {
									if (point > 1) {
										setPoint(point - 1)
									}
								}}
							>
								<IonIcon icon={remove} size="large" />
							</IonButton>
							<div className="flex flex-col items-center">
								<p className="text-5xl">{point} </p>
								<p>point(s)</p>
							</div>
							<IonButton
								size="small"
								onClick={() => {
									setPoint(point + 1)
								}}
							>
								<IonIcon icon={add} size="large" />
							</IonButton>
						</div>
						<IonButton
							size="large"
							shape="round"
							onClick={() => {
								setIsOpenScanner(!isOpenScanner)
							}}
						>
							{isOpenScanner ? "Fermer le Scanner" : "Ouvrir le Scanner"}
						</IonButton>
					</div>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default PushPull
