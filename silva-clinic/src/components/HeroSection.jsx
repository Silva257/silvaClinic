import { useRef, useState } from 'react'
import { FaHospital, FaImage } from 'react-icons/fa'
import { settingsApi } from '../utils/storage.js'

// Styled-graphic hero by default. Call settingsApi.save({ heroImageUrl }) with
// a real photo/URL later (e.g. from an "edit hero" button) to switch it out -
// this component already reads that setting on load.
export default function HeroSection() {
  const [heroImageUrl, setHeroImageUrl] = useState(() => settingsApi.get().heroImageUrl)
  const fileInputRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result
      settingsApi.save({ heroImageUrl: url })
      setHeroImageUrl(url)
    }
    reader.readAsDataURL(file)
  }

  return (
    <section
      className="hero"
      style={heroImageUrl ? { backgroundImage: `url(${heroImageUrl})` } : undefined}
    >
      <div className="hero-overlay">
        <FaHospital className="hero-icon" />
        <h1>Silva Clinic</h1>
        <p>Itambabiniga-kyegegwa &middot; Practitioner: Silva Charles</p>
        <button className="btn btn-light" onClick={() => fileInputRef.current?.click()}>
          <FaImage /> {heroImageUrl ? 'Change photo' : 'Add a hero photo'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </div>
    </section>
  )
}
