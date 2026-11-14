import { useNavigate } from 'react-router-dom'

export function useGoBack() {
  const navigate = useNavigate()
  return () => (window.history.state?.idx ? navigate(-1) : navigate('/home'))
}
