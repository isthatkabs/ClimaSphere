import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export function usePreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setPreferences({})
      setLoading(false)
      return
    }
    const ref = doc(db, 'user_preferences', user.uid)
    getDoc(ref)
      .then(snap => {
        setPreferences(snap.exists() ? (snap.data().suggestions ?? {}) : {})
      })
      .finally(() => setLoading(false))
  }, [user])

  // reaction: 'liked' | 'disliked' | null (null removes the preference)
  const setPreference = useCallback(async (text, reaction) => {
    if (!user) return
    const next = { ...preferences }
    if (reaction === null) delete next[text]
    else next[text] = reaction
    setPreferences(next)
    const ref = doc(db, 'user_preferences', user.uid)
    await setDoc(ref, { suggestions: next }, { merge: true })
  }, [user, preferences])

  return { preferences, setPreference, loading }
}
