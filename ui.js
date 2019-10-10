'use strict';
const React = require('react');
const {useState, useEffect, useContext} = require('react');
const PropTypes = require('prop-types');
const {Text, Color, Box, StdinContext} = require('ink');
const useInterval = require('./useinterval');
const importJsx = require('import-jsx');
const EndScreen = importJsx('./EndScreen.js');

const ARROW_UP = "\u001B[A";
const ARROW_DOWN = "\u001B[B";
const ARROW_LEFT = "\u001B[D";
const ARROW_RIGHT = "\u001B[C";

const FIELD_SIZE = 22;
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

let foodItem = {
	x: Math.floor(Math.random() * FIELD_SIZE),
	y: Math.floor(Math.random() * FIELD_SIZE)
};

const DIRECTION = {
	RIGHT: {x: 1, y: 0},
	LEFT: {x: -1, y: 0},
	TOP: {x: 0, y: -1},
	BOTTOM: {x: 0, y: 1}
};

function getItem(x, y, snakeSegments) {
	if (foodItem.x === x && foodItem.y === y) {
		return <Color red> X </Color>;
	}

	for (const segment of snakeSegments) {
		if (segment.x === x && segment.y === y) {
			return <Color green> o </Color>;
		}
	}
};

function limitByField(coordinates) {
	if (coordinates >= FIELD_SIZE) {
		return 0;
	}
	if (coordinates < 0) {
		return FIELD_SIZE - 1;
	}
	return coordinates;
};

function newSnakePosition(segments, direction) {
	const [head] = segments;
	const newHead = {
		x: limitByField(head.x + direction.x),
		y: limitByField(head.y + direction.y)
	};
	if (collidesWithFood(newHead, foodItem)) {
		foodItem = {
			x: Math.floor(Math.random() * FIELD_SIZE),
			y: Math.floor(Math.random() * FIELD_SIZE)
		};
		return [newHead, ...segments];
	}
	return [newHead, ...segments.slice(0, -1)];
};

function collidesWithFood(head, foodItem) {
	return head.x === foodItem.x && head.y === foodItem.y;
};

const App = () => {
	const [snakeSegments, setSnakeSegments] = useState([
		{x: 8, y: 8},
		{x: 8, y: 7},
		{x: 8, y: 6}
	]);

	const [direction, setDirection] = useState(DIRECTION.LEFT);
	const {stdin, setRawMode} = useContext(StdinContext);

	useEffect(() => {
		setRawMode(true);
		stdin.on("data", data => {
			const value = data.toString();
			switch (value) {
				case ARROW_UP :
					setDirection(DIRECTION.TOP);
					break;

				case ARROW_DOWN :
					setDirection(DIRECTION.BOTTOM);
					break;

				case ARROW_LEFT :
					setDirection(DIRECTION.LEFT);
					break;

				case ARROW_RIGHT :
					setDirection(DIRECTION.RIGHT);
					break;
			}
		});
	}, []);

	const [head, ...tail] = snakeSegments;
	const intersectsWithItself = tail.some(segment => segment.x === head.x && segment.y === head.y);
	const speed = () => {
		if (snakeSegments.length >= 5 && (snakeSegments.length < 10)) {
			return 500;
		}

		if (snakeSegments.length >= 10 && (snakeSegments.length < 15)) {
			return 400;
		}

		if (snakeSegments.length >= 15 && (snakeSegments.length < 20)) {
			return 300;
		}

		if (snakeSegments.length >= 20 && (snakeSegments.length < 25)) {
			return 200;
		}

		if (snakeSegments.length >= 25 && (snakeSegments.length < 30)) {
			return 100;
		}

		if (snakeSegments.length >= 30 && (snakeSegments.length < 35)) {
			return 100;
		}
	}

useInterval(() => {
	setSnakeSegments(segments => newSnakePosition(segments, direction))
}, intersectsWithItself ? null : speed());

return (
	<Box flexDirection="column" alignItems="center">
		<Text>
			<Color green>Snake</Color> game
		</Text>
		{intersectsWithItself ? (
			<EndScreen size={FIELD_SIZE}/>
		) : (
			<Box flexDirection="column">
				{FIELD_ROW.map(y => (
					<Box key={y}>
						{FIELD_ROW.map(x => (
							<Box key={x}> {getItem(x, y, snakeSegments) || " . "} </Box>
						))}
					</Box>
				))}
			</Box>
		)}
	</Box>
);
}
;

App.propTypes = {
	name: PropTypes.string
};

App.defaultProps = {
	name: 'Stranger'
};

module.exports = App;
