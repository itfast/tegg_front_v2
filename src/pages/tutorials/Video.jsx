/* eslint-disable react/prop-types */
/* eslint-disable no-useless-escape */

function YouTubeGetID(youtubeUrl) {
  let url = youtubeUrl;
  let ID = '';
  url = String(url)
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = String(ID[0]);
  } else {
    ID = url;
  }
  return ID;
}

export function Video({ url }) {
  if (url !== undefined) {
    const urlNew = `https://www.youtube.com/embed/${YouTubeGetID(url)}`;
    const src = `${urlNew}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0`;
    return (
      <iframe
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        style={{
          minHeight: 'inherit',
        }}
        width="100%"
        height="100%"
        title="video"
        src={src}
      />
    );
  }
  return (
    <div
      style={{
        minHeight: 'inherit',
        width: '100%',
        height: '100%',
        // backgroundColor: '#00D959',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src="/assets/tegg-verde.png"
        alt="Tegg Logo"
        style={{ width: '250px', maxWidth: '100%' }}
      />
    </div>
  );
}