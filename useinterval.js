'use strict';
const { useEffect, useRef } = require("react");

module.exports = function useinterval(callback, delay) {
	const savadCallback = useRef();

	useEffect(() => {
		savadCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			savadCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}