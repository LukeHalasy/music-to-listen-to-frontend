let api_key = 'cd16fdf50b85ea2ad3a03c556084d286'
const CONFIG = {
	LASTFM_API_KEY: process.env.REACT_APP_LASTFM_API_KEY || api_key,
	SERVER_URL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'
};

export default CONFIG
