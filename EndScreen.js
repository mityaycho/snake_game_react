'use strict';
const React = require('react');
const { Color, Box } = require('ink');

module.exports = ({size}) => (
	<Box 
	flexDirection="column" 
	height={size} 
	width={size} 
	alignItems="center" 
	justifyContent="center"
	>
		<Color red>Game Over</Color>
		<Color green>Your snake is dead</Color>
	</Box>
)