import { FaMusic } from 'react-icons/fa';
import siteData from '../content/siteData';
import { isConfiguredExternalUrl, openExternalUrl } from '../utils/externalLinks';

const SongRequest = () => {
  const { songRequest } = siteData;
  const isSongFormConfigured = isConfiguredExternalUrl(songRequest.formUrl);

  const handleFormClick = () => {
    openExternalUrl(songRequest.formUrl);
  };

  return (
    <section className="song-request-section">
      <FaMusic className="song-icon" />
      <h2 className="section-title">{songRequest.title}</h2>
      <p className="section-text">{songRequest.description}</p>
      <button
        className="cta-btn"
        onClick={handleFormClick}
        type="button"
        disabled={!isSongFormConfigured}
        aria-disabled={!isSongFormConfigured}
      >
        {songRequest.ctaLabel}
      </button>
      {!isSongFormConfigured && <p className="link-helper">{songRequest.formUnavailableText}</p>}
    </section>
  );
};

export default SongRequest;
