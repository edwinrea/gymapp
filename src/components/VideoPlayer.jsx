import './VideoPlayer.css'

export default function VideoPlayer({ 
  src, 
  thumbnail, 
  alt = 'Ejercicio',
  className = '' 
}) {
  const handleVerVideo = () => {
    if (src) {
      window.open(src, '_blank', 'noopener,noreferrer')
    }
  }

  // Si no hay thumbnail ni src, mostrar fallback
  if (!thumbnail && !src) {
    return (
      <div className={`video-player ${className}`}>
        <div className="video-fallback">
          <span className="video-fallback-icon">🏋️</span>
          <span className="video-fallback-text">{alt}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`video-player ${className}`}>
      <div className="video-thumbnail-container">
        <img 
          src={thumbnail} 
          alt={alt}
          className="video-thumbnail"
          loading="lazy"
        />
      </div>
      {src && (
        <button 
          onClick={handleVerVideo}
          className="video-play-btn"
          title="Ver video en YouTube"
        >
          <svg width="24" height="24" viewBox="0 0 68 48" fill="none">
            <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/>
            <path d="M45 24L27 14v20" fill="white"/>
          </svg>
          <span>Ver video en YouTube</span>
        </button>
      )}
    </div>
  )
}
