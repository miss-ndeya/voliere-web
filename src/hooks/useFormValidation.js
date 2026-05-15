import { useState } from 'react'

/**
 * Hook de validation de formulaire
 * 
 * Gère la validation côté client avec messages d'erreur personnalisés
 * 
 * @param {Object} initialValues - Valeurs initiales du formulaire
 * @param {Object} validationRules - Règles de validation
 * @returns {Object} État du formulaire et fonctions de validation
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Valider un champ spécifique
   */
  const validateField = (name, value) => {
    const rules = validationRules[name]
    if (!rules) return null

    // Required
    if (rules.required && !value) {
      return rules.required.message || 'Ce champ est requis'
    }

    // Min length
    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message || `Minimum ${rules.minLength.value} caractères`
    }

    // Max length
    if (rules.maxLength && value.length > rules.maxLength.value) {
      return rules.maxLength.message || `Maximum ${rules.maxLength.value} caractères`
    }

    // Min value
    if (rules.min && parseFloat(value) < rules.min.value) {
      return rules.min.message || `Valeur minimale : ${rules.min.value}`
    }

    // Max value
    if (rules.max && parseFloat(value) > rules.max.value) {
      return rules.max.message || `Valeur maximale : ${rules.max.value}`
    }

    // Pattern (regex)
    if (rules.pattern && !rules.pattern.value.test(value)) {
      return rules.pattern.message || 'Format invalide'
    }

    // Email
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return rules.email.message || 'Email invalide'
      }
    }

    // Custom validation
    if (rules.validate) {
      const result = rules.validate(value, values)
      if (result !== true) {
        return result
      }
    }

    return null
  }

  /**
   * Valider tous les champs
   */
  const validateAll = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  /**
   * Gérer le changement d'un champ
   */
  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))

    // Valider si le champ a déjà été touché
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  /**
   * Gérer le blur d'un champ
   */
  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, values[name])
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  /**
   * Réinitialiser le formulaire
   */
  const reset = (newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  /**
   * Définir les erreurs manuellement (pour les erreurs serveur)
   */
  const setServerErrors = (serverErrors) => {
    const formattedErrors = {}
    
    // Format Laravel : { field: ['error1', 'error2'] }
    if (typeof serverErrors === 'object') {
      Object.keys(serverErrors).forEach(key => {
        const errorMessages = serverErrors[key]
        if (Array.isArray(errorMessages)) {
          formattedErrors[key] = errorMessages[0]
        } else {
          formattedErrors[key] = errorMessages
        }
      })
    }
    
    setErrors(formattedErrors)
  }

  /**
   * Gérer la soumission du formulaire
   */
  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true)
    
    // Marquer tous les champs comme touchés
    const allTouched = {}
    Object.keys(validationRules).forEach(key => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    // Valider
    const isValid = validateAll()

    if (isValid) {
      try {
        await onSubmit(values)
      } catch (error) {
        // Gérer les erreurs serveur
        if (error.response?.data?.errors) {
          setServerErrors(error.response.data.errors)
        }
        throw error
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setIsSubmitting(false)
    }

    return isValid
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setServerErrors,
    validateField,
    validateAll,
    setValues,
    hasErrors: Object.keys(errors).some(key => errors[key])
  }
}
