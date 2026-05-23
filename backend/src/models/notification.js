const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define(
	'Notification',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},

		recipientId: {
			type: DataTypes.UUID,
			allowNull: false,
		},

		senderId: {
			type: DataTypes.UUID,
			allowNull: true,
		},

		type: {
			type: DataTypes.ENUM(
				'NEW_COMMENT',
				'NEW_REPLY',
				'NEW_POST',
				'POST_VOTE',
				'COMMENT_VOTE',
			),
			allowNull: false,
		},

		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},

		postId: {
			type: DataTypes.UUID,
			allowNull: true,
		},

		commentId: {
			type: DataTypes.UUID,
			allowNull: true,
		},

		link: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		tableName: 'Notifications',
		timestamps: true,
	},
);

module.exports = Notification;